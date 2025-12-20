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
import { toast } from "sonner";

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

  const [loading, setLoading] = useState(false);
  const resetForm = () => {
    setCompany("Unique Realcon");

    setCustomer({
      name: "",
      phone: "",
      address: "",
      PAN: "",
      GSTIN: "",
    });

    setItems([
      {
        description: "",
        projectName: "",
        hashingCode: "",
        rate: 0,
        areaSqFt: 0,
      },
    ]);

    setParking(0);
    setAmenities(0);
    setOtherCharges(0);
    setGstPercent(18);

    setAdvance(0);
    setPaymentMode("Bank Transfer");
    setChequeNumber("");
    setBankName("");
  };

  const handleSubmit = async () => {
    /* ================= VALIDATION ================= */

    if (!company) {
      toast.error("Company is required");
      return;
    }

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.PAN
    ) {
      toast.error("Please fill all mandatory customer details");
      return;
    }

    if (customer.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (customer.PAN.length !== 10) {
      toast.error("PAN must be 10 characters");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one invoice item");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (
        !item.description ||
        !item.projectName ||
        !item.hashingCode ||
        item.rate <= 0 ||
        item.areaSqFt <= 0
      ) {
        toast.error(`Invoice item ${i + 1} is incomplete`);
        return;
      }
    }

    if (paymentMode === "Cheque") {
      if (!chequeNumber || chequeNumber.length !== 6 || !bankName) {
        toast.error("Cheque number and bank name are required");
        return;
      }
    }

    if (advance > totalAmount) {
      toast.error("Advance amount cannot exceed total amount");
      return;
    }

    /* ================= PAYLOAD ================= */

    const payload: CreateInvoicePayload = {
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

    /* ================= API ================= */

    try {
      setLoading(true);
      await create(payload);
      setLoading(false);

      toast.success("Invoice created successfully 🎉");

      resetForm();
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to create invoice. Please try again."
      );
    }
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
            <Label className="flex items-center gap-1">
              Customer Name
              <span className="text-red-500">*</span>
            </Label>

            <Input
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Phone Number
              <span className="text-red-500">*</span>
            </Label>

            <Input
              value={customer.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // remove non-digits

                if (value.length <= 10) {
                  setCustomer({ ...customer, phone: value });
                }
              }}
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-1">
              Address
              <span className="text-red-500">*</span>
            </Label>

            <Input
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              PAN
              <span className="text-red-500">*</span>
            </Label>

            <Input
              value={customer.PAN}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");

                if (value.length <= 10) {
                  setCustomer({ ...customer, PAN: value });
                }
              }}
              placeholder="ABCDE1234F"
            />
          </div>

          <div className="space-y-2">
            <Label>
              GSTIN <span className="text-muted-foreground">(Optional)</span>
            </Label>

            <Input
              value={customer.GSTIN}
              maxLength={15}
              onChange={(e) => {
                const value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, ""); // allow only alphanumeric

                if (value.length <= 15) {
                  setCustomer({ ...customer, GSTIN: value });
                }
              }}
              placeholder="27AAPFU0939F1ZV"
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
                  <Label className="flex items-center gap-1">
                    Description
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Project Name
                    <span className="text-red-500">*</span>
                  </Label>

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
                  <Label className="flex items-center gap-1">
                    HSN Code
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    value={item.hashingCode}
                    onChange={(e) =>
                      updateItem(index, "hashingCode", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Rate (₹ / sq.ft)
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", Number(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Area (sq.ft)
                    <span className="text-red-500">*</span>
                  </Label>
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
              <Label className="flex items-center gap-1">
                GST (%)
                <span className="text-red-500">*</span>
              </Label>
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
            <Label className="flex items-center gap-1">
              Mode of Payment
              <span className="text-red-500">*</span>
            </Label>
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
                <Label className="flex items-center gap-1">
                  Cheque Number
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={chequeNumber}
                  maxLength={6}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // digits only

                    if (value.length <= 6) {
                      setChequeNumber(value);
                    }
                  }}
                  placeholder="Enter 6-digit cheque number"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Bank Name
                  <span className="text-red-500">*</span>
                </Label>
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
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </div>
  );
}
