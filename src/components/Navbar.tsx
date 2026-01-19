import MobileSidebar from "./MobileSidebar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Left: Mobile Menu */}
      <div className="flex items-center gap-3">
        <MobileSidebar />
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-4">
        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-600 text-white text-sm">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {userName}
          </span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
