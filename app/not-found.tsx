import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-light px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-forest mb-4">404</p>
        <h1 className="text-2xl font-semibold text-forest-dark mb-2">
          Página no encontrada
        </h1>
        <p className="text-sage text-sm mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-forest text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-dark transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
