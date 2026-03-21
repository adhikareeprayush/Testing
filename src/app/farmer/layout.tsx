import Link from "next/link";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] bg-primary-50/40">
      <div className="border-b border-primary-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <Link href="/farmer/dashboard" className="font-semibold text-primary-700">
            Farmer hub
          </Link>
          <Link
            href="/farmer/products/new"
            className="text-sm text-dark hover:text-primary-700"
          >
            Add product
          </Link>
          <Link href="/admin/upload" className="text-sm text-dark hover:text-primary-700">
            Upload images
          </Link>
          <Link href="/products" className="text-sm text-muted hover:text-primary-700 ml-auto">
            View storefront →
          </Link>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
