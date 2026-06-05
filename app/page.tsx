import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-[#E5E5EA] px-5 flex items-center">
        <Link
          href="/"
          className="font-jakarta text-xl font-bold text-[#D4500A] transition-opacity hover:opacity-80"
        >
          HomeConnect
        </Link>
      </header>

      {/* Hero Section */}
      <section className="bg-white px-5 py-8">
        <h1
          className="text-[30px] font-extrabold leading-tight text-[#1C1C1E] text-balance"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          Find A Room In Buea
        </h1>
        <p
          className="mt-3 text-[15px] font-normal leading-[1.6] text-[#6C6C70]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Short-stay rooms, studios, apartments near all marking centres. Real photos, Moderate prices.
          Built for GCE marking season 2026.
        </p>

        {/* Trust Chips */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-semibold text-[#1A6B3C]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            ✔ Rooms Available
          </span>
          <span
            className="inline-flex items-center rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-semibold text-[#1A6B3C]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            ✔ GCE 2026 Season
          </span>
        </div>
      </section>

      {/* CTA Block */}
      <section className="bg-white px-5 py-6">
        <Link
          href="/host"
          className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#D4500A] text-base font-semibold text-white transition-colors active:bg-[#B03D07]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          List My Room
        </Link>
        <Link
          href="/rooms"
          className="mt-3 flex h-[52px] w-full items-center justify-center rounded-[10px] border-2 border-[#D4500A] bg-white text-base font-semibold text-[#D4500A] transition-colors active:bg-[#FDF0E8]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Find a Room
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F9F9F9] px-5 py-6">
        <h2
          className="text-[22px] font-bold text-[#1C1C1E]"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          How It Works
        </h2>

        {/* For Examiners */}
        <div className="mt-5">
          <h3
            className="text-[17px] font-semibold text-[#1C1C1E]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            For Examiners
          </h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Browse available rooms, studios, apartments suitable to you
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {"Pay a small fee to get the host's contact"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Book and move in. Sorted.
              </span>
            </li>
          </ul>
        </div>

        {/* For Room Owners */}
        <div className="mt-4">
          <h3
            className="text-[17px] font-semibold text-[#1C1C1E]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            For Room Owners
          </h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                List your room, studio, apartment for free. No signup required.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                We connect you with Interested GCE Examiners
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4500A]" />
              <span
                className="text-[15px] font-normal text-[#3A3A3C]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Collect your rent directly from the examiner
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Privacy Trust Banner */}
      <section className="bg-[#FDF0E8] px-4 py-4">
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[#D4500A]" />
          <p
            className="text-sm font-normal text-[#92400E]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Your contact is private. Only shared after an Interested verified Examineer requests it. View your listing in the "Find A Room" section.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-4 py-4">
        <p
          className="text-center text-xs font-normal text-[#6C6C70]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          © HomeConnect 2026 · Martins · Buea, Cameroon
        </p>
      </footer>
    </div>
  )
}
