import { FilterBar } from "@/components/FilterBar";
import { HomeConnectLogo } from "@/components/HomeConnectLogo";
import type { Listing } from "@/components/ListingCard";
import { createClient } from "@/lib/supabase-server";

type ListingRow = {
  id: number;
  host_name: string;
  room_type: string;
  quarter: string;
  spaces: number;
  price_per_2weeks: number;
  amenities: string[];
  house_rules: string[];
  photos: string[];
  status: string;
};

function mapListing(row: ListingRow): Listing {
  return {
    id: String(row.id),
    host_name: row.host_name,
    room_type: row.room_type,
    quarter: row.quarter,
    spaces: row.spaces,
    price_per_2weeks: row.price_per_2weeks,
    amenities: row.amenities ?? [],
    photos: row.photos ?? [],
  };
}

export const revalidate = 60;

export default async function RoomsPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, host_name, room_type, quarter, spaces, price_per_2weeks, amenities, house_rules, photos, status",
    )
    .eq("status", "Live")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch listings:", error.message);
  }

  const listings = (data ?? []).map((row) => mapListing(row as ListingRow));

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-5">
          <HomeConnectLogo />
        </header>
        <p className="px-4 py-16 text-center font-inter text-[15px] font-normal text-[#6C6C70]">
          No rooms listed yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FilterBar listings={listings} />
    </div>
  );
}
