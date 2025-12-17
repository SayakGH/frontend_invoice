import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CreateInvoicePayload,
  ICreateInvoiceResponse,
} from "@/types/invoiceType";
import { createInvoice } from "@/api/invoice";

/* ================= TYPES ================= */
type LineItem = {
  description: string;
  projectName: string;
  hashingCode: string;
  rate: number;
  areaSqFt: number;
};

/* ================= COMPONENT ================= */
export default function AddInvoice() {
  /* ================= STATE ================= */

  // Company
  const [company, setCompany] = useState<
    | "Airde Real Estate"
    | "Airde Developers"
    | "Sora Realtors"
    | "Unique Realcon"
  >("Unique Realcon");

  // Customer
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    PAN: "",
    GSTIN: "",
  });

  // Invoice items
  const [items, setItems] = useState<LineItem[]>([
    {
      description: "",
      projectName: "",
      hashingCode: "",
      rate: 0,
      areaSqFt: 0,
    },
  ]);

  // Charges & tax
  const [parking, setParking] = useState(0);
  const [amenities, setAmenities] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);

  // Payment
  const [advance, setAdvance] = useState(0);
  const [paymentMode, setPaymentMode] = useState<
    "Bank Transfer" | "Cheque" | "UPI" | "Cash" | "Demand Draft" | "Others"
  >("Bank Transfer");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");

  /* ================= CALCULATIONS ================= */

  const itemsTotal = items.reduce(
    (sum, item) => sum + item.rate * item.areaSqFt,
    0
  );

  const extraCharges = parking + amenities + otherCharges;
  const subTotal = itemsTotal + extraCharges;
  const gstAmount = (subTotal * gstPercent) / 100;
  const totalAmount = subTotal + gstAmount;
  const remainingAmount = Math.ceil(Math.max(totalAmount - advance, 0));

  /* ================= HANDLERS ================= */

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        projectName: "",
        hashingCode: "",
        rate: 0,
        areaSqFt: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = <K extends keyof LineItem>(
    index: number,
    field: K,
    value: LineItem[K]
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const create = async (data: CreateInvoicePayload) => {
    const response: ICreateInvoiceResponse = await createInvoice(data);
    return response;
  };

  const handleSubmit = async () => {
    const payload = {
      company,
      customer,
      items,
      charges: {
        parking,
        amenities,
        otherCharges,
      },
      gst: {
        percentage: gstPercent,
        amount: gstAmount,
      },
      payment: {
        mode: paymentMode,
        chequeNumber: paymentMode === "Cheque" ? chequeNumber : null,
        bankName: paymentMode === "Cheque" ? bankName : null,
      },
      itemsTotal,
      subTotal,
      totalAmount,
      advance,
      remainingAmount,
    };

    const response: ICreateInvoiceResponse = await create(payload);

    console.log("Invoice Payload:", payload);
    // TODO: Send to backend
  };

  /* ================= UI ================= */
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* ================= COMPANY ================= */}
      <Card>
        <CardContent className="space-y-2">
          <Label>Invoice Issuing Company</Label>
          <Select
            value={company}
            onValueChange={(value) => setCompany(value as typeof company)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Airde Real Estate">
                Airde Real Estate
              </SelectItem>
              <SelectItem value="Airde Developers">Airde Developers</SelectItem>
              <SelectItem value="Sora Realtors">Sora Realtors</SelectItem>
              <SelectItem value="Unique Realcon">Unique Realcon</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= CUSTOMER DETAILS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>PAN</Label>
            <Input
              value={customer.PAN}
              onChange={(e) =>
                setCustomer({ ...customer, PAN: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              GSTIN <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              value={customer.GSTIN}
              onChange={(e) =>
                setCustomer({ ...customer, GSTIN: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= INVOICE ITEMS ================= */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Invoice Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="space-y-4 border rounded-lg p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={item.projectName}
                    onChange={(e) =>
                      updateItem(index, "projectName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>HSN Code</Label>
                  <Input
                    value={item.hashingCode}
                    onChange={(e) =>
                      updateItem(index, "hashingCode", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate (₹ / sq.ft)</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", Number(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Area (sq.ft)</Label>
                  <Input
                    type="number"
                    value={item.areaSqFt}
                    onChange={(e) =>
                      updateItem(index, "areaSqFt", Number(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Item Total: ₹
                  {(item.rate * item.areaSqFt).toLocaleString("en-IN")}
                </span>

                {items.length > 1 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= CHARGES & TAX ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Charges & Tax</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Parking</Label>
              <Input
                type="number"
                value={parking}
                onChange={(e) => setParking(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <Input
                type="number"
                value={amenities}
                onChange={(e) => setAmenities(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Other Charges</Label>
              <Input
                type="number"
                value={otherCharges}
                onChange={(e) => setOtherCharges(Number(e.target.value))}
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>GST (%)</Label>
              <Input
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
              />
            </div>

            <div className="flex items-end justify-between text-sm">
              <span>GST Amount</span>
              <span className="font-semibold">
                ₹{gstAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= PAYMENT SUMMARY ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex justify-between text-sm">
            <span>Total Amount</span>
            <span className="font-semibold">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="space-y-2">
            <Label>Advance Paid</Label>
            <Input
              type="number"
              value={advance}
              onChange={(e) => setAdvance(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span>Remaining Amount</span>
            <span className="font-semibold text-red-600">
              ₹{remainingAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Mode of Payment</Label>
            <Select
              value={paymentMode}
              onValueChange={(value) =>
                setPaymentMode(value as typeof paymentMode)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Demand Draft">Demand Draft</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMode === "Cheque" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cheque Number</Label>
                <Input
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Create Invoice</Button>
      </div>
    </div>
  );
}
