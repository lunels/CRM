export function SearchBar({
  placeholder = "Buscar...",
  search,
  sort,
  sortOptions
}: {
  placeholder?: string;
  search?: string;
  sort?: string;
  sortOptions?: Array<{ value: string; label: string }>;
}) {
  return (
    <form className="toolbar">
      <input
        className="input"
        type="search"
        name="q"
        placeholder={placeholder}
        defaultValue={search}
      />
      {sortOptions?.length ? (
        <select className="input" name="sort" defaultValue={sort || sortOptions[0].value}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      <button className="button button-secondary" type="submit">
        Filtrar
      </button>
    </form>
  );
}
