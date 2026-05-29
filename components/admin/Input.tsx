interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export default function Input({ label, hint, required, className, ...props }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        required={required}
        className={`w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${className ?? ""}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}
