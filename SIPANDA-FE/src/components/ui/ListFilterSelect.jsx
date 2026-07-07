function ListFilterSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Semua",
  showAllOption = true,
  disabled = false,
  helperText = "",
  className = "",
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label ? (
        <label className="block text-sm font-medium text-black-100">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border px-4 py-3 pr-11 text-sm outline-none transition ${
            disabled
              ? "cursor-not-allowed border-black-40 bg-black-20 text-black-60"
              : "border-black-40 bg-white text-black-100 focus:ring-1 focus:ring-primary-100"
          }`}
        >
          {showAllOption ? <option value="">{placeholder}</option> : null}

          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[18px] w-[18px]"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {helperText ? (
        <p className="text-xs text-black-80">{helperText}</p>
      ) : null}
    </div>
  );
}

export default ListFilterSelect;