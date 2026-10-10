import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

const isBrowser = typeof window !== "undefined";

/**
 * Shared anon-key client. Safe to ship: every table is protected by RLS (see
 * supabase/migrations). On the server it never persists a session, so SSR only ever reads
 * what an anonymous visitor could read.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: isBrowser,
          autoRefreshToken: isBrowser,
          detectSessionInUrl: isBrowser,
        },
      })
    : null;
