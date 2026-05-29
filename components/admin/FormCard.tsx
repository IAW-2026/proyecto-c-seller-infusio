interface Props {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormCard({ children, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
      {children}
    </form>
  );
}
