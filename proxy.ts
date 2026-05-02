import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname === "/portal/login" || pathname === "/portal/signup";

  // Redirect unauthenticated users to login
  if (!user && pathname.startsWith("/portal") && !isAuthPage) {
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  // For authenticated non-auth pages, check if the user has an active plan
  if (user && !isAuthPage) {
    // These pages are always accessible regardless of plan
    const alwaysAllowed = ["/portal/upgrade", "/portal/profile", "/portal/login", "/portal/signup"];
    const isAlwaysAllowed = alwaysAllowed.some((p) => pathname === p || pathname.startsWith(p + "/"));

    if (!isAlwaysAllowed) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, plan_status")
        .eq("id", user.id)
        .single();

      const hasActivePlan = profile?.plan && profile?.plan_status === "active";
      if (!hasActivePlan) {
        return NextResponse.redirect(new URL("/portal/upgrade", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/portal/:path*"],
};
