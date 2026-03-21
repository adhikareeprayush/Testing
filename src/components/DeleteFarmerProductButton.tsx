"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteFarmerProduct } from "@/lib/actions/farmer-product.actions";
import toast from "react-hot-toast";

export default function DeleteFarmerProductButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Deactivate this product? It will be hidden from the store.")) return;
        startTransition(async () => {
          const r = await deleteFarmerProduct(id);
          if (r?.error) toast.error(r.error);
          else {
            toast.success("Product deactivated");
            router.refresh();
          }
        });
      }}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "…" : "Deactivate"}
    </button>
  );
}
