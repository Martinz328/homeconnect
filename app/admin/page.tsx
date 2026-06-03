"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { ListingCard, type Listing } from "@/components/ListingCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const pendingListings: Listing[] = [
  {
    id: "ROOM-007",
    host_name: "Amara M.",
    room_type: "Room-Kitchen-Toilet",
    quarter: "Molyko",
    spaces: 2,
    price_per_2weeks: 28000,
    amenities: ["water", "power", "wifi"],
    photos: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
  },
  {
    id: "ROOM-012",
    host_name: "Fongod E.",
    room_type: "Single Room",
    quarter: "Bonduma",
    spaces: 1,
    price_per_2weeks: 15000,
    amenities: ["water", "power"],
    photos: ["/placeholder1.jpg", "/placeholder2.jpg"],
  },
];

const liveListings: Listing[] = [
  {
    id: "ROOM-001",
    host_name: "Njang P.",
    room_type: "Room-Kitchen-Toilet",
    quarter: "Molyko",
    spaces: 3,
    price_per_2weeks: 35000,
    amenities: ["water", "power", "wifi"],
    photos: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
  },
  {
    id: "ROOM-003",
    host_name: "Amara K.",
    room_type: "Single Room",
    quarter: "Buea Town",
    spaces: 1,
    price_per_2weeks: 18000,
    amenities: ["water", "power"],
    photos: ["/placeholder1.jpg", "/placeholder2.jpg"],
  },
  {
    id: "ROOM-005",
    host_name: "Tabi J.",
    room_type: "Room-Kitchen-Toilet",
    quarter: "Mile 17",
    spaces: 2,
    price_per_2weeks: 22000,
    amenities: ["water", "power", "wifi"],
    photos: [
      "/placeholder1.jpg",
      "/placeholder2.jpg",
      "/placeholder3.jpg",
      "/placeholder4.jpg",
    ],
  },
];

const paymentLogs = [
  {
    listingId: "ROOM-003",
    hostName: "Amara K.",
    method: "MTN",
    date: "Jun 22, 2026",
    amount: "4 500 FCFA",
  },
  {
    listingId: "ROOM-001",
    hostName: "Njang P.",
    method: "Orange",
    date: "Jun 21, 2026",
    amount: "5 000 FCFA",
  },
  {
    listingId: "ROOM-005",
    hostName: "Tabi J.",
    method: "MTN",
    date: "Jun 20, 2026",
    amount: "4 000 FCFA",
  },
  {
    listingId: "ROOM-002",
    hostName: "Fonge M.",
    method: "MTN",
    date: "Jun 18, 2026",
    amount: "4 500 FCFA",
  },
];

function PaymentLogForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"MTN" | "Orange" | null>(
    null,
  );

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#D4500A] font-inter text-[14px] font-semibold text-white"
          >
            + Log New Payment
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className="mt-4 space-y-4 rounded-[12px] bg-white p-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Listing ID
              </label>
              <Input
                placeholder="ROOM-001"
                className="h-12 rounded-[8px] text-[14px]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Service Fee Collected
              </label>
              <Input
                type="number"
                placeholder="e.g. 4500"
                className="h-12 rounded-[8px] text-[14px]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Payment Method
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("MTN")}
                  className={`h-12 flex-1 rounded-[8px] font-inter text-[14px] font-semibold transition-colors ${
                    paymentMethod === "MTN"
                      ? "bg-[#D4500A] text-white"
                      : "border border-[#E5E5EA] bg-white text-[#1C1C1E]"
                  }`}
                >
                  MTN
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Orange")}
                  className={`h-12 flex-1 rounded-[8px] font-inter text-[14px] font-semibold transition-colors ${
                    paymentMethod === "Orange"
                      ? "bg-[#D4500A] text-white"
                      : "border border-[#E5E5EA] bg-white text-[#1C1C1E]"
                  }`}
                >
                  Orange
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Examiner Name
              </label>
              <Input
                placeholder="Optional"
                className="h-12 rounded-[8px] text-[14px]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Notes
              </label>
              <Textarea
                placeholder="Any notes..."
                className="h-20 resize-none rounded-[8px] text-[14px]"
              />
            </div>

            <button
              type="button"
              className="h-12 w-full rounded-[8px] bg-[#D4500A] font-inter text-[14px] font-semibold text-white"
            >
              Save Payment Log
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function AdminDashboard() {
  const handleApprove = (id: string) => {
    console.log("Approve", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject", id);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#E5E5EA] bg-white px-4">
        <span className="font-inter text-[18px] font-bold text-[#1C1C1E]">
          Admin
        </span>
        <button
          type="button"
          className="font-inter text-[14px] font-normal text-[#D4500A]"
        >
          Log out
        </button>
      </header>

      <Tabs defaultValue="pending" className="w-full">
        <div className="sticky top-14 z-40 border-b border-[#E5E5EA] bg-white">
          <TabsList className="h-12 w-full gap-0 rounded-none bg-white p-0">
            <TabsTrigger
              value="pending"
              className="h-full flex-1 rounded-none border-b-2 border-transparent font-inter text-[14px] text-[#6C6C70] data-[state=active]:border-[#D4500A] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#D4500A] data-[state=active]:shadow-none"
            >
              Pending ({pendingListings.length})
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="h-full flex-1 rounded-none border-b-2 border-transparent font-inter text-[14px] text-[#6C6C70] data-[state=active]:border-[#D4500A] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#D4500A] data-[state=active]:shadow-none"
            >
              Live ({liveListings.length})
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="h-full flex-1 rounded-none border-b-2 border-transparent font-inter text-[14px] text-[#6C6C70] data-[state=active]:border-[#D4500A] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#D4500A] data-[state=active]:shadow-none"
            >
              Payment Log
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="space-y-4 p-4">
          {pendingListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showAdminActions
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </TabsContent>

        <TabsContent value="live" className="space-y-4 p-4">
          {liveListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showExpireAction
              onSetExpired={(id) => console.log("Set expired", id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="payments" className="p-4">
          <PaymentLogForm />

          <div
            className="overflow-hidden rounded-[12px] bg-white"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            {paymentLogs.map((log, index) => (
              <div key={log.listingId}>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-inter text-[14px] font-semibold text-[#1C1C1E]">
                      {log.listingId} · {log.hostName}
                    </p>
                    <p className="font-inter text-[12px] font-normal text-[#6C6C70]">
                      {log.method} · {log.date}
                    </p>
                  </div>
                  <span className="font-inter text-[15px] font-bold text-[#1A6B3C]">
                    {log.amount}
                  </span>
                </div>
                {index < paymentLogs.length - 1 && (
                  <div className="mx-4 h-px bg-[#E5E5EA]" />
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
