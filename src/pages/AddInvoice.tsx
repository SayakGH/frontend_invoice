import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";

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
  /* ---------- STATE ---------- */
  const [items, setItems] = useState<LineItem[]>([
    {
      description: "",
      projectName: "",
      hashingCode: "",
      rate: 0,
      areaSqFt: 0,
    },
  ]);

  const [advance, setAdvance] = useState(0);

  /* ---------- CALCULATIONS ---------- */
  const totalAmount = items.reduce(
    (sum, item) => sum + item.rate * item.areaSqFt,
    0
  );

  const remainingAmount = Math.max(totalAmount - advance, 0);

  /* ---------- HANDLERS ---------- */
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
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setItems(updated);
  };

  const handleSubmit = () => {
    const payload = {
      customer: {
        name: "",
        phone: "",
        address: "",
        PAN: "",
        GSTIN: "",
      },
      items,
      totalAmount,
      advance,
      remainingAmount,
    };

    console.log("Invoice Payload:", payload);
    // TODO: send to backend
  };

  /* ================= UI ================= */
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* ================= CUSTOMER DETAILS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input placeholder="Enter customer name" />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="Enter phone number" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Input placeholder="Flat / Street / City / PIN" />
          </div>

          <div className="space-y-2">
            <Label>PAN</Label>
            <Input placeholder="ABCDE1234F" />
          </div>

          <div className="space-y-2">
            <Label>
              GSTIN <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input placeholder="19ABCDE1234F1Z5" />
          </div>
        </CardContent>
      </Card>

      {/* ================= INVOICE ITEMS ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="space-y-4 rounded-lg border p-4">
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
                  <Label>Hashing Code</Label>
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
                    min={0}
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
                    min={0}
                    value={item.areaSqFt}
                    onChange={(e) =>
                      updateItem(index, "areaSqFt", Number(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Item Total:{" "}
                  <span className="font-semibold text-foreground">
                    ₹{(item.rate * item.areaSqFt).toLocaleString("en-IN")}
                  </span>
                </p>

                {items.length > 1 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove Item
                  </Button>
                )}
              </div>

              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= PAYMENT SUMMARY ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
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
              min={0}
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
        </CardContent>
      </Card>

      {/* ================= NOTES ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Additional notes for the invoice..." />
        </CardContent>
      </Card>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Create Invoice</Button>
      </div>
    </div>
  );
}
