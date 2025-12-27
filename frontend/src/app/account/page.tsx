"use client";

import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-extrabold mb-6">
          My Account
        </h1>

        <AccountItem title="Profile" href="/account/profile" />
        <AccountItem title="Saved Addresses" href="/account/addresses" />
        <AccountItem title="My Orders" href="/orders" />
        <AccountItem title="Wishlist" href="/wishlist" />

      </div>
    </div>
  );
}

function AccountItem({ title, href }: any) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-2xl
      bg-black/40 border border-white/10
      hover:bg-white/5 transition"
    >
      <p className="text-lg font-semibold">{title}</p>
    </Link>
  );
}
