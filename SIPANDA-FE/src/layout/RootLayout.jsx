import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
function RootLayout() {
  return (
    <div className="min-h-screen bg-black-20 font-sans flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
