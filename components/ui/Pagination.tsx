import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  variant?: "dashboard" | "admin";
}

export default function Pagination({ currentPage, totalPages, buildHref, variant = "dashboard" }: Props) {
  if (totalPages <= 1) return null;

  const activeClass =
    variant === "dashboard"
      ? "bg-forest text-cream shadow-sm"
      : "bg-indigo-600 text-white shadow-sm";

  const inactiveClass =
    variant === "dashboard"
      ? "bg-white border border-cream text-sage hover:bg-cream-light"
      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50";

  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            p === currentPage ? activeClass : inactiveClass
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
