"use client";

import { useState } from "react";

import { FilterBar, FilterBarTrigger } from "@/components/FilterBar";
import { ListingCard, type Listing } from "@/components/ListingCard";
import { buildWhatsAppLink } from "@/lib/utils";

type RoomsBrowseProps = {
  listings: Listing[];
};

export function RoomsBrowse({ listings }: RoomsBrowseProps) {
  const [filteredListings, setFilteredListings] = useState(listings);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-5">
        <span className="font-display text-xl font-bold text-primary">
          HomeConnect
        </span>
        <FilterBarTrigger onClick={() => setFilterOpen(true)} />
      </header>

      <FilterBar
        listings={listings}
        onFilter={setFilteredListings}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
      />

      <div className="px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} room
          {filteredListings.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            whatsappLink={buildWhatsAppLink({
              room_type: listing.room_type,
              quarter: listing.quarter,
              price_per_2weeks: listing.price_per_2weeks,
            })}
          />
        ))}
      </div>
    </div>
  );
}
