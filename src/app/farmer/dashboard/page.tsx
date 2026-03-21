import Link from "next/link";
import Image from "next/image";
import { getFarmerDashboardData } from "@/lib/actions/farmer-product.actions";
import { FARMER_REVENUE_SHARE } from "@/lib/constants";
import DeleteFarmerProductButton from "@/components/DeleteFarmerProductButton";

export const dynamic = "force-dynamic";

export default async function FarmerDashboardPage() {
  const data = await getFarmerDashboardData();
  if (!data) {
    return (
      <p className="text-center text-muted py-12">
        You must be signed in as a farmer.
      </p>
    );
  }

  const { verified, products, stats } = data;
  const estimatedPayout = stats.grossSales * FARMER_REVENUE_SHARE;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-dark">Farmer dashboard</h1>
        <p className="text-muted mt-1">
          You don&apos;t purchase on this app — you list products and track sales revenue.
        </p>
      </div>

      {!verified && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 px-6 py-4 text-amber-900">
          <p className="font-semibold">Verification pending</p>
          <p className="text-sm mt-1">
            A super admin must verify your farm account before you can add or edit products or use image upload.
            Contact support or wait for approval.
          </p>
        </div>
      )}

      {verified && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-muted">Gross sales (your items)</p>
            <p className="text-2xl font-bold text-primary-700">
              ${stats.grossSales.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-muted">
              Est. payout ({Math.round(FARMER_REVENUE_SHARE * 100)}% share)
            </p>
            <p className="text-2xl font-bold text-dark">
              ${estimatedPayout.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-muted">Orders with your products</p>
            <p className="text-2xl font-bold text-dark">{stats.orderCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-muted">Units sold</p>
            <p className="text-2xl font-bold text-dark">{stats.lineItemsSold}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-dark">Your products</h2>
        {verified && (
          <Link
            href="/farmer/products/new"
            className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-800"
          >
            + Add product
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 text-left">
              <tr>
                <th className="p-3 font-semibold text-primary-800">Product</th>
                <th className="p-3 font-semibold text-primary-800">Price</th>
                <th className="p-3 font-semibold text-primary-800">Stock</th>
                <th className="p-3 font-semibold text-primary-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">
                    No products yet.
                    {verified && (
                      <>
                        {" "}
                        <Link href="/farmer/products/new" className="text-primary-700 underline">
                          Create one
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-dark">{p.name}</p>
                          <p className="text-xs text-muted">{p.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">${p.price.toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      {verified ? (
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/farmer/products/${p.id}/edit`}
                            className="text-primary-700 font-medium hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteFarmerProductButton id={p.id} />
                        </div>
                      ) : (
                        <span className="text-muted text-xs">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
