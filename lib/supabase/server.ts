import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createMockServerClient } from "@/lib/supabase/mock";

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = await cookies();

  // Local preview fallback: with no Supabase env (local dev / a no-backend demo)
  // serve a seeded mock so the whole portal renders and is interactive.
  // Production with real keys takes the unchanged path below.
  if (!url || !key) {
    return createMockServerClient({
      get: (name: string) => cookieStore.get(name),
      set: (name: string, value: string, options?: Record<string, unknown>) =>
        cookieStore.set(name, value, options),
    });
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
