import { getSuperAdminAnalytics } from "@/lib/actions/super-admin.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SuperAdminHomePage() {
  const data = await getSuperAdminAnalytics();
  if (!data) redirect("/");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-dark">Platform overview</h1>
        <p className="text-muted mt-1">Analytics across customers, farmers, and orders.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-muted">Customers</p>
          <p className="text-3xl font-bold text-primary-700">{data.customerCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-muted">Farmers (verified / total)</p>
          <p className="text-3xl font-bold text-dark">
            {data.verifiedFarmerCount}{" "}
            <span className="text-lg text-muted font-normal">
              / {data.farmerCount}
            </span>
          </p>
          <p className="text-xs text-amber-700 mt-2">
            {data.pendingFarmers} pending verification
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-muted">Active products</p>
          <p className="text-3xl font-bold text-dark">{data.productCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-muted">Orders (non-cancelled)</p>
          <p className="text-3xl font-bold text-dark">{data.orderCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sm:col-span-2">
          <p className="text-sm text-muted">Total order value</p>
          <p className="text-3xl font-bold text-primary-700">
            ${data.revenueTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
