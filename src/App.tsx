import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import InvoiceRoute from "./pages/InvoiceRoute"; // 👈 NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= INVOICE PAGE (NO SIDEBAR) ================= */}

        <Route
          path="/invoice/:invoiceId"
          element={
            <ProtectedRoute>
              <InvoiceRoute />
            </ProtectedRoute>
          }
        />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex h-[100svh] overflow-hidden bg-gray-100">
                {/* Sidebar */}
                <Sidebar />

                {/* Right section */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Navbar */}
                  <Navbar />

                  {/* Scrollable content */}
                  <main className="flex-1 overflow-y-auto">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
