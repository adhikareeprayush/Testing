"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/actions/order.actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shipping = total >= 50 ? 0 : 5;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createOrder({
        firstName: fd.get("firstName") as string,
        lastName: fd.get("lastName") as string,
        email: fd.get("email") as string,
        phone: fd.get("phone") as string,
        address: fd.get("address") as string,
        city: fd.get("city") as string,
        state: fd.get("state") as string,
        zip: fd.get("zip") as string,
        paymentMethod,
        notes: fd.get("notes") as string,
      });

      if (result?.error) toast.error(result.error);
    });
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-dark">Please sign in to checkout</h2>
        <Link href="/login?callbackUrl=/checkout" className="bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-dark">Your cart is empty</h2>
        <Link href="/products" className="bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-8 max-w-[1700px] mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-dark">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-dark">Cart</Link>
        <span>/</span>
        <span className="text-dark font-medium">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-dark mb-4">Billing Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">First Name *</label>
                  <input
                    name="firstName"
                    required
                    defaultValue={session.user.name?.split(" ")[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">Last Name *</label>
                  <input
                    name="lastName"
                    required
                    defaultValue={session.user.name?.split(" ").slice(1).join(" ")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={session.user.email ?? ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">Phone *</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+977-9800000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">Street Address *</label>
                  <input
                    name="address"
                    required
                    placeholder="123 Farm Street"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-dark block mb-1.5">City *</label>
                    <input
                      name="city"
                      required
                      placeholder="Kathmandu"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-dark block mb-1.5">State</label>
                    <input
                      name="state"
                      placeholder="Bagmati"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-dark block mb-1.5">ZIP *</label>
                    <input
                      name="zip"
                      required
                      placeholder="44600"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark block mb-1.5">Order Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Special delivery instructions..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-dark mb-4">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {[
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                  { id: "esewa", label: "eSewa", icon: "🟢" },
                  { id: "khalti", label: "Khalti", icon: "🟣" },
                  { id: "bank", label: "Bank Transfer", icon: "🏦" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-primary-600"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-dark text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-dark mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-primary-50 rounded-lg flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{item.product.name}</p>
                      <p className="text-xs text-muted">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-dark flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary-700" : ""}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-dark text-base">
                  <span>Total</span><span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-6 py-3.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  `Place Order • $${orderTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
