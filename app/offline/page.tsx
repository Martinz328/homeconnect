"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <p className="text-center font-inter text-[15px] font-normal text-[#6C6C70]">
        You are offline. Please check your connection.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-6 h-12 rounded-lg bg-primary px-6 font-inter text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
