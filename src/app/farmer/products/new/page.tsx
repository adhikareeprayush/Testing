import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/actions/product.actions";
import FarmerProductForm from "@/components/FarmerProductForm";
import { farmerCanSell } from "@/lib/roles";

export default async function NewFarmerProductPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    redirect("/login");
  }
  const db = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { farmerVerified: true },
  });
  if (!farmerCanSell(session.user.role, db?.farmerVerified)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-semibold">Verification required</p>
        <p className="text-sm mt-2">
          You cannot add products until a super admin verifies your farm account.
        </p>
      </div>
    );
  }

  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-dark">Add product</h1>
      <FarmerProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
