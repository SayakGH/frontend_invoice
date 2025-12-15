// src/components/Navbar.tsx
import MobileSidebar from "./MobileSidebar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-white px-4">
      <MobileSidebar />

      <button onClick={handleLogout}>
        <LogOut />
      </button>
    </div>
  );
}
