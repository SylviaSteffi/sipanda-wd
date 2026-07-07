import { useState } from "react";
const PasswordField = ({ label, name, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-body-xxs-medium text-black-100 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-lg border border-black-40 px-4 py-3 pr-12 text-body-xxs-regular outline-none focus:ring-1 focus:ring-primary-100"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label={show ? "Tampilkan password" : "Sembunyikan password"}
        >
          <img
            src={`/icons/${
              show ? "eye.svg" : "eye-off.svg"
            }`}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
