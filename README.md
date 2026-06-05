# HomeConnect 🏠

HomeConnect is a mobile-first, installable Progressive Web App (PWA) designed to seamlessly connect national examiners with short-stay room owners in Buea during the active GCE marking season.

🔗 **Live Production URL:** [https://homeconnect-gce.vercel.app/](https://homeconnect-gce.vercel.app/)

---

## ✨ Features

### 🔹 For Examiners
* **Real-time Discovery:** Browse verified rooms near localized marking centers with clear upfront pricing.
* **Interactive Filtering:** Client-side room filtering sorted by room types, quarters, and required amenities.
* **Secure Access:** Contact paths to room hosts are locked until verified by an administrator to avoid lead spamming.

### 🔸 For Room Hosts
* **3-Step Listing Flow:** Optimized multi-step responsive interface to register properties quickly.
* **Automated Client Optimization:** Automatic image compression using client-side web workers before storage uploading.
* **Privacy Controls:** WhatsApp contact strings are fully hidden from the public client layer.

### 🛠️ For Administrators
* **Secure Portal:** Protected server-side dashboard layout utilizing Supabase SSR authentication context.
* **Workflow Pipelines:** Moderate pending property posts directly via quick Approve, Reject, or Expire action controls.
* **Integrated Ledger:** Functional financial logbook to map collected service fees straight to internal string-based room identifiers (`ROOM-06`).

---

## 🚀 Technical Stack

* **Framework:** Next.js 14.2 (App Router, Server Components & Server Actions)
* **Database & Auth:** Supabase (PostgreSQL engine)
* **Backend Storage:** Supabase Cloud Storage (Public image CDN orchestration)
* **Styling:** Tailwind CSS + Radix UI Primitives (Shadcn UI boilerplate components)
* **PWA Engine:** Next-PWA (Workbox-driven background caching & automated service worker registration)
* **Image Compression:** Browser-image-compression (Web worker implementation)

---

## 📁 Database Schema Reference

### `listings` Table
Stores registered rental assets. Managed publicly via secure Row Level Security (RLS) constraints for inserts.
```sql
create table public.listings (
  id text primary key, -- Custom room string markers (e.g., 'ROOM-06')
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  host_name text not null,
  whatsapp text not null,
  room_type text not null,
  quarter text not null,
  quarter_other text,
  spaces integer not null,
  price_per_2weeks integer not null,
  amenities text[] default '{}'::text[] not null,
  house_rules text[] default '{}'::text[] not null,
  photos text[] default '{}'::text[] not null,
  status text default 'Pending'::text not null -- 'Pending', 'Live', 'Expired'
);
