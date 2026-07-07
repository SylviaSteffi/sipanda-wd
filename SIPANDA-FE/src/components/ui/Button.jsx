const Button = ({ children, className = "", type = "button", ...props }) => {
  return (
    <button
      type={type}
      {...props}
      className={`px-4 py-3 rounded-lg bg-primary-100 text-white text-body-xxs-medium ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
