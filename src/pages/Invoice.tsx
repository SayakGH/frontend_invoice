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
import { Download, Pencil, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type {
  INVOICE,
  IGetAllInvoiceResponse,
  IUpdateInvoicePaymentResponse,
} from "@/types/invoiceType";
import { getAllInvoices, updateInvoice } from "@/api/invoice";
import { useNavigate } from "react-router-dom";

/* ================= UTILS ================= */
function getDateFromISOString(isoString: string) {
  return new Date(isoString).toISOString().split("T")[0];
}

function getTimeHHMMFromISOString(isoString: string) {
  return new Date(isoString).toISOString().split("T")[1].slice(0, 5);
}

/* ================= COMPONENT ================= */
export default function Invoices() {
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState<
    "Bank Transfer" | "Cheque" | "UPI" | "Cash" | "Demand Draft" | "Others"
  >("Bank Transfer");

  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState<number | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<INVOICE | null>(null);
  const [loading, setLoading] = useState(false);

  const [invoices, setInvoices] = useState<INVOICE[]>([]);

  const getInvoices = async () => {
    const data: IGetAllInvoiceResponse = await getAllInvoices();
    setInvoices(data.invoices);
  };

  const updateInvoicePayment = async (
    id: string,
    customerName: string,
    amount: number,
    paymentMode:
      | "Bank Transfer"
      | "Cheque"
      | "UPI"
      | "Cash"
      | "Demand Draft"
      | "Others",
    chequeNumber?: string,
    bankName?: string
  ) => {
    const data: IUpdateInvoicePaymentResponse = await updateInvoice(id, {
      amount,
      customerName,
      paymentMode,
      chequeNumber,
      bankName,
    });
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv._id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.phone.includes(search)
  );

  /* ================= HANDLERS ================= */
  const handleEditClick = (invoice: INVOICE) => {
    setSelectedInvoice(invoice);
    setPayment(null);
    setPaymentMode("Bank Transfer");
    setChequeNumber("");
    setBankName("");
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedInvoice) return;

    try {
      setLoading(true);
      if (payment > selectedInvoice.remainingAmount || payment <= 0) {
        throw new Error("Invalid payment amount");
      }

      await updateInvoicePayment(
        selectedInvoice._id,
        selectedInvoice.customer.name,
        payment,
        paymentMode,
        paymentMode === "Cheque" ? chequeNumber : undefined,
        paymentMode === "Cheque" ? bankName : undefined
      );
      setOpen(false);
      setSelectedInvoice(null);
      setPayment(null);

      // refresh invoices
      getInvoices();
    } catch (err) {
      console.error("Payment update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= SEARCH ================= */}
      <div className="sticky top-0 z-20 bg-gray-100 pt-2 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search invoice / customer / phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-sm"
          />
          <Button className="flex gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block rounded-2xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Advance</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv._id}>
                <TableCell className="font-medium">{inv._id}</TableCell>
                <TableCell>{inv.customer.name}</TableCell>
                <TableCell>{inv.customer.phone}</TableCell>
                <TableCell>₹{inv.totalAmount}</TableCell>
                <TableCell>₹{inv.advance}</TableCell>
                <TableCell className="font-semibold text-red-600">
                  ₹{inv.remainingAmount}
                </TableCell>
                <TableCell>{getDateFromISOString(inv.createdAt)}</TableCell>
                <TableCell>{getTimeHHMMFromISOString(inv.createdAt)}</TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button
                    type="button"
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-5 md:hidden">
        {filteredInvoices.map((inv) => (
          <Card key={inv._id}>
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{inv.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{inv._id}</p>
                </div>
                <span className="font-semibold text-red-600">
                  ₹{inv.remainingAmount}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-muted-foreground">Phone</p>
                <p>{inv.customer.phone}</p>

                <p className="text-muted-foreground">Total</p>
                <p>₹{inv.totalAmount}</p>

                <p className="text-muted-foreground">Advance</p>
                <p>₹{inv.advance}</p>

                <p className="text-muted-foreground">Date</p>
                <p>
                  {getDateFromISOString(inv.createdAt)}{" "}
                  {getTimeHHMMFromISOString(inv.createdAt)}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center gap-2"
                  onClick={() =>
                    navigate(`/invoice/${inv._id}`, {
                      state: { invoice: inv },
                    })
                  }
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditClick(inv)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Payment ({selectedInvoice?._id})</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label>
              Payment Amount (less than {selectedInvoice?.remainingAmount})
            </Label>
            <Input
              type="number"
              value={payment ?? ""}
              onChange={(e) =>
                setPayment(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="Enter amount"
            />
          </div>
          {/* PAYMENT MODE */}
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <select
              className="w-full h-10 rounded-md border px-3 text-sm"
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target.value as
                    | "Bank Transfer"
                    | "Cheque"
                    | "UPI"
                    | "Cash"
                    | "Demand Draft"
                    | "Others"
                )
              }
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
            <div className="space-y-3">
              <div>
                <Label>Cheque Number</Label>
                <Input
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  placeholder="Enter cheque number"
                />
              </div>

              <div>
                <Label>Bank Name</Label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedInvoice(null);
                setPayment(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
