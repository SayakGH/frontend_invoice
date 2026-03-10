import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Pencil,
  Search,
  Trash2,
  History,
  MoreVertical,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import type { INVOICE, IGetAllInvoiceResponse } from "@/types/invoiceType";
import {
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  getHistory,
  updateInvoicePhone,
  updateInvoicePAN,
} from "@/api/invoice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ================= UTILS ================= */
const getDate = (iso: string) => iso.split("T")[0];
const getTime = (iso: string) => iso.split("T")[1].slice(0, 5);

type Company =
  | "All"
  | "Airde Real Estate"
  | "Airde Developer"
  | "Sora Realtor"
  | "Unique Realcon";

const formatAmount = (value: number | string) => {
  const num = Number(value || 0);
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/* ================= COMPONENT ================= */
export default function Invoices() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<INVOICE[]>([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyInvoices, setHistoryInvoices] = useState<INVOICE[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ===== Edit Payment ===== */
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<INVOICE | null>(null);
  const [payment, setPayment] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<
    "Bank Transfer" | "Cheque" | "UPI" | "Cash" | "Demand Draft" | "Others"
  >("Bank Transfer");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);

  const [chequeError, setChequeError] = useState("");
  const [bankError, setBankError] = useState("");

  const [editTab, setEditTab] = useState<"payment" | "kyc">("payment");

  const [newPhone, setNewPhone] = useState("");
  const [newPAN, setNewPAN] = useState("");
  const [kycLoading, setKycLoading] = useState(false);
  const [companyFilter, setCompanyFilter] = useState<Company>("All");

  /* ===== Delete ===== */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchInvoices = async () => {
    const data: IGetAllInvoiceResponse = await getAllInvoices();
    setInvoices(data.invoices);
  };
  const fetchHistory = async (id: string) => {
    const data: IGetAllInvoiceResponse = await getHistory(id);
    setHistoryInvoices(data.invoices);
  };
  useEffect(() => {
    fetchInvoices();
  }, []);
  const clearSearch = () => {
    setSearch("");
  };

  /* ================= FILTER ================= */
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv._id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.phone.includes(search) ||
      inv.company.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.executiveName.toLowerCase().includes(search.toLowerCase());

    const matchesCompany =
      companyFilter === "All" || inv.company.name === companyFilter;

    return matchesSearch && matchesCompany;
  });

  /* ================= HANDLERS ================= */

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Invoice ID copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleEditClick = (invoice: INVOICE) => {
    setSelectedInvoice(invoice);
    setPayment(null);
    setPaymentMode("Bank Transfer");
    setChequeNumber("");
    setBankName("");

    // preload KYC
    setNewPhone(invoice.customer.phone);
    setNewPAN(invoice.customer.PAN);

    setEditTab("payment");
    setOpen(true);
  };

  const handleHistoryClick = async (invoice: INVOICE) => {
    try {
      setHistoryLoading(true);
      setHistoryOpen(true);

      await fetchHistory(invoice._id);
    } catch (err) {
      toast.error("Failed to load invoice history");
    } finally {
      setHistoryLoading(false);
    }
  };
  const handleKycUpdate = async () => {
    if (!selectedInvoice) return;

    try {
      setKycLoading(true);

      if (newPhone !== selectedInvoice.customer.phone) {
        await updateInvoicePhone(selectedInvoice._id, newPhone);
      }

      if (newPAN !== selectedInvoice.customer.PAN) {
        await updateInvoicePAN(selectedInvoice._id, newPAN);
      }

      toast.success("KYC updated successfully");
      setOpen(false);
      fetchInvoices();
    } catch (err: any) {
      toast.error(err?.message || "KYC update failed");
    } finally {
      setKycLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedInvoice || payment === null) {
      toast.error("Please enter payment amount");
      return;
    }

    if (payment <= 0 || payment > selectedInvoice.remainingAmount) {
      toast.error("Invalid payment amount");
      return;
    }

    // CHEQUE VALIDATION
    if (paymentMode === "Cheque") {
      if (chequeNumber.length !== 6) {
        toast.error("Cheque number must be 6 digits");
        return;
      }

      if (!bankName.trim()) {
        toast.error("Bank name is required");
        return;
      }
    }

    try {
      setLoading(true);

      await updateInvoice(selectedInvoice._id, {
        amount: payment,
        customerName: selectedInvoice.customer.name,
        paymentMode,
        chequeNumber: paymentMode === "Cheque" ? chequeNumber : undefined,
        bankName: paymentMode === "Cheque" ? bankName : undefined,
      });

      toast.success("Payment added successfully");
      setOpen(false);
      fetchInvoices();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Payment update failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete);
      toast.success("Invoice deleted successfully");

      setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceToDelete));
      await fetchInvoices();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const ActionMenu = ({ inv }: { inv: INVOICE }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => handleEditClick(inv)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit / KYC
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            navigate(`/invoice/${inv._id}`, { state: { invoice: inv } })
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleHistoryClick(inv)}>
          <History className="mr-2 h-4 w-4" />
          History
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={() => {
            setInvoiceToDelete(inv._id);
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* SEARCH */}
      <div className="flex items-center gap-3 w-full">
        {/* Search Input */}
        <Input
          placeholder="Search invoice / customer / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        {/* Company Dropdown */}
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value as Company)}
          className="border rounded-md h-10 px-3 bg-white min-w-[180px]"
        >
          <option value="All">All Companies</option>
          <option value="Airde Real Estate">Airde Real Estate</option>
          <option value="Airde Developer">Airde Developer</option>
          <option value="Sora Realtor">Sora Realtor</option>
          <option value="Unique Realcon">Unique Realcon</option>
        </select>

        {/* Clear Button */}
        {search && (
          <Button
            variant="outline"
            onClick={clearSearch}
            className="whitespace-nowrap"
          >
            Clear
          </Button>
        )}

        {/* Search Icon */}
        <Button size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block rounded-xl border bg-white p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Advance</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{inv._id}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(inv._id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>

                <TableCell>{inv.customer.name}</TableCell>
                <TableCell>{inv.customer.phone}</TableCell>
                <TableCell>₹{formatAmount(inv.totalAmount)}</TableCell>

                <TableCell>₹{formatAmount(inv.advance)}</TableCell>

                <TableCell className="text-red-600 font-semibold">
                  ₹{formatAmount(inv.remainingAmount)}
                </TableCell>
                <TableCell>{inv.executiveName}</TableCell>
                <TableCell>{getDate(inv.createdAt)}</TableCell>
                <TableCell>{getTime(inv.createdAt)}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleHistoryClick(inv)}
                  >
                    History
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/invoice/${inv._id}`, {
                        state: { invoice: inv },
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button size="sm" onClick={() => handleEditClick(inv)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setInvoiceToDelete(inv._id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/invoice/${inv._id}`, {
                        state: { invoice: inv },
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <ActionMenu inv={inv} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {filteredInvoices.map((inv) => (
          <Card
            key={inv._id}
            className="overflow-hidden border-l-4 border-l-primary"
          >
            <CardContent className="p-0">
              {/* Card Header: ID & Actions */}
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    {inv._id}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => copyToClipboard(inv._id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <ActionMenu inv={inv} />
              </div>

              {/* Card Body: Customer Info */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {inv.customer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {inv.customer.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Remaining
                    </p>
                    <p className="font-bold text-red-600 text-lg">
                      ₹{formatAmount(inv.remainingAmount)}
                    </p>
                  </div>
                </div>

                {/* Grid for extra details */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Total Amount
                    </p>
                    <p className="font-medium">
                      ₹{formatAmount(inv.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Advance Paid
                    </p>
                    <p className="font-medium text-green-600">
                      ₹{formatAmount(inv.advance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Agent</p>
                    <p className="font-medium">{inv.executiveName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p className="font-medium">{getDate(inv.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= DELETE CONFIRMATION ================= */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The invoice and all related payments
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= EDIT PAYMENT MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>

          {/* ===== Tabs ===== */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setEditTab("payment")}
              className={`flex-1 py-2 text-sm font-medium ${
                editTab === "payment"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Payment
            </button>

            <button
              onClick={() => setEditTab("kyc")}
              className={`flex-1 py-2 text-sm font-medium ${
                editTab === "kyc"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              KYC
            </button>
          </div>

          {editTab === "payment" && (
            <>
              <DialogHeader>
                <DialogTitle>Add Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={payment ?? ""}
                  onChange={(e) =>
                    setPayment(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <select
                  className="w-full border rounded-md h-10 px-3"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                >
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Demand Draft</option>
                  <option>Others</option>
                </select>
              </div>

              {paymentMode === "Cheque" && (
                <>
                  {/* CHEQUE NUMBER */}
                  <Input
                    placeholder="Enter 6 digit cheque number"
                    value={chequeNumber}
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Only digits allowed
                      if (!/^\d*$/.test(value)) return;

                      setChequeNumber(value);

                      if (value.length != 6) {
                        setChequeError("Cheque number must be 6 digits");
                      } else {
                        setChequeError("");
                      }
                    }}
                    className={chequeError ? "border-red-500" : ""}
                  />

                  {/* BANK NAME */}
                  <Input
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => {
                      setBankName(e.target.value);

                      if (!e.target.value.trim()) {
                        setBankError("Bank name is required");
                      } else {
                        setBankError("");
                      }
                    }}
                    className={bankError ? "border-red-500" : ""}
                  />
                </>
              )}
            </>
          )}
          {editTab === "kyc" && (
            <div className="space-y-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={newPhone}
                  maxLength={10}
                  onChange={(e) =>
                    setNewPhone(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div>
                <Label>PAN</Label>
                <Input
                  value={newPAN}
                  maxLength={10}
                  onChange={(e) => {
                    //setNewPAN(e.target.value.toUpperCase())
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    if (value.length <= 10) {
                      setNewPAN(value);
                    }
                  }}
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editTab === "payment" ? handleUpdate : handleKycUpdate}
              disabled={loading || kycLoading}
            >
              {loading || kycLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Invoice History</DialogTitle>
          </DialogHeader>

          {historyLoading ? (
            <p>Loading history...</p>
          ) : historyInvoices.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No previous versions found.
            </p>
          ) : (
            <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Advance</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {historyInvoices.map((inv) => (
                    <TableRow key={inv._id}>
                      <TableCell className="font-medium">{inv._id}</TableCell>

                      <TableCell>₹{formatAmount(inv.totalAmount)}</TableCell>

                      <TableCell className="text-green-700">
                        ₹{formatAmount(inv.advance)}
                      </TableCell>

                      <TableCell className="text-red-600 font-semibold">
                        ₹{formatAmount(inv.remainingAmount)}
                      </TableCell>

                      <TableCell>{getDate(inv.createdAt)}</TableCell>

                      <TableCell>{getTime(inv.createdAt)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/invoice/${inv._id}`, {
                              state: { invoice: inv },
                            })
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
