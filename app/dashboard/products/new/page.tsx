"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/dashboard/Input";
import Button from "@/components/dashboard/Button";
import FormCard from "@/components/dashboard/FormCard";
import BackLink from "@/components/dashboard/BackLink";
import { PRODUCT_CATEGORIES } from "@/lib/schemas";

export default function NewProductPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { category: selectedCategory, ...restForm } = form;
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...restForm,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl,
        categories: selectedCategory ? [selectedCategory] : [],
      }),
    });

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      const json = await res.json();
      setError(json.error || "Error al crear el producto");
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-cream rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage transition-shadow";
  const labelClass = "block text-sm font-medium text-forest-dark mb-1.5";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <BackLink href="/dashboard/products" />
        <h2 className="text-2xl font-bold text-forest-dark">Nuevo producto</h2>
      </div>

      <FormCard onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Ej: Té verde orgánico"
        />

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción del producto..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <Input
            label="Stock"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="0"
          />
        </div>

        <div>
          <label className={labelClass}>Categoría</label>
          <select
            value={showCustomCategory ? "custom" : form.category}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setShowCustomCategory(true);
                setForm({ ...form, category: "" });
              } else {
                setShowCustomCategory(false);
                setForm({ ...form, category: e.target.value });
              }
            }}
            className={inputClass}
          >
            <option value="">Seleccioná una categoría</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="custom">+ Agregar nueva categoría</option>
          </select>
          {showCustomCategory && (
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Nombre de la nueva categoría"
              className={`${inputClass} mt-2`}
            />
          )}
        </div>

        <div>
          <label className={labelClass}>Imagen del producto</label>
          <CldUploadWidget
            uploadPreset="ml_default"
            onSuccess={(result) => {
              if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                setImageUrl(result.info.secure_url as string);
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full border-2 border-dashed border-sage rounded-xl px-4 py-6 text-sm text-forest-dark hover:border-forest transition-all duration-200"
              >
                {imageUrl ? "✓ Imagen cargada — click para cambiar" : "Click para subir imagen"}
              </button>
            )}
          </CldUploadWidget>
          {imageUrl && (
            <div className="mt-3 relative w-32 h-32">
              <Image src={imageUrl} alt="Preview del producto" fill className="object-cover rounded-xl border border-cream" />
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            Guardar producto
          </Button>
          <Link
            href="/dashboard/products"
            className="px-6 py-2.5 rounded-xl text-sm font-medium border border-cream text-forest-dark hover:bg-cream-light transition-all duration-200"
          >
            Cancelar
          </Link>
        </div>
      </FormCard>
    </div>
  );
}
