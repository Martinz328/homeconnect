"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase-server";

const ADMIN_SESSION_COOKIE = "hc-admin-session";

export type Listing = {
  id: number;
  host_name: string;
  whatsapp: string;
  room_type: string;
  quarter: string;
  quarter_other: string | null;
  spaces: number;
  price_per_2weeks: number;
  amenities: string[];
  house_rules: string[];
  photos: string[];
  status: string;
  admin_note: string | null;
  created_at: string;
};

export type BookingLog = {
  id: number;
  listing_id: string;
  fee_paid: number;
  payment_method: "MTN" | "Orange";
  examiner_name: string | null;
  notes: string | null;
  created_at: string;
};

async function requireAdmin(): Promise<void> {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  const secret = process.env.COOKIE_SECRET;

  if (!session?.value || !secret || session.value !== secret) {
    throw new Error("Unauthorized");
  }
}

function listingIdFilter(id: string): string | number {
  const numericId = Number(id);
  if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
    return numericId;
  }
  return id;
}

export async function approveListing(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "Live" })
    .eq("id", listingIdFilter(id));

  if (error) {
    return { success: false, error: "Could not approve listing." };
  }

  revalidatePath("/admin");
  revalidatePath("/rooms");

  return { success: true };
}

export async function rejectListing(
  id: string,
  note?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("listings")
    .update({
      status: "Expired",
      admin_note: note ?? null,
    })
    .eq("id", listingIdFilter(id));

  if (error) {
    return { success: false, error: "Could not reject listing." };
  }

  revalidatePath("/admin");

  return { success: true };
}

export async function setExpired(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "Expired" })
    .eq("id", listingIdFilter(id));

  if (error) {
    return { success: false, error: "Could not update listing." };
  }

  revalidatePath("/admin");
  revalidatePath("/rooms");

  return { success: true };
}

export async function logPayment(data: {
  listing_id: string;
  fee_paid: number;
  payment_method: "MTN" | "Orange";
  examiner_name?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("booking_log").insert({
    listing_id: data.listing_id,
    fee_paid: data.fee_paid,
    payment_method: data.payment_method,
    examiner_name: data.examiner_name ?? null,
    notes: data.notes ?? null,
  });

  if (error) {
    // 👇 ADD THIS LINE TO PREVENT BLIND DEBUGGING
    console.error("❌ PAYMENT LOG GENERATION FAILED:", error);
    return { success: false, error: "Could not log payment." };
  }

  revalidatePath("/admin");

  return { success: true };
}

export async function getListings(status?: string): Promise<Listing[]> {
  await requireAdmin();

  const supabase = createAdminClient();
  let query = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Could not fetch listings.");
  }

  return (data ?? []) as Listing[];
}

export async function getPaymentLog(): Promise<BookingLog[]> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("booking_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not fetch payment log.");
  }

  return (data ?? []) as BookingLog[];
}
