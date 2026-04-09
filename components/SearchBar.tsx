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
    <form className="toolbar" style={{ alignItems: "stretch" }}>
      <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
          style={{ 
            position: "absolute", 
            left: "12px", 
            top: "50%", 
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "var(--muted)"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          className="input"
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={search}
          style={{ paddingLeft: "40px" }}
        />
      </div>
      {sortOptions?.length ? (
        <select className="input" name="sort" defaultValue={sort || sortOptions[0].value} style={{ maxWidth: "180px" }}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      <button className="button" type="submit">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
          style={{ width: "16px", height: "16px" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
        </svg>
        Filtrar
      </button>
    </form>
  );
}
