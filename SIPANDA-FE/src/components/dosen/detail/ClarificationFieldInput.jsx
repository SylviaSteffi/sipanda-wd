function ClarificationFieldInput({ field, value, error = "", onChange }) {
  const baseInputClass =
    "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary-100";
  const inputClass = `${baseInputClass} ${
    error ? "border-error-100" : "border-black-40"
  }`;

  const wrapperClass =
    field.fullWidth || field.type === "textarea" ? "md:col-span-2" : "";

  const handleChange = (event) => {
    onChange(field.key, event.target.value);
  };

  if (field.type === "select") {
    return (
      <div className={wrapperClass}>
        <label className="mb-2 block text-sm font-medium text-black-100">
          {field.label}
        </label>

        <select value={value} onChange={handleChange} className={`${inputClass} appearance-none pr-4`}>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error ? <p className="mt-1 text-sm text-error-100">{error}</p> : null}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={wrapperClass}>
        <label className="mb-2 block text-sm font-medium text-black-100">
          {field.label}
        </label>

        <textarea
          value={value}
          onChange={handleChange}
          rows={4}
          className={inputClass}
        />

        {error ? <p className="mt-1 text-sm text-error-100">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <label className="mb-2 block text-sm font-medium text-black-100">
        {field.label}
      </label>

      <input
        type={field.type || "text"}
        value={value}
        onChange={handleChange}
        min={field.min}
        className={inputClass}
      />

      {error ? <p className="mt-1 text-sm text-error-100">{error}</p> : null}
    </div>
  );
}

export default ClarificationFieldInput;