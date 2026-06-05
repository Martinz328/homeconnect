"use server";

import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase-server";

const ADMIN_SESSION_COOKIE = "hc-admin-session";

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Invalid credentials" };
  }

  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    return { success: false, error: "Invalid credentials" };
  }

  cookies().set(ADMIN_SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { success: true };
}

export async function adminLogout(): Promise<{ success: true }> {
  cookies().delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}
