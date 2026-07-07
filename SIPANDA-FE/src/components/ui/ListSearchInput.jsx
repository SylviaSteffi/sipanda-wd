function ListSearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <img
        src="/icons/search.svg"
        alt=""
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-60"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black-40 bg-white py-3 pl-12 pr-4 text-sm text-black-100 outline-none placeholder:text-black-60 focus:ring-1 focus:ring-primary-100"
      />
    </div>
  );
}

export default ListSearchInput;