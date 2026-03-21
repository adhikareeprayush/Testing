"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { login, register } from "@/lib/actions/auth.actions";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [accountKind, setAccountKind] = useState<"customer" | "farmer">("customer");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("callbackUrl");
  /** Sign-in: no role picker — default customer dashboard unless ?callbackUrl= is set */
  const callbackUrl = isRegister
    ? (fromQuery ?? (accountKind === "farmer" ? "/farmer/dashboard" : "/user/dashboard"))
    : (fromQuery ?? "/user/dashboard");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("callbackUrl", callbackUrl);
    if (isRegister) {
      formData.set("accountType", accountKind === "farmer" ? "farmer" : "customer");
    }

    startTransition(async () => {
      const action = isRegister ? register : login;
      const result = await action(formData).catch(() => null);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            src="/assets/logo.png"
            alt="Farm Commerce"
            width={64}
            height={64}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-primary-700">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted text-center">
            {isRegister
              ? accountKind === "farmer"
                ? "Register as a farmer — super admin must verify you before you can list products."
                : "Join Farm Commerce and get fresh produce delivered"
              : "Sign in to continue your fresh journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-dark">Sign up as</span>
              <div className="flex rounded-xl bg-gray-100 p-1" role="group" aria-label="Account type">
                <button
                  type="button"
                  onClick={() => setAccountKind("customer")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    accountKind === "customer"
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-muted"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setAccountKind("farmer")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    accountKind === "farmer"
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-muted"
                  }`}
                >
                  Farmer
                </button>
              </div>
            </div>
          )}
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-dark block mb-1.5">Full Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Prayush Adhikari"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark block mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary-700 hover:underline font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRegister ? "Creating account..." : "Signing in..."}
              </span>
            ) : (
              isRegister ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-5 p-3 bg-primary-50 rounded-xl border border-primary-100 space-y-1">
          <p className="text-xs text-primary-800 font-semibold mb-1">Demo credentials:</p>
          <p className="text-xs text-primary-700">👤 Customer: demo@farmcommerce.com / user1234</p>
          <p className="text-xs text-primary-700">🌾 Farmer (verified): farmer@farmcommerce.com / farmer123</p>
          <p className="text-xs text-primary-700">⏳ Farmer (pending): farmer-pending@farmcommerce.com / farmer123</p>
          <p className="text-xs text-primary-700">🛡️ Super admin: superadmin@farmcommerce.com / super123</p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary-700 font-semibold hover:underline"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-muted hover:text-primary-700 transition-colors">
            ← Continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
