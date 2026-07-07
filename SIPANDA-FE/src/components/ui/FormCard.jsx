const FormCard = ({ title, subtitle, children, onSubmit }) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-black-40 bg-white p-8 shadow-md">
      <h1 className="text-body-lg-medium text-primary-100 text-center">{title}</h1>
      <p className="text-body-xs-regular text-black-80 text-center mt-2">
        {subtitle}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {children}
      </form>
    </div>
  );
};

export default FormCard;
