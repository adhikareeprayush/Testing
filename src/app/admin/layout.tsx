import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isFarmerRole, isSuperAdminRole } from "@/lib/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/upload");
  }

  const { role, id } = session.user;

  if (isSuperAdminRole(role)) {
    return <>{children}</>;
  }

  if (isFarmerRole(role)) {
    const u = await prisma.user.findUnique({
      where: { id },
      select: { farmerVerified: true },
    });
    if (!u?.farmerVerified) {
      redirect("/farmer/dashboard?upload=unverified");
    }
    return <>{children}</>;
  }

  redirect("/");
}
