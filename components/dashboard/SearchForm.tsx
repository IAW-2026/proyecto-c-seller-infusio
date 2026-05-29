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
          className="flex-1 border border-cream rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage transition-shadow"
        />
        <button
          type="submit"
          className="bg-forest text-cream px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-forest-dark transition-all duration-200"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
