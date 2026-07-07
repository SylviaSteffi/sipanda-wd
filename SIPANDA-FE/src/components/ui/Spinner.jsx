// components/Spinner.jsx
export default function Spinner({ size = "md", label = "Memuat data..." }) {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-[3px]",
    lg: "w-16 h-16 border-4",
  }[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClass} rounded-full border-gray-200 border-t-gray-800 animate-spin`}
      />
      {label && (
        <span className="text-sm text-gray-400 animate-pulse">{label}</span>
      )}
    </div>
  );
}
