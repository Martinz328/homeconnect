"use server";

import { QUARTERS, ROOM_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase-server";

const WHATSAPP_PATTERN = /^6[0-9]{8}$/;
const VALID_SPACES = [1, 2, 3] as const;
const MIN_PRICE = 5000;
const MAX_PRICE = 500000;

type SubmitListingResult =
  | { success: true; id: number }
  | { success: false; error: string };

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isRoomType(value: string): value is (typeof ROOM_TYPES)[number] {
  return (ROOM_TYPES as readonly string[]).includes(value);
}

function isQuarter(value: any): value is (typeof QUARTERS)[number] {
  return (QUARTERS as readonly string[]).includes(value);
}

export async function submitListing(
  formData: FormData,
): Promise<SubmitListingResult> {
  const host_name = getString(formData, "host_name");
  const whatsapp = getString(formData, "whatsapp");
  const room_type = getString(formData, "room_type");
  const quarter = getString(formData, "quarter");
  const quarter_other = getString(formData, "quarter_other");

  const spacesRaw = getString(formData, "spaces");
  const priceRaw = getString(formData, "price_per_2weeks");

  const amenities = formData
    .getAll("amenities")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  const house_rules = formData
    .getAll("house_rules")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  const photos = formData
    .getAll("photos")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  if (host_name.length < 2 || host_name.length > 40) {
    return {
      success: false,
      error: "Host name must be between 2 and 40 characters.",
    };
  }

  if (!WHATSAPP_PATTERN.test(whatsapp)) {
    return {
      success: false,
      error: "WhatsApp must be a valid 9-digit Cameroon mobile number (e.g. 677123456).",
    };
  }

  if (!isRoomType(room_type)) {
    return { success: false, error: "Please select a valid room type." };
  }

  if (!isQuarter(quarter)) {
    return { success: false, error: "Please select a valid quarter." };
  }

  const spaces = Number.parseInt(spacesRaw, 10);
  if (
    !Number.isInteger(spaces) ||
    !VALID_SPACES.includes(spaces as (typeof VALID_SPACES)[number])
  ) {
    return {
      success: false,
      error: "Spaces must be 1, 2, or 3.",
    };
  }

  const price_per_2weeks = Number.parseInt(priceRaw, 10);
  if (
    !Number.isInteger(price_per_2weeks) ||
    price_per_2weeks < MIN_PRICE ||
    price_per_2weeks > MAX_PRICE
  ) {
    return {
      success: false,
      error: `Price must be an integer between ${MIN_PRICE.toLocaleString()} and ${MAX_PRICE.toLocaleString()} FCFA.`,
    };
  }

  if (photos.length < 1 || photos.length > 5) {
    return {
      success: false,
      error: "Please upload between 1 and 5 photos.",
    };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .insert({
      host_name,
      whatsapp,
      room_type,
      quarter,
      quarter_other: quarter_other || null,
      spaces,
      price_per_2weeks,
      amenities,
      house_rules,
      photos,
      status: "Pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("❌ DATABASE INSERTION FAILED:", error);
    return {
      success: false,
      error: "Could not submit listing. Please try again.",
    };
  }

  return { success: true, id: data.id };
}
