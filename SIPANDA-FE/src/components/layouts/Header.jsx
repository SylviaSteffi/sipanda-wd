import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
const Header = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const roleLabel = role === "ADMIN" ? "Admin LPPM" : "Dosen";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-black-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <img src="/images/UWDP.png" alt="logo" className="w-9 h-9" />
        <span className="font-semibold text-primary-100">SIPANDA</span>
      </div>

      {token && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/icons/profile.svg" alt="" className="w-7 h-7" />
            <span className="text-body-xxs-medium text-black-100">
              {roleLabel}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-black-20 transition"
            aria-label="Logout"
            title="Logout"
          >
            <img src="/icons/logout.svg" alt="" className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
