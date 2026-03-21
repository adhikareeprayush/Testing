"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { isCustomerRole } from "@/lib/roles";

interface Props {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ productId, stock }: Props) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const isOutOfStock = stock === 0;
  const canPurchase =
    !session?.user || isCustomerRole(session.user.role);

  async function handleAdd() {
    setAdding(true);
    await addItem(productId, qty);
    setAdding(false);
  }

  if (!canPurchase) {
    return (
      <p className="text-sm text-muted bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
        Farmer and admin accounts cannot purchase. Sign in with a customer account to shop, or use your{" "}
        <Link href="/farmer/dashboard" className="text-primary-700 font-semibold underline">
          farmer dashboard
        </Link>{" "}
        to manage listings.
      </p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity */}
      <div className="flex items-center border-2 border-primary-600 rounded-xl overflow-hidden w-fit">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-2.5 hover:bg-primary-50 transition-colors text-xl font-semibold text-primary-700"
          disabled={qty <= 1}
        >
          −
        </button>
        <span className="w-12 text-center font-semibold text-dark py-2">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="px-4 py-2.5 hover:bg-primary-50 transition-colors text-xl font-semibold text-primary-700"
          disabled={qty >= stock}
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        disabled={isOutOfStock || adding}
        className={`flex-1 font-bold py-3 px-6 rounded-xl text-base transition-all duration-200 flex items-center justify-center gap-2 ${
          isOutOfStock
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg active:scale-95"
        }`}
      >
        {adding ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adding…
          </>
        ) : (
          <>
            <Image src="/assets/Resuable/cart.svg" alt="" width={20} height={20} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
