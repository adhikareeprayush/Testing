"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  accountType: z.enum(["customer", "farmer"]).default("customer"),
});

export async function register(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    accountType: (formData.get("accountType") as string) || "customer",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "Email already in use" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  const asFarmer = parsed.data.accountType === "farmer";

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: asFarmer ? "FARMER" : "USER",
      farmerVerified: false,
    },
  });

  const redirectTo = asFarmer ? "/farmer/dashboard" : "/user/dashboard";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Account created but sign-in failed. Please log in." };
  }

  return { success: true };
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/user/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Invalid email or password" };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
