"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
};

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? "",
    price: product.price.toString(),
    stock: product.stock.toString(),
    category: product.category ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/seller/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl,
      }),
    });

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      const json = await res.json();
      setError(json.error || "Error al actualizar el producto");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    setDeleting(true);

    const res = await fetch(`/api/seller/products/${product.id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      setError("Error al eliminar el producto");
      setDeleting(false);
    }
  }

  const inputClass = "w-full border border-cream rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage transition-shadow";
  const labelClass = "block text-sm font-medium text-forest-dark mb-1.5";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products" className="text-sage hover:text-forest text-sm transition-colors">
            ← Volver
          </Link>
          <h2 className="text-2xl font-bold text-forest-dark">Editar producto</h2>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {deleting ? "Eliminando..." : "Eliminar producto"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-cream p-6 space-y-5"
      >
        <div>
          <label className={labelClass}>
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Precio <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Stock <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Categoría</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          />
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
                className="w-full border-2 border-dashed border-cream rounded-xl px-4 py-6 text-sm text-sage hover:border-sage hover:text-forest transition-all duration-200"
              >
                {imageUrl ? "✓ Imagen cargada — click para cambiar" : "Click para subir imagen"}
              </button>
            )}
          </CldUploadWidget>
          {imageUrl && (
            <div className="mt-3 relative w-32 h-32">
              <Image
                src={imageUrl}
                alt="Preview del producto"
                fill
                className="object-cover rounded-xl border border-cream"
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-forest text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-dark transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link
            href="/dashboard/products"
            className="px-6 py-2.5 rounded-xl text-sm font-medium border border-cream text-sage hover:bg-cream-light transition-all duration-200"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
