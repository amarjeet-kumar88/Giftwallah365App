"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function AccountPage() {
  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-full
            bg-linear-to-br from-indigo-500 to-purple-600
            flex items-center justify-center
            text-xl font-bold shadow-lg"
          >
            U
          </div>

          <div>
            <h1 className="text-3xl font-extrabold">
              My Account
            </h1>
            <p className="text-slate-400 text-sm">
              Manage your profile, orders & preferences
            </p>
          </div>
        </div>

        {/* ================= ACCOUNT OPTIONS ================= */}
        <div className="grid gap-4">

          <AccountItem
            title="Profile"
            subtitle="Personal details & login info"
            href="/account/profile"
            icon={User}
          />

          <AccountItem
            title="Saved Addresses"
            subtitle="Manage delivery locations"
            href="/account/addresses"
            icon={MapPin}
          />

          <AccountItem
            title="My Orders"
            subtitle="Track & view order history"
            href="/orders"
            icon={Package}
          />

          <AccountItem
            title="Wishlist"
            subtitle="Your saved favorite products"
            href="/wishlist"
            icon={Heart}
          />

        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ITEM ================= */

function AccountItem({
  title,
  subtitle,
  href,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="
        group flex items-center justify-between
        p-5 rounded-2xl
        bg-black/40 backdrop-blur-xl
        border border-white/10
        hover:bg-white/5
        transition-all duration-300
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          className="
            h-12 w-12 rounded-xl
            bg-white/10
            flex items-center justify-center
            group-hover:bg-indigo-500/20
            transition
          "
        >
          <Icon size={22} className="text-indigo-400" />
        </div>

        <div>
          <p className="text-lg font-semibold">
            {title}
          </p>
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <ChevronRight
        className="text-slate-500
        group-hover:text-white
        transition"
      />
    </Link>
  );
}
