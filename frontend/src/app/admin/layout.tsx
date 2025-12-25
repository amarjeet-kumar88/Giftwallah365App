"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827] text-white">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar />
          <main className="p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
