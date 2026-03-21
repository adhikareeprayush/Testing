"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { farmerCanSell } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function makeSlug(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  image: z
    .string()
    .min(4)
    .refine(
      (s) => s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"),
      "Image must be a URL or path"
    ),
  badge: z.string().optional().nullable(),
  unit: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().optional(),
  isTrending: z.coerce.boolean().optional(),
});

export async function getFarmerDashboardData() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    return null;
  }

  const userId = session.user.id;
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { farmerVerified: true },
  });
  const verified = !!dbUser?.farmerVerified;

  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({
      where: { farmerId: userId },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    verified
      ? prisma.orderItem.findMany({
          where: {
            product: { farmerId: userId },
            order: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
          },
          select: {
            price: true,
            quantity: true,
            orderId: true,
            order: { select: { createdAt: true, status: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const grossSales = orderItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );
  const orderIds = new Set(orderItems.map((o) => o.orderId));

  return {
    verified,
    products,
    stats: {
      productCount: products.length,
      grossSales,
      orderCount: orderIds.size,
      lineItemsSold: orderItems.reduce((s, i) => s + i.quantity, 0),
    },
  };
}

export async function createFarmerProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    return { error: "Unauthorized" };
  }
  const db = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { farmerVerified: true },
  });
  if (!farmerCanSell(session.user.role, db?.farmerVerified)) {
    return { error: "You must be a verified farmer to add products." };
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    comparePrice: formData.get("comparePrice") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    image: formData.get("image"),
    badge: formData.get("badge") || undefined,
    unit: formData.get("unit") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    isTrending: formData.get("isTrending") === "on",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const slug = makeSlug(parsed.data.name);

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      comparePrice: parsed.data.comparePrice ?? null,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId,
      image: parsed.data.image,
      badge: parsed.data.badge ?? null,
      unit: parsed.data.unit ?? null,
      slug,
      farmerId: session.user.id,
      images: "[]",
      isFeatured: parsed.data.isFeatured ?? false,
      isTrending: parsed.data.isTrending ?? false,
    },
  });

  revalidatePath("/products");
  revalidatePath("/farmer/dashboard");
  return { success: true };
}

export async function updateFarmerProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    return { error: "Unauthorized" };
  }
  const db = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { farmerVerified: true },
  });
  if (!farmerCanSell(session.user.role, db?.farmerVerified)) {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.product.findFirst({
    where: { id: productId, farmerId: session.user.id },
  });
  if (!existing) return { error: "Product not found" };

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    comparePrice: formData.get("comparePrice") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    image: formData.get("image"),
    badge: formData.get("badge") || undefined,
    unit: formData.get("unit") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    isTrending: formData.get("isTrending") === "on",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      comparePrice: parsed.data.comparePrice ?? null,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId,
      image: parsed.data.image,
      badge: parsed.data.badge ?? null,
      unit: parsed.data.unit ?? null,
      isFeatured: parsed.data.isFeatured ?? false,
      isTrending: parsed.data.isTrending ?? false,
    },
  });

  revalidatePath("/products");
  revalidatePath("/farmer/dashboard");
  revalidatePath(`/products/${existing.slug}`);
  return { success: true };
}

export async function deleteFarmerProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    return { error: "Unauthorized" };
  }
  const db = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { farmerVerified: true },
  });
  if (!farmerCanSell(session.user.role, db?.farmerVerified)) {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.product.findFirst({
    where: { id: productId, farmerId: session.user.id },
  });
  if (!existing) return { error: "Not found" };

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  revalidatePath("/products");
  revalidatePath("/farmer/dashboard");
  return { success: true };
}
