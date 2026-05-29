"use client";

import { useState } from "react";
import Input from "@/components/dashboard/Input";
import Button from "@/components/dashboard/Button";
import FormCard from "@/components/dashboard/FormCard";

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
    <FormCard onSubmit={handleSubmit}>
      {!seller && (
        <div className="bg-cream border border-sage/30 rounded-xl px-4 py-3 text-sm text-forest">
          Completá tu perfil para que los cálculos de envío usen tu dirección real.
        </div>
      )}

      <Input
        label="Nombre del negocio"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Ej: Infusio Store"
      />

      <Input
        label="Dirección de despacho"
        name="address"
        value={form.address}
        onChange={handleChange}
        required
        placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
      />

      <Input
        label="Código postal"
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        required
        placeholder="Ej: 1043"
        hint="Se usa para calcular el costo de envío de cada orden."
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-forest text-sm font-medium">✓ Perfil guardado correctamente.</p>
      )}

      <div className="pt-2">
        <Button type="submit" loading={loading}>
          Guardar perfil
        </Button>
      </div>
    </FormCard>
  );
}
