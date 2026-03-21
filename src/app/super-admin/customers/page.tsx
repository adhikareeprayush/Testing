import { listCustomersForAdmin } from "@/lib/actions/super-admin.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SuperAdminCustomersPage() {
  const list = await listCustomersForAdmin();
  if (list === null) redirect("/");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-dark">Customers</h1>
      <p className="text-sm text-muted">
        Registered shopper accounts (role: customer). They can browse, cart, and checkout.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 text-left">
              <tr>
                <th className="p-3 font-semibold text-primary-800">Name</th>
                <th className="p-3 font-semibold text-primary-800">Email</th>
                <th className="p-3 font-semibold text-primary-800">City</th>
                <th className="p-3 font-semibold text-primary-800">Orders</th>
                <th className="p-3 font-semibold text-primary-800">Joined</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{c.name ?? "—"}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.city ?? "—"}</td>
                  <td className="p-3">{c._count.orders}</td>
                  <td className="p-3 text-muted">
                    {c.createdAt.toLocaleDateString()}
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
