"use client";

import { useRouter } from "next/navigation";

export default function DeleteSellerButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar este vendedor? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/admin/sellers/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
    >
      Eliminar
    </button>
  );
}
