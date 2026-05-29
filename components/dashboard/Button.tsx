interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
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
    primary: "bg-forest text-cream px-6 py-2.5 rounded-xl hover:bg-forest-dark shadow-sm hover:shadow-md",
    secondary: "px-6 py-2.5 rounded-xl border border-cream text-sage hover:bg-cream-light",
    danger: "text-red-400 hover:text-red-600",
  };

  return (
    <button disabled={loading || disabled} className={`${base} ${variants[variant]}`} {...props}>
      {loading ? loadingText : children}
    </button>
  );
}
