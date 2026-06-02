import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ADMIN_WHATSAPP } from "@/lib/constants";

const THOUSANDS_SEPARATOR = "\u202f";

export function formatPrice(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
  return `${formatted} FCFA`;
}

export function buildWhatsAppLink(listing: {
  room_type: string;
  quarter: string;
  price_per_2weeks: number;
}): string {
  const phone = ADMIN_WHATSAPP.replace(/\D/g, "");
  const message = `Hi, I found your listing on HomeConnect. I'm interested in the ${listing.room_type} in ${listing.quarter} listed at ${formatPrice(listing.price_per_2weeks)}. Is it still available?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
