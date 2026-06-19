"use client";

import { useState } from "react";
import Image from "next/image";
import { updateOrderStatus } from "./actions";

type Item = {
  id: string;
  quantity: number;
  productVariant: string | null;
  product: { name: string; imageUrl: string | null };
};

export default function PreparationChecklistModal({
  orderId,
  items,
}: {
  orderId: string;
  items: Item[];
}) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const allChecked = items.length > 0 && items.every((item) => checked[item.id]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const confirm = async () => {
    setLoading(true);
    await updateOrderStatus(orderId, "PREPARING");
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-forest-dark font-medium transition-colors hover:underline"
      >
        Comenzar preparación
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              Checklist de preparación
            </h3>
            <p className="text-sm text-forest-dark/60 mb-4">
              Tildá cada producto a medida que lo preparás. Podés confirmar cuando estén todos listos.
            </p>

            <ul className="space-y-2 mb-6">
              {items.map((item) => (
                <li key={item.id}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="w-4 h-4 accent-forest-dark flex-shrink-0"
                    />
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-cream-light flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-lg">🌿</span>
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        checked[item.id]
                          ? "line-through text-forest-dark/40"
                          : "text-forest-dark"
                      }`}
                    >
                      {item.product.name}
                      {item.productVariant && (
                        <span className="text-xs text-forest-dark/50 ml-1">
                          ({item.productVariant})
                        </span>
                      )}
                      <span className="text-xs text-forest-dark/50 ml-2">
                        ×{item.quantity}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-forest-dark border border-cream rounded-lg hover:bg-cream-light transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirm}
                disabled={!allChecked || loading}
                className="px-4 py-2 text-sm font-medium bg-forest-dark text-cream rounded-lg hover:bg-forest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Confirmar preparación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
