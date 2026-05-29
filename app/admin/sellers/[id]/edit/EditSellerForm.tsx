"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/admin/Input";
import Button from "@/components/admin/Button";
import FormCard from "@/components/admin/FormCard";
import ErrorAlert from "@/components/admin/ErrorAlert";

interface Seller {
  id: string;
  name: string;
  address: string;
  postalCode: string;
}

export default function EditSellerForm({ seller }: { seller: Seller }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: seller.name,
    address: seller.address,
    postalCode: seller.postalCode,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/sellers/${seller.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/sellers");
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
      setLoading(false);
    }
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      {error && <ErrorAlert message={error} />}

      <Input
        label="Nombre del negocio"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <Input
        label="Dirección"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
      />

      <Input
        label="Código postal"
        value={form.postalCode}
        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
        required
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Guardar cambios
        </Button>
        <Link
          href="/admin/sellers"
          className="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all duration-200"
        >
          Cancelar
        </Link>
      </div>
    </FormCard>
  );
}
