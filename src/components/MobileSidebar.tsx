// src/components/MobileSidebar.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  BarChart,
  FilePlus,
  FileText,
  Users,
  CreditCard,
  Receipt,
} from "lucide-react";
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
              className="w-full justify-start gap-3"
              onClick={() => handleSelect("analytics")}
            >
              <BarChart size={20} />
              Analytics
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => handleSelect("addinvoices")}
          >
            <FilePlus size={20} />
            Add Invoices
          </Button>

          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleSelect("invoices")}
            >
              <FileText size={20} />
              Manage Invoices
            </Button>
          )}

          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleSelect("manage")}
            >
              <Users size={20} />
              Manage Users
            </Button>
          )}

          {role === "admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleSelect("payments")}
            >
              <CreditCard size={20} />
              Payments
            </Button>
          )}

          {role === "user" && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => handleSelect("userinvoice")}
            >
              <Receipt size={20} />
              User Invoice
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
