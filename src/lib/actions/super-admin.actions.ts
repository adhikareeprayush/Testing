"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdminRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id || !isSuperAdminRole(session.user.role)) {
    return null;
  }
  return session;
}

export async function getSuperAdminAnalytics() {
  const session = await requireSuperAdmin();
  if (!session) return null;

  const [
    customerCount,
    farmerCount,
    verifiedFarmerCount,
    pendingFarmers,
    orderAgg,
    productCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "FARMER" } }),
    prisma.user.count({ where: { role: "FARMER", farmerVerified: true } }),
    prisma.user.count({ where: { role: "FARMER", farmerVerified: false } }),
    prisma.order.aggregate({
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  return {
    customerCount,
    farmerCount,
    verifiedFarmerCount,
    pendingFarmers,
    orderCount: orderAgg._count._all,
    revenueTotal: orderAgg._sum.total ?? 0,
    productCount,
  };
}

export async function listFarmersForAdmin() {
  const session = await requireSuperAdmin();
  if (!session) return null;

  return prisma.user.findMany({
    where: { role: "FARMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      farmerVerified: true,
      farmerVerifiedAt: true,
      createdAt: true,
      city: true,
      phone: true,
      _count: { select: { farmerProducts: true } },
    },
  });
}

export async function listCustomersForAdmin() {
  const session = await requireSuperAdmin();
  if (!session) return null;

  return prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      city: true,
      phone: true,
      _count: { select: { orders: true } },
    },
  });
}

export async function verifyFarmer(userId: string, verified: boolean) {
  const session = await requireSuperAdmin();
  if (!session) return { error: "Unauthorized" };

  const user = await prisma.user.findFirst({
    where: { id: userId, role: "FARMER" },
  });
  if (!user) return { error: "Farmer not found" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      farmerVerified: verified,
      farmerVerifiedAt: verified ? new Date() : null,
    },
  });

  revalidatePath("/super-admin");
  revalidatePath("/super-admin/farmers");
  revalidatePath("/farmer/dashboard");
  return { success: true };
}
