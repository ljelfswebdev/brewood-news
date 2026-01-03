// app/admin/layout.jsx
'use client';

import Banner from "@/components/Banner";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAdminHome = pathname === "/admin";

  return (
    <>
    <Banner title="Brewood Admin"/>
        <section className="container pt-10 pb-6 space-y-4">
      {!isAdminHome && (
        <Link
          href="/admin"
          className="button button--primary mt-10"
        >
          Back to Admin Home
        </Link>
      )}

      {children}
    </section>
    </>

  );
}