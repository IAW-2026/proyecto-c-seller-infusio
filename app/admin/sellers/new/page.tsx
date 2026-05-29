"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/admin/Input";
import Button from "@/components/admin/Button";
import FormCard from "@/components/admin/FormCard";
import ErrorAlert from "@/components/admin/ErrorAlert";

export default function NewSellerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ clerkId: "", name: "", address: "", postalCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/sellers");
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al crear vendedor");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sellers" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Nuevo vendedor</h2>
      </div>

      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorAlert message={error} />}

        <Input
          label="Clerk User ID"
          value={form.clerkId}
          onChange={(e) => setForm({ ...form, clerkId: e.target.value })}
          placeholder="user_xxxxxxxxxxxxxxxxxx"
          required
          hint="ID del usuario en Clerk que será el vendedor."
        />

        <Input
          label="Nombre del negocio"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ej: Infusio Store"
          required
        />

        <Input
          label="Dirección"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
          required
        />

        <Input
          label="Código postal"
          value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          placeholder="Ej: 1043"
          required
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            Crear vendedor
          </Button>
          <Link
            href="/admin/sellers"
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all duration-200"
          >
            Cancelar
          </Link>
        </div>
      </FormCard>
    </div>
  );
}
