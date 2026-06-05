"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  approveListing,
  logPayment,
  rejectListing,
  setExpired,
  type BookingLog,
} from "@/app/actions/admin";
import { adminLogout } from "@/app/actions/auth";
import {
  AdminListingCard,
  type AdminListingView,
} from "@/components/AdminListingCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";

type AdminDashboardProps = {
  pendingListings: AdminListingView[];
  liveListings: AdminListingView[];
  paymentLog: BookingLog[];
};

function formatLogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PaymentLogForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"MTN" | "Orange" | null>(
    null,
  );
  const [listingId, setListingId] = useState("");
  const [feePaid, setFeePaid] = useState("");
  const [examinerName, setExaminerName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!listingId.trim()) {
      setError("Listing ID is required.");
      return;
    }
    const fee = Number.parseInt(feePaid, 10);
    if (!Number.isInteger(fee) || fee <= 0) {
      setError("Enter a valid service fee amount.");
      return;
    }
    if (!paymentMethod) {
      setError("Select a payment method.");
      return;
    }

    startTransition(async () => {
      const result = await logPayment({
        listing_id: listingId.trim(),
        fee_paid: fee,
        payment_method: paymentMethod,
        examiner_name: examinerName.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error ?? "Could not save payment log.");
        return;
      }

      setListingId("");
      setFeePaid("");
      setExaminerName("");
      setNotes("");
      setPaymentMethod(null);
      setIsOpen(false);
      router.refresh();
    });
  };

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
          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 rounded-[12px] bg-white p-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Listing ID
              </label>
              <Input
                placeholder="e.g. 42"
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
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
                value={feePaid}
                onChange={(e) => setFeePaid(e.target.value)}
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
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
                className="h-12 rounded-[8px] text-[14px]"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
                Notes
              </label>
              <Textarea
                placeholder="Any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-20 resize-none rounded-[8px] text-[14px]"
              />
            </div>

            {error && (
              <p className="text-center text-[14px] text-[#C0392B]">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-[8px] bg-[#D4500A] font-inter text-[14px] font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save Payment Log"}
            </button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function AdminDashboard({
  pendingListings,
  liveListings,
  paymentLog,
}: AdminDashboardProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      router.push("/admin/login");
    });
  };

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approveListing(id);
      router.refresh();
    });
  };

  const handleReject = (id: string) => {
    const note = window.prompt("Optional rejection note:");
    if (note === null) return;

    startTransition(async () => {
      await rejectListing(id, note.trim() || undefined);
      router.refresh();
    });
  };

  const handleSetExpired = (id: string) => {
    startTransition(async () => {
      await setExpired(id);
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#E5E5EA] bg-white px-4">
        <span className="font-inter text-[18px] font-bold text-[#1C1C1E]">
          Admin
        </span>
        <button
          type="button"
          onClick={handleLogout}
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
          {pendingListings.length === 0 ? (
            <p className="py-8 text-center font-inter text-[14px] text-[#6C6C70]">
              No pending listings.
            </p>
          ) : (
            pendingListings.map((listing) => (
              <AdminListingCard
                key={listing.id}
                listing={listing}
                showAdminActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4 p-4">
          {liveListings.length === 0 ? (
            <p className="py-8 text-center font-inter text-[14px] text-[#6C6C70]">
              No live listings.
            </p>
          ) : (
            liveListings.map((listing) => (
              <AdminListingCard
                key={listing.id}
                listing={listing}
                submittedLabel={`Listed ${formatLogDate(listing.created_at)}`}
                showExpireAction
                onSetExpired={handleSetExpired}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="payments" className="p-4">
          <PaymentLogForm />

          <div
            className="overflow-hidden rounded-[12px] bg-white"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            {paymentLog.length === 0 ? (
              <p className="p-4 text-center font-inter text-[14px] text-[#6C6C70]">
                No payments logged yet.
              </p>
            ) : (
              paymentLog.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-inter text-[14px] font-semibold text-[#1C1C1E]">
                        #{log.listing_id}
                        {log.examiner_name ? ` · ${log.examiner_name}` : ""}
                      </p>
                      <p className="font-inter text-[12px] font-normal text-[#6C6C70]">
                        {log.payment_method} · {formatLogDate(log.created_at)}
                      </p>
                    </div>
                    <span className="font-inter text-[15px] font-bold text-[#1A6B3C]">
                      {formatPrice(log.fee_paid)}
                    </span>
                  </div>
                  {index < paymentLog.length - 1 && (
                    <div className="mx-4 h-px bg-[#E5E5EA]" />
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
