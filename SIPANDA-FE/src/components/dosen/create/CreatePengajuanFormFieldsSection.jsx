function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-body-xxs-regular text-error-100">{message}</p>;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  options = [],
  disabled = false,
  error = "",
  helperText = "",
  rows = 4,
  showPlaceholderOption = true,
}) {
  const stateClass = disabled
    ? "cursor-not-allowed border-black-40 bg-black-20 text-black-80"
    : "border-black-40 bg-white text-black-100 focus:ring-1 focus:ring-primary-100";

  const inputClass = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${stateClass}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-black-100"
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${inputClass} appearance-none pr-12`}
        >
          {showPlaceholderOption ? <option value="">Pilih opsi</option> : null}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
        />
      ) : null}

      {type !== "select" && type !== "textarea" ? (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClass} pr-4`}
        />
      ) : null}

      {helperText ? <p className="text-xs text-black-80">{helperText}</p> : null}
      <FieldError message={error} />
    </div>
  );
}

function CreatePengajuanFormFieldsSection({
  fieldConfig,
  formValues,
  errors,
  onFieldChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fieldConfig.map((field) => (
        <div key={field.name} className={field.className || ""}>
          <InputField
            label={field.label}
            name={field.name}
            type={field.type}
            value={formValues[field.name] || ""}
            onChange={onFieldChange}
            placeholder={field.placeholder}
            options={field.options}
            error={errors[field.name]}
            helperText={field.helperText}
            rows={field.rows}
            showPlaceholderOption={field.name !== "jenis_pkm"}
          />
        </div>
      ))}
    </div>
  );
}

export default CreatePengajuanFormFieldsSection;