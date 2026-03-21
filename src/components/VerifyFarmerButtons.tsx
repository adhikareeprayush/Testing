"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyFarmer } from "@/lib/actions/super-admin.actions";
import toast from "react-hot-toast";

export default function VerifyFarmerButtons({
  userId,
  verified,
}: {
  userId: string;
  verified: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(next: boolean) {
    startTransition(async () => {
      const r = await verifyFarmer(userId, next);
      if (r?.error) toast.error(r.error);
      else {
        toast.success(next ? "Farmer verified" : "Verification removed");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex gap-2">
      {!verified ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(true)}
          className="text-xs font-semibold bg-primary-700 text-white px-3 py-1.5 rounded-lg hover:bg-primary-800 disabled:opacity-50"
        >
          Verify
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(false)}
          className="text-xs font-semibold border border-red-300 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          Revoke
        </button>
      )}
    </div>
  );
}
