"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isCustomerRole } from "@/lib/roles";

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  return cart;
}

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!isCustomerRole(session.user.role)) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return cart;
}

export async function addToCart(productId: string, quantity = 1) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please login to add items to cart" };
  if (!isCustomerRole(session.user.role)) {
    return { error: "Only customers can add items to the cart. Farmers sell through the farmer dashboard." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "Product not found" };
  if (product.stock < quantity) return { error: "Insufficient stock" };

  const cart = await getOrCreateCart(session.user.id);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItem(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!isCustomerRole(session.user.role)) return { error: "Unauthorized" };

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!isCustomerRole(session.user.role)) return { error: "Unauthorized" };

  await prisma.cartItem.delete({ where: { id: itemId } });

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (!isCustomerRole(session.user.role)) return { error: "Unauthorized" };

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  revalidatePath("/cart");
  return { success: true };
}
