"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#403c39",
              color: "#fff",
              borderRadius: "10px",
            },
            success: {
              iconTheme: { primary: "#39a116", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#f38160", secondary: "#fff" },
            },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
