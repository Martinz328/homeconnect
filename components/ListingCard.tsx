"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  Droplets,
  Lock,
  Sofa,
  Thermometer,
  Utensils,
  Users,
  Wifi,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { AMENITIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export type Listing = {
  id: string;
  host_name: string;
  room_type: string;
  quarter: string;
  spaces: number;
  price_per_2weeks: number;
  amenities: string[];
  photos: string[];
};

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Zap,
  BatteryCharging,
  Wifi,
  Utensils,
  Lock,
  Users,
  Sofa,
  Wind,
  Thermometer,
};

const AMENITY_BY_KEY = Object.fromEntries(
  AMENITIES.map((a) => [a.key, a]),
) as Record<string, (typeof AMENITIES)[number]>;

function isRemotePhoto(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export type ListingCardProps = {
  listing: Listing;
  showAdminActions?: boolean;
  showExpireAction?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onSetExpired?: (id: string) => void;
  whatsappLink?: string;
};

export function ListingCard({
  listing,
  showAdminActions = false,
  showExpireAction = false,
  onApprove,
  onReject,
  onSetExpired,
  whatsappLink,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const photos = listing.photos.length > 0 ? listing.photos : [""];
  const isAdminView = showAdminActions || showExpireAction;
  const hasCarousel = !isAdminView && photos.some(isRemotePhoto);
  const displayedAmenities = listing.amenities.slice(0, 5);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImageIndex < photos.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      } else if (diff < 0 && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    }
    setTouchStart(null);
  };

  return (
    <div
      className={
        isAdminView
          ? "rounded-[12px] bg-white p-4"
          : "overflow-hidden rounded-xl bg-card shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
      }
      style={
        isAdminView
          ? { boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
          : undefined
      }
    >
      {isAdminView && (
        <div className="mb-3">
          <span className="font-inter text-[15px] font-bold text-[#D4500A]">
            {listing.id}
          </span>
          <p className="mt-2 font-inter text-[15px] font-semibold text-[#1C1C1E]">
            {listing.host_name}
          </p>
        </div>
      )}

      {hasCarousel ? (
        <div
          className="relative h-[200px] w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={photos[currentImageIndex]}
            alt={`${listing.room_type} in ${listing.quarter}`}
            fill
            className="rounded-t-xl object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 w-1 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-white/50"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 flex gap-1.5 overflow-x-auto">
          {photos.map((photo, index) =>
            isRemotePhoto(photo) ? (
              <div
                key={index}
                className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px]"
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              </div>
            ) : (
              <div
                key={index}
                className="h-[60px] w-[60px] shrink-0 rounded-[8px] bg-[#E5E5EA]"
              />
            ),
          )}
        </div>
      )}

      <div className={hasCarousel ? "p-4" : isAdminView ? "" : "p-4"}>
        <div className="flex items-start justify-between">
          <div>
            <h3
              className={
                isAdminView
                  ? "font-inter text-[14px] font-medium text-[#1C1C1E]"
                  : "text-[17px] font-semibold text-foreground"
              }
            >
              {listing.room_type}
              {isAdminView && ` · ${listing.quarter}`}
            </h3>
            {!isAdminView && (
              <p className="text-[13px] text-muted-foreground">
                {listing.quarter}
              </p>
            )}
          </div>
          <span
            className={
              isAdminView
                ? "font-inter text-[13px] text-[#6C6C70]"
                : "text-[13px] text-muted-foreground"
            }
          >
            Hosts {listing.spaces}
          </span>
        </div>

        <div className="mt-2">
          <p
            className={
              isAdminView
                ? "font-inter text-[13px] text-[#6C6C70]"
                : "text-xl font-bold text-foreground"
            }
            style={
              isAdminView ? undefined : { fontVariantNumeric: "tabular-nums" }
            }
          >
            {formatPrice(listing.price_per_2weeks)}
            {!isAdminView && (
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / 2 weeks
              </span>
            )}
            {isAdminView && " / 2 weeks"}
          </p>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-3">
          {displayedAmenities.map((key) => {
            const amenity = AMENITY_BY_KEY[key];
            if (!amenity) return null;
            const Icon = AMENITY_ICONS[amenity.icon] ?? Droplets;
            return (
              <div
                key={key}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{amenity.label}</span>
              </div>
            );
          })}
        </div>

        {showAdminActions ? (
          <div className="mt-4 flex gap-2">
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
        ) : whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            GET CONTACT
          </a>
        ) : showExpireAction ? (
          <button
            type="button"
            onClick={() => onSetExpired?.(listing.id)}
            className="mt-4 h-12 w-full rounded-[8px] border border-[#6C6C70] bg-white font-inter text-[14px] font-medium text-[#6C6C70]"
          >
            Set Expired
          </button>
        ) : null}
      </div>
    </div>
  );
}
