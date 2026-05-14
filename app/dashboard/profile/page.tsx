import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const { userId } = await auth();

  const seller = userId
    ? await prisma.seller.findUnique({ where: { clerkId: userId } })
    : null;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil del vendedor</h2>
      <ProfileForm seller={seller} />
    </div>
  );
}
