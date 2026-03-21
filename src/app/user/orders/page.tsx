import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/actions/order.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/user/orders");

  const orders = await getUserOrders();

  return (
    <div className="px-6 lg:px-12 py-8 max-w-[1700px] mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-dark">Home</Link>
        <span>/</span>
        <Link href="/user/dashboard" className="hover:text-dark">Dashboard</Link>
        <span>/</span>
        <span className="text-dark font-medium">Orders</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark">My Orders</h1>
        <Link href="/products" className="text-sm text-primary-700 border border-primary-200 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 bg-white rounded-2xl shadow-sm">
          <span className="text-5xl">📦</span>
          <h3 className="text-xl font-semibold text-dark">No orders yet</h3>
          <p className="text-muted">Your orders will appear here once you make a purchase</p>
          <Link href="/products" className="bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted">Order ID</p>
                    <p className="font-semibold text-dark">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Date</p>
                    <p className="font-medium text-dark">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Total</p>
                    <p className="font-bold text-dark">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Payment</p>
                    <p className="font-medium text-dark capitalize">{order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-50 rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted">× {item.quantity} · ${item.price.toFixed(2)} each</p>
                    </div>
                    <p className="font-semibold text-dark text-sm flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
                <div className="text-sm text-muted">
                  <span className="font-medium text-dark">Deliver to:</span> {order.address}, {order.city}, {order.zip}
                </div>
                <div className="flex gap-2">
                  {order.status === "DELIVERED" && (
                    <button className="text-xs px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors">
                      Leave Review
                    </button>
                  )}
                  <button className="text-xs px-4 py-2 bg-gray-100 text-dark rounded-lg hover:bg-gray-200 transition-colors">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
