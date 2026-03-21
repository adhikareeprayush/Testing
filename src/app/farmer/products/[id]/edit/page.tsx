import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getCategories } from "@/lib/actions/product.actions";
import FarmerProductForm from "@/components/FarmerProductForm";
import { farmerCanSell } from "@/lib/roles";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFarmerProductPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FARMER") {
    redirect("/login");
  }
  const db = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { farmerVerified: true },
  });
  if (!farmerCanSell(session.user.role, db?.farmerVerified)) {
    redirect("/farmer/dashboard");
  }

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({
      where: { id, farmerId: session.user.id },
    }),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-dark">Edit product</h1>
      <FarmerProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          stock: product.stock,
          categoryId: product.categoryId,
          image: product.image,
          badge: product.badge,
          unit: product.unit,
          isFeatured: product.isFeatured,
          isTrending: product.isTrending,
        }}
      />
    </div>
  );
}
