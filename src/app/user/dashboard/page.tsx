import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/user/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 5, include: { items: true } },
      _count: { select: { orders: true, reviews: true } },
    },
  });

  if (!user) redirect("/login");

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: user._count.orders, icon: "📦" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: "💰" },
    { label: "Reviews Given", value: user._count.reviews, icon: "⭐" },
    { label: "Member Since", value: new Date(user.createdAt).getFullYear().toString(), icon: "🌱" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="px-6 lg:px-12 py-8 max-w-[1700px] mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-dark">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Dashboard</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4 sticky top-24">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700 overflow-hidden">
              {user.image ? (
                <Image src={user.image} alt={user.name ?? ""} width={80} height={80} className="object-cover" />
              ) : (
                user.name?.[0]?.toUpperCase() ?? "U"
              )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-dark text-lg">{user.name}</h3>
              <p className="text-sm text-muted">{user.email}</p>
              {user.role === "ADMIN" && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
              )}
            </div>
            <nav className="w-full flex flex-col gap-1 pt-4 border-t border-gray-100">
              {[
                { href: "/user/dashboard", label: "Dashboard", icon: "🏠" },
                { href: "/user/orders", label: "My Orders", icon: "📦" },
                { href: "/cart", label: "My Cart", icon: "🛒" },
                { href: "/products", label: "Shop", icon: "🌿" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-xl font-bold text-dark">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg">Recent Orders</h3>
              <Link href="/user/orders" className="text-sm text-primary-700 hover:underline">View All →</Link>
            </div>

            {user.orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <span className="text-4xl">📦</span>
                <p className="text-muted">No orders yet</p>
                <Link href="/products" className="text-primary-700 text-sm font-medium hover:underline">Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {user.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-dark text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-dark text-sm">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-dark text-lg mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Full Name", value: user.name ?? "—" },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone ?? "—" },
                { label: "Address", value: user.address ? `${user.address}, ${user.city}` : "—" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-muted mb-1">{field.label}</p>
                  <p className="font-medium text-dark">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
