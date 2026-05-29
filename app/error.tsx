"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-light px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h1 className="text-2xl font-semibold text-forest-dark mb-2">
          Algo salió mal
        </h1>
        <p className="text-sage text-sm mb-8">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-forest text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Intentar de nuevo
          </button>
          <a
            href="/dashboard"
            className="bg-white border border-cream text-sage px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-cream-light transition-all duration-200"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
