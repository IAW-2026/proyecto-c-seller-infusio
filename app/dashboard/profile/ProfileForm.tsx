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

  const inputClass = "w-full border border-cream rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage transition-shadow";
  const labelClass = "block text-sm font-medium text-forest-dark mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-cream p-6 space-y-5"
    >
      {!seller && (
        <div className="bg-cream border border-sage/30 rounded-xl px-4 py-3 text-sm text-forest">
          Completá tu perfil para que los cálculos de envío usen tu dirección real.
        </div>
      )}

      <div>
        <label className={labelClass}>
          Nombre del negocio <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Ej: Infusio Store"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Dirección de despacho <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Código postal <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
          placeholder="Ej: 1043"
          className={inputClass}
        />
        <p className="text-xs text-sage mt-1.5">
          Se usa para calcular el costo de envío de cada orden.
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-forest text-sm font-medium">✓ Perfil guardado correctamente.</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-forest text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-dark transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar perfil"}
        </button>
      </div>
    </form>
  );
}
