function SectionCard({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-black-40 bg-white p-5 md:p-6 ${className}`}
    >
      <div className="space-y-5">
        {title ? (
          <h2 className="text-body-sm-medium text-black-100">{title}</h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default SectionCard;