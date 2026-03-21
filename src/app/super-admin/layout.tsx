import Link from "next/link";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
          <span className="font-bold text-primary-800">Super admin</span>
          <Link href="/super-admin" className="text-sm hover:text-primary-700">
            Overview
          </Link>
          <Link href="/super-admin/farmers" className="text-sm hover:text-primary-700">
            Farmers
          </Link>
          <Link href="/super-admin/customers" className="text-sm hover:text-primary-700">
            Customers
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-primary-700 ml-auto">
            ← Site
          </Link>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
