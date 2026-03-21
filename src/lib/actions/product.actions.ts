"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  trending?: boolean;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}) {
  const where: Record<string, unknown> = { isActive: true };

  if (options?.categorySlug) {
    where.category = { slug: options.categorySlug };
  }
  if (options?.featured) where.isFeatured = true;
  if (options?.trending) where.isTrending = true;
  if (options?.inStockOnly) where.stock = { gt: 0 };
  if (options?.onSaleOnly) {
    where.comparePrice = { not: null };
  }
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }
  if (options?.minPrice || options?.maxPrice) {
    where.price = {
      ...(options.minPrice ? { gte: options.minPrice } : {}),
      ...(options.maxPrice ? { lte: options.maxPrice } : {}),
    };
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getProductPriceBounds() {
  const agg = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });
  const min = Math.floor(agg._min.price ?? 0);
  const max = Math.ceil(agg._max.price ?? 50);
  return { min, max: Math.max(max, min + 1) };
}

export async function addReview(
  productId: string,
  userId: string,
  rating: number,
  comment: string
) {
  return prisma.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, comment },
    create: { userId, productId, rating, comment },
  });
}
