"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sellers" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Nuevo vendedor</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className={labelClass}>
            Clerk User ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.clerkId}
            onChange={(e) => setForm({ ...form, clerkId: e.target.value })}
            placeholder="user_xxxxxxxxxxxxxxxxxx"
            required
            className={inputClass}
          />
          <p className="text-xs text-slate-400 mt-1.5">ID del usuario en Clerk que será el vendedor.</p>
        </div>

        <div>
          <label className={labelClass}>
            Nombre del negocio <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Infusio Store"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Dirección <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Código postal <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            placeholder="Ej: 1043"
            required
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear vendedor"}
          </button>
          <Link
            href="/admin/sellers"
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all duration-200"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
