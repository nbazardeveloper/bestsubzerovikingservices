import { createMiddleware } from "@tanstack/react-start";

// Supabase persists sessions in localStorage as `sb-<project-ref>-auth-token`.
// Checking for that key first means anonymous visitors (every public page)
// never download the Supabase SDK just to learn there's no token to attach.
function hasStoredSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) return true;
    }
  } catch {
    // Storage unavailable (private mode, blocked cookies) — no session.
  }
  return false;
}

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (!hasStoredSession()) return next();
    const { supabase } = await import("./client");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
