function InfoItem({ label, value }) {
  const isEmpty =
    value === null || value === undefined || value === "";

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-black-80">{label}</div>
      <div className="break-words whitespace-pre-line text-sm text-black-100">
        {isEmpty ? "-" : value}
      </div>
    </div>
  );
}

export default InfoItem;