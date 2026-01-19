// src/components/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";
import {
  BarChart,
  FilePlus,
  FileText,
  Users,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { setPage } = useGlobal();
  const role = localStorage.getItem("role");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } hidden md:flex flex-col h-full bg-gray-900 text-white p-4 transition-all duration-300`}
    >
      {/* Your requested header */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 gap-3"
            onClick={() => setPage("analytics")}
          >
            <BarChart size={20} />
            {!collapsed && "Analytics"}
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 gap-3"
          onClick={() => setPage("addinvoices")}
        >
          <FilePlus size={20} />
          {!collapsed && "Add Invoices"}
        </Button>

        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 gap-3"
            onClick={() => setPage("invoices")}
          >
            <FileText size={20} />
            {!collapsed && "Manage Invoices"}
          </Button>
        )}

        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 gap-3"
            onClick={() => setPage("manage")}
          >
            <Users size={20} />
            {!collapsed && "Manage Users"}
          </Button>
        )}

        {role === "admin" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 gap-3"
            onClick={() => setPage("payments")}
          >
            <CreditCard size={20} />
            {!collapsed && "Payments"}
          </Button>
        )}

        {role === "user" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 gap-3"
            onClick={() => setPage("userinvoice")}
          >
            <Receipt size={20} />
            {!collapsed && "User Invoice"}
          </Button>
        )}
      </div>
    </div>
  );
}
