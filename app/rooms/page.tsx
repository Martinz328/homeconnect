import { RoomsBrowse } from "@/components/RoomsBrowse";
import type { Listing } from "@/components/ListingCard";

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    host_name: "Amara M.",
    room_type: "Room-Kitchen-Toilet",
    quarter: "Molyko",
    spaces: 2,
    price_per_2weeks: 28000,
    amenities: ["water", "power", "wifi", "kitchen"],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    host_name: "Fongod E.",
    room_type: "Single Room",
    quarter: "Bonduma",
    spaces: 1,
    price_per_2weeks: 15000,
    amenities: ["water", "power", "fan"],
    photos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "3",
    host_name: "Njang P.",
    room_type: "Studio",
    quarter: "Sandpit",
    spaces: 2,
    price_per_2weeks: 35000,
    amenities: ["water", "power", "wifi", "ac", "kitchen"],
    photos: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop",
    ],
  },
];

export default function BrowseRoomsPage() {
  return <RoomsBrowse listings={SAMPLE_LISTINGS} />;
}
