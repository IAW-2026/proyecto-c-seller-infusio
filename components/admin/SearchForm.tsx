interface Props {
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchForm({ defaultValue = "", placeholder = "Buscar..." }: Props) {
  return (
    <form method="GET" className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
