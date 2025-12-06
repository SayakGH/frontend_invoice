// src/components/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/GlobalContext";

export default function Sidebar() {
  const { setPage } = useGlobal();

  return (
    <div className="hidden md:block w-64 h-full bg-gray-900 text-white p-4 space-y-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300"
        onClick={() => setPage("analytics")}
      >
        Analytics
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300"
        onClick={() => setPage("invoices")}
      >
        Invoices
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300"
        onClick={() => setPage("manage")}
      >
        Manage
      </Button>
    </div>
  );
}
