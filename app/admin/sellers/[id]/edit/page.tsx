import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditSellerForm from "./EditSellerForm";

export default async function EditSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = await prisma.seller.findUnique({ where: { id } });

  if (!seller) notFound();

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar vendedor</h2>
      <EditSellerForm seller={seller} />
    </div>
  );
}
