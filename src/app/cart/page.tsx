"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { items, itemCount, total, loading, updateItem, removeItem } = useCart();
  const { data: session } = useSession();

  const shipping = total >= 50 ? 0 : 5;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">🛒</div>
        <h2 className="text-2xl font-bold text-dark">Your cart is waiting</h2>
        <p className="text-muted text-center max-w-xs">
          Sign in to access your cart and continue shopping
        </p>
        <Link
          href="/login?callbackUrl=/cart"
          className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">🛒</div>
        <h2 className="text-2xl font-bold text-dark">Your cart is empty</h2>
        <p className="text-muted text-center max-w-xs">
          Looks like you haven't added anything yet. Start with some fresh picks!
        </p>
        <Link
          href="/products"
          className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
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
        <span className="text-dark font-medium">Cart ({itemCount} items)</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/products/${item.product.id}`}
                className="relative w-24 h-24 bg-primary-50 rounded-xl overflow-hidden flex-shrink-0"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-contain p-2"
                />
              </Link>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs text-muted uppercase">{item.product.category.name}</p>
                <Link href={`/products/${item.product.id}`} className="font-medium text-dark hover:text-primary-700 transition-colors text-sm sm:text-base">
                  {item.product.name}
                </Link>
                <p className="text-primary-700 font-bold">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors font-bold text-dark"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors font-bold text-dark disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-dark ml-auto sm:hidden">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="font-bold text-dark">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-dark mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-dark">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-primary-700 font-medium" : "text-dark"}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted bg-primary-50 px-3 py-2 rounded-lg">
                  Add ${(50 - total).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-muted">
                <span>Tax (8%)</span>
                <span className="text-dark">${tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-dark text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full text-center mt-6 py-3.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors"
            >
              Proceed to Checkout →
            </Link>
            <Link
              href="/products"
              className="block w-full text-center mt-3 py-3 border border-gray-200 hover:border-gray-300 text-dark text-sm font-medium rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
