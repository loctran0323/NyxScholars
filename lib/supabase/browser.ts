import { createBrowserClient } from "@supabase/ssr";
import { createMockBrowserClient } from "@/lib/supabase/mock";

let client: ReturnType<typeof createBrowserClient> | null = null;
let mockClient: ReturnType<typeof createMockBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Local preview fallback (see server.ts). Production with real keys uses the
  // real browser client below.
  if (!url || !key) {
    if (!mockClient) mockClient = createMockBrowserClient();
    return mockClient;
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}
