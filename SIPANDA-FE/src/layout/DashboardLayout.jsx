import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar.jsx";

function DashboardLayout() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="w-64 shrink-0 bg-white border-r border-black-40">
        <Sidebar />
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;