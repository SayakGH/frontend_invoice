// src/components/MobileSidebar.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useGlobal } from "@/context/GlobalContext";

export default function MobileSidebar() {
  const { setPage } = useGlobal();
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleSelect = (page: string) => {
    setPage(page);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Mobile menu button */}
      <SheetTrigger>
        <Menu className="h-6 w-6 md:hidden" />
      </SheetTrigger>

      {/* Sidebar drawer */}
      <SheetContent side="left" className="p-4">
        <h1 className="text-xl font-semibold mb-6">Menu</h1>

        <div className="space-y-3">
          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect("analytics")}
            >
              Analytics
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleSelect("addinvoices")}
          >
            Add Invoices
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleSelect("invoices")}
          >
            Manage Invoices
          </Button>
          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect("manage")}
            >
              Manage Users
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
