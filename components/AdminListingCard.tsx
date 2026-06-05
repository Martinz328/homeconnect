"use client";

import { AMENITIES, HOUSE_RULES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export type AdminListingView = {
  id: string;
  host_name: string;
  whatsapp: string;
  room_type: string;
  quarter: string;
  quarter_other: string | null;
  spaces: number;
  price_per_2weeks: number;
  amenities: string[];
  house_rules: string[];
  photoUrls: string[];
  created_at: string;
  admin_note: string | null;
};

const AMENITY_LABELS = Object.fromEntries(
  AMENITIES.map((a) => [a.key, a.label]),
);
const RULE_LABELS = Object.fromEntries(
  HOUSE_RULES.map((r) => [r.key, r.label]),
);

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type AdminListingCardProps = {
  listing: AdminListingView;
  submittedLabel?: string;
  showAdminActions?: boolean;
  showExpireAction?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onSetExpired?: (id: string) => void;
};

export function AdminListingCard({
  listing,
  submittedLabel,
  showAdminActions = false,
  showExpireAction = false,
  onApprove,
  onReject,
  onSetExpired,
}: AdminListingCardProps) {
  const location =
    listing.quarter === "Other" && listing.quarter_other
      ? listing.quarter_other
      : listing.quarter;

  const amenitiesText = listing.amenities
    .map((key) => AMENITY_LABELS[key] ?? key)
    .join(", ");
  const rulesText = listing.house_rules
    .map((key) => RULE_LABELS[key] ?? key)
    .join(", ");

  return (
    <div
      className="rounded-[12px] bg-white p-4"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-inter text-[15px] font-bold text-[#D4500A]">
          #{listing.id}
        </span>
        <span className="font-inter text-[12px] font-normal text-[#6C6C70]">
          {submittedLabel ?? formatSubmittedAt(listing.created_at)}
        </span>
      </div>

      <div className="my-3 h-px bg-[#E5E5EA]" />

      <div className="mb-3">
        <p className="font-inter text-[15px] font-semibold text-[#1C1C1E]">
          {listing.host_name}
        </p>
        <p className="font-inter text-[14px] font-normal text-[#3A3A3C]">
          {listing.whatsapp}
        </p>
      </div>

      <div className="mb-2">
        <p className="font-inter text-[14px] font-medium text-[#1C1C1E]">
          {listing.room_type} · {location}
        </p>
        <p className="font-inter text-[13px] font-normal text-[#6C6C70]">
          Hosts {listing.spaces} · {formatPrice(listing.price_per_2weeks)} / 2
          weeks
        </p>
      </div>

      {amenitiesText && (
        <p className="mb-1 font-inter text-[13px] font-normal text-[#6C6C70]">
          {amenitiesText}
        </p>
      )}
      {rulesText && (
        <p className="mb-1 font-inter text-[13px] font-normal text-[#6C6C70]">
          {rulesText}
        </p>
      )}
      {listing.admin_note && (
        <p className="mb-3 font-inter text-[13px] font-normal text-[#C0392B]">
          Note: {listing.admin_note}
        </p>
      )}

      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {listing.photoUrls.map((url, index) =>
          url ? (
            <img
              key={index}
              src={url}
              alt={`Listing ${listing.id} photo ${index + 1}`}
              className="h-[60px] w-[60px] shrink-0 rounded-[8px] object-cover"
            />
          ) : (
            <div
              key={index}
              className="h-[60px] w-[60px] shrink-0 rounded-[8px] bg-[#E5E5EA]"
            />
          ),
        )}
      </div>

      {showAdminActions && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onApprove?.(listing.id)}
            className="h-12 flex-1 rounded-[8px] bg-[#1A6B3C] font-inter text-[14px] font-semibold text-white"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject?.(listing.id)}
            className="h-12 flex-1 rounded-[8px] border border-[#C0392B] bg-white font-inter text-[14px] font-semibold text-[#C0392B]"
          >
            Reject
          </button>
        </div>
      )}

      {showExpireAction && (
        <button
          type="button"
          onClick={() => onSetExpired?.(listing.id)}
          className="h-12 w-full rounded-[8px] border border-[#6C6C70] bg-white font-inter text-[14px] font-medium text-[#6C6C70]"
        >
          Set Expired
        </button>
      )}
    </div>
  );
}
