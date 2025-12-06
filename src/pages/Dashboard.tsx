// src/pages/Dashboard.tsx
import { useGlobal } from "@/context/GlobalContext";
import Analytics from "./Analytics";
import Invoices from "./Invoice";
import Manage from "./Manage";

export default function Dashboard() {
  const { page } = useGlobal();
  return (
    <div className="p-2">
      {page === "analytics" && <Analytics />}
      {page === "invoices" && <Invoices />}
      {page === "manage" && <Manage />}
    </div>
  );
}
