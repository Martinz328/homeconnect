"use client";

import { useCallback, useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import type { Listing } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AMENITIES, QUARTERS } from "@/lib/constants";

const QUARTER_CHIPS = ["All", ...QUARTERS] as const;

type FilterBarProps = {
  listings: Listing[];
  onFilter: (filtered: Listing[]) => void;
  filterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
};

function applyFilters(
  listings: Listing[],
  activeQuarter: string,
  selectedQuarters: string[],
  minPrice: string,
  maxPrice: string,
  selectedAmenities: string[],
): Listing[] {
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;
  const sheetQuartersActive = selectedQuarters.length > 0;

  return listings.filter((listing) => {
    if (activeQuarter !== "All" && listing.quarter !== activeQuarter) {
      return false;
    }
    if (
      sheetQuartersActive &&
      !selectedQuarters.includes(listing.quarter)
    ) {
      return false;
    }
    if (min !== null && !Number.isNaN(min) && listing.price_per_2weeks < min) {
      return false;
    }
    if (max !== null && !Number.isNaN(max) && listing.price_per_2weeks > max) {
      return false;
    }
    if (
      selectedAmenities.length > 0 &&
      !selectedAmenities.every((a) => listing.amenities.includes(a))
    ) {
      return false;
    }
    return true;
  });
}

export function FilterBar({
  listings,
  onFilter,
  filterOpen: controlledOpen,
  onFilterOpenChange,
}: FilterBarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const filterOpen = controlledOpen ?? internalOpen;
  const setFilterOpen = onFilterOpenChange ?? setInternalOpen;

  const [activeQuarter, setActiveQuarter] = useState("All");
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const runFilter = useCallback(() => {
    onFilter(
      applyFilters(
        listings,
        activeQuarter,
        selectedQuarters,
        minPrice,
        maxPrice,
        selectedAmenities,
      ),
    );
  }, [
    listings,
    activeQuarter,
    selectedQuarters,
    minPrice,
    maxPrice,
    selectedAmenities,
    onFilter,
  ]);

  useEffect(() => {
    runFilter();
  }, [runFilter]);

  const clearFilters = () => {
    setSelectedQuarters([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedAmenities([]);
  };

  const toggleQuarterFilter = (quarter: string) => {
    setSelectedQuarters((prev) =>
      prev.includes(quarter)
        ? prev.filter((q) => q !== quarter)
        : [...prev, quarter],
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  return (
    <>
      <div className="sticky top-14 z-30 border-b border-border bg-card py-3 shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto px-5">
          {QUARTER_CHIPS.map((quarter) => (
            <button
              key={quarter}
              type="button"
              onClick={() => setActiveQuarter(quarter)}
              className={`h-10 shrink-0 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                activeQuarter === quarter
                  ? "border-primary bg-secondary font-semibold text-primary"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {quarter}
            </button>
          ))}
        </div>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="bottom"
          showCloseButton
          className="h-auto max-h-[85vh] overflow-y-auto rounded-t-3xl p-0"
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-8 rounded-full bg-border" />
          </div>

          <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-5 pb-4">
            <SheetTitle className="text-lg font-semibold text-foreground">
              Filter Rooms
            </SheetTitle>
            <SheetClose className="rounded-full p-1 hover:bg-muted">
              <X className="h-5 w-5 text-foreground" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="space-y-6 p-5">
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-foreground">
                Quarter
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {QUARTERS.map((quarter) => (
                  <button
                    key={quarter}
                    type="button"
                    onClick={() => toggleQuarterFilter(quarter)}
                    className={`h-10 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                      selectedQuarters.includes(quarter)
                        ? "border-primary bg-secondary font-semibold text-primary"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-foreground">
                Price Range (FCFA)
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-12 rounded-lg border-border"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-12 rounded-lg border-border"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-foreground">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => toggleAmenity(amenity.key)}
                    className={`h-10 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                      selectedAmenities.includes(amenity.key)
                        ? "border-primary bg-secondary font-semibold text-primary"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border p-5">
            <button
              type="button"
              onClick={clearFilters}
              className="text-[15px] font-medium text-muted-foreground"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="h-12 flex-1 rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Show Results
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function FilterBarTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center"
      aria-label="Open filters"
    >
      <SlidersHorizontal className="h-[22px] w-[22px] text-foreground" />
    </button>
  );
}
