import { STATUS_LABELS, STATUS_STYLES } from "../../config/statusConfig";

const StatusBadge = ({ status }) => {
  const capitalizeStatus = status.toUpperCase();

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium ${
        STATUS_STYLES[capitalizeStatus] || "bg-black-20 text-black-80"
      }`}
    >
      {STATUS_LABELS[capitalizeStatus] || capitalizeStatus}
    </span>
  );
};

export default StatusBadge;
