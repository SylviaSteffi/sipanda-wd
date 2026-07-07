import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { NAV_ITEMS } from "../../config/navItems";

const base =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-body-xxs-medium no-underline transition";
const activeClass = "bg-primary-20 text-primary-100";
const idleClass = "text-black-80 hover:bg-black-20 hover:text-black-100";

function isItemActive(pathname, itemPath) {
  if (pathname === itemPath) return true;

  const exactMatchOnlyPaths = [
    "/admin/dashboard",
    "/admin/dosen",
    "/dosen/dashboard",
    "/dosen/pengajuan",
    "/dosen/pengajuan/baru",
  ];

  if (exactMatchOnlyPaths.includes(itemPath)) {
    return false;
  }

  return pathname.startsWith(`${itemPath}/`);
}

const Sidebar = () => {
  const { role } = useAuth();
  const { pathname } = useLocation();

  const items = role === "ADMIN" ? NAV_ITEMS.ADMIN : NAV_ITEMS.DOSEN;

  return (
    <div className="p-4">
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = isItemActive(pathname, item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${base} ${isActive ? activeClass : idleClass}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;