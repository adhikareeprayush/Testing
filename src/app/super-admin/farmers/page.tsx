import { listFarmersForAdmin } from "@/lib/actions/super-admin.actions";
import VerifyFarmerButtons from "@/components/VerifyFarmerButtons";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SuperAdminFarmersPage() {
  const list = await listFarmersForAdmin();
  if (list === null) redirect("/");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-dark">Farmers</h1>
      <p className="text-sm text-muted">
        Verify farmers before they can add or edit products. Unverified accounts can log in but cannot list inventory.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 text-left">
              <tr>
                <th className="p-3 font-semibold text-primary-800">Name</th>
                <th className="p-3 font-semibold text-primary-800">Email</th>
                <th className="p-3 font-semibold text-primary-800">Products</th>
                <th className="p-3 font-semibold text-primary-800">Status</th>
                <th className="p-3 font-semibold text-primary-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{f.name ?? "—"}</td>
                  <td className="p-3">{f.email}</td>
                  <td className="p-3">{f._count.farmerProducts}</td>
                  <td className="p-3">
                    {f.farmerVerified ? (
                      <span className="text-green-700 font-medium">Verified</span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="p-3">
                    <VerifyFarmerButtons userId={f.id} verified={f.farmerVerified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
