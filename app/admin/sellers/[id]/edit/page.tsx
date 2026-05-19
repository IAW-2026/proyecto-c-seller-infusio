import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditSellerForm from "./EditSellerForm";

export default async function EditSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = await prisma.seller.findUnique({ where: { id } });

  if (!seller) notFound();

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sellers" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Editar vendedor</h2>
      </div>
      <EditSellerForm seller={seller} />
    </div>
  );
}
