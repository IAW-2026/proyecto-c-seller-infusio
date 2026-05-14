"use client";

import { useState } from "react";

type Seller = {
  id: string;
  name: string;
  address: string;
  postalCode: string;
} | null;

export default function ProfileForm({ seller }: { seller: Seller }) {
  const [form, setForm] = useState({
    name: seller?.name ?? "",
    address: seller?.address ?? "",
    postalCode: seller?.postalCode ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/seller/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const json = await res.json();
      setError(json.error || "Error al guardar el perfil");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5"
    >
      {!seller && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          Completá tu perfil para que los cálculos de envío usen tu dirección real.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del negocio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Ej: Infusio Store"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección de despacho <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código postal <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
          placeholder="Ej: 1043"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Se usa para calcular el costo de envío de cada orden.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm">Perfil guardado correctamente.</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar perfil"}
        </button>
      </div>
    </form>
  );
}
