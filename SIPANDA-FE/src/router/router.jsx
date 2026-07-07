import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layout/RootLayout.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";

import LoginPage from "../pages/LoginPage.jsx";
import RoleRedirect from "../pages/RoleRedirect.jsx";
import RequireRole from "../pages/RequireRole.jsx";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import PengajuanListPage from "../pages/admin/PengajuanListPage.jsx";
import PengajuanDetailPage from "../pages/admin/PengajuanDetailPage.jsx";
import SuratListPage from "../pages/admin/SuratListPage.jsx";
import SuratDetailPage from "../pages/admin/SuratDetailPage.jsx";
import DosenListPage from "../pages/admin/DosenListPage.jsx";

import DosenDashboardPage from "../pages/dosen/DosenDashboardPage.jsx";
import DosenPengajuanListPage from "../pages/dosen/DosenPengajuanListPage.jsx";
import DosenPengajuanDetailPage from "../pages/dosen/DosenPengajuanDetailPage.jsx";
import DosenPengajuanCreatePage from "../pages/dosen/DosenPengajuanCreatePage.jsx";
import FakultasListPage from "../pages/admin/FakultasListPage.jsx";
import ProdiListPage from "../pages/admin/ProdiListPage.jsx";
import AkademikListPage from "../pages/admin/AkademikListPage.jsx";

function PlaceholderPage({ title }) {
  return <div className="p-6 text-black-100">{title}</div>;
}

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <RoleRedirect />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "admin",
        element: (
          <RequireRole allowedRole="ADMIN">
            <DashboardLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "pengajuan", element: <PengajuanListPage /> },
          { path: "pengajuan/:id", element: <PengajuanDetailPage /> },
          { path: "surat", element: <SuratListPage /> },
          { path: "surat/:id", element: <SuratDetailPage /> },
          { path: "dosen", element: <DosenListPage /> },
          { path: "fakultas", element: <FakultasListPage /> },
          { path: "prodi", element: <ProdiListPage /> },
          { path: "akademik", element: <AkademikListPage /> },
        ],
      },
      {
        path: "dosen",
        element: (
          <RequireRole allowedRole="DOSEN">
            <DashboardLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <DosenDashboardPage /> },
          { path: "pengajuan", element: <DosenPengajuanListPage /> },
          {
            path: "pengajuan/baru",
            element: <DosenPengajuanCreatePage />,
          },
          {
            path: "pengajuan/:id",
            element: <DosenPengajuanDetailPage />,
          },
        ],
      },
    ],
  },
]);
