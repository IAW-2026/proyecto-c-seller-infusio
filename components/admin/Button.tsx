interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
}

export default function Button({
  loading,
  loadingText = "Guardando...",
  variant = "primary",
  children,
  disabled,
  ...props
}: Props) {
  const base = "text-sm font-medium transition-all duration-200 disabled:opacity-50";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md",
    secondary: "px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50",
  };

  return (
    <button disabled={loading || disabled} className={`${base} ${variants[variant]}`} {...props}>
      {loading ? loadingText : children}
    </button>
  );
}
