import { RouterProvider } from "react-router-dom";
import { Router } from "./router/router.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { PengajuanProvider } from "./context/PengajuanProvider.jsx";

function App() {
  return (
    <div className="font-sans">
      <AuthProvider>
        <PengajuanProvider>
          <RouterProvider router={Router}></RouterProvider>
        </PengajuanProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
