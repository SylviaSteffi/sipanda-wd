const TextField = ({ label, name, placeholder, type = "text" }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-body-xxs-medium text-black-100 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border text-body-xxs-regular border-black-40 px-4 py-3 outline-none focus:ring-1 focus:ring-primary-100"
      />
    </div>
  );
};

export default TextField;
