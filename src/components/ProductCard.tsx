"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
import { isCustomerRole } from "@/lib/roles";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: string | number;
  comparePrice?: number | null;
  image: string;
  badge?: string | null;
  stock?: number;
  slug?: string;
  rating?: number;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  comparePrice,
  image,
  badge,
  stock = 0,
  slug,
  rating,
}: ProductCardProps) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const priceNum = typeof price === "string" ? parseFloat(price.replace("$", "")) : price;
  const productSlug = slug ?? id;
  const isOutOfStock = stock === 0;
  const canPurchase =
    !session?.user || isCustomerRole(session.user.role);

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${productSlug}`} className="relative block bg-primary-100 h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-dark text-xs font-semibold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{category}</p>
        <Link href={`/products/${productSlug}`}>
          <h3 className="text-dark font-medium text-sm md:text-base hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
            {name}
          </h3>
        </Link>

        {rating !== undefined && (
          <StarRating count={Math.round(rating)} size={16} type="green" />
        )}

        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-primary-700 font-bold text-base md:text-lg">
            ${priceNum.toFixed(2)}
          </span>
          {comparePrice && comparePrice > priceNum && (
            <span className="text-muted line-through text-sm">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => !isOutOfStock && canPurchase && addItem(id)}
          disabled={isOutOfStock || !canPurchase}
          className={`mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isOutOfStock || !canPurchase
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-md active:scale-95"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : !canPurchase
              ? "Selling account"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
