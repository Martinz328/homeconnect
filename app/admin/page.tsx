import {
  getListings,
  getPaymentLog,
  type Listing,
} from "@/app/actions/admin";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { AdminListingView } from "@/components/AdminListingCard";
import { resolveStoragePhotoUrl } from "@/lib/photos";

function mapListing(row: Listing): AdminListingView {
  return {
    id: String(row.id),
    host_name: row.host_name,
    whatsapp: row.whatsapp,
    room_type: row.room_type,
    quarter: row.quarter,
    quarter_other: row.quarter_other,
    spaces: row.spaces,
    price_per_2weeks: row.price_per_2weeks,
    amenities: row.amenities ?? [],
    house_rules: row.house_rules ?? [],
    photoUrls: (row.photos ?? []).map(resolveStoragePhotoUrl),
    created_at: row.created_at,
    admin_note: row.admin_note,
  };
}

export default async function AdminPage() {
  const [pendingRows, liveRows, paymentLog] = await Promise.all([
    getListings("Pending"),
    getListings("Live"),
    getPaymentLog(),
  ]);

  const pendingListings = pendingRows.map(mapListing);
  const liveListings = liveRows.map(mapListing);

  return (
    <AdminDashboard
      pendingListings={pendingListings}
      liveListings={liveListings}
      paymentLog={paymentLog}
    />
  );
}
