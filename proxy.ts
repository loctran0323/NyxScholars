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

  // Authenticated, on a portal page → role + plan checks.
  if (user && !isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, plan, plan_status")
      .eq("id", user.id)
      .single();

    const role = (profile?.role as "student" | "teacher" | null) ?? "student";

    // Teachers live under /portal/teacher and skip the paywall entirely.
    if (role === "teacher") {
      const onTeacherRoute =
        pathname.startsWith("/portal/teacher") ||
        pathname === "/portal/profile" ||
        pathname === "/portal/messages" ||
        pathname.startsWith("/portal/messages/");
      if (!onTeacherRoute) {
        return NextResponse.redirect(new URL("/portal/teacher", request.url));
      }
      return supabaseResponse;
    }

    // Students: a small allow-list bypasses the paywall.
    const studentAlwaysAllowed = [
      "/portal/upgrade",
      "/portal/profile",
    ];
    const isAlwaysAllowed = studentAlwaysAllowed.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
    // Students should never see the teacher portal.
    if (pathname.startsWith("/portal/teacher")) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    if (!isAlwaysAllowed) {
      const hasActivePlan =
        profile?.plan && profile?.plan_status === "active";
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
