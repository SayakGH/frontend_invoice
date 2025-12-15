// src/pages/Dashboard.tsx
import { useGlobal } from "@/context/GlobalContext";
import Analytics from "./Analytics";
import Invoices from "./Invoice";
import Manage from "./Manage";
import AddInvoice from "./AddInvoice";

export default function Dashboard() {
  const { page } = useGlobal();
  const role = localStorage.getItem("role");
  return (
    <div className="p-4">
      {page === "analytics" && role === "admin" && <Analytics />}
      {page === "invoices" && role === "admin" && <Invoices />}
      {page === "manage" && role === "admin" && <Manage />}
      {page === "addinvoices" && <AddInvoice />}
    </div>
  );
}
