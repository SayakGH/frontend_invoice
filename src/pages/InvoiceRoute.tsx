import { useLocation } from "react-router-dom";
import InvoicePage from "./InvoicePage";
import type { INVOICE } from "@/types/invoiceType";

export default function InvoiceRoute() {
  const location = useLocation();

  const invoice = location.state?.invoice as INVOICE | undefined;

  // 🚨 If user refreshes or opens URL directly
  if (!invoice) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Invoice data not available. Please open from dashboard.
        </p>
      </div>
    );
  }

  // ✅ PASS PROP PROPERLY
  return <InvoicePage invoice={invoice} />;
}
