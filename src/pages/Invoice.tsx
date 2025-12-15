import { useState } from "react";
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

export default function Invoices() {
  const [search, setSearch] = useState("");

  const invoices = [
    {
      id: "INV-001",
      customer: "John Doe",
      phone: "9876543210",
      total: 1200000,
      advance: 500000,
      remaining: 700000,
      date: "12 Dec 2025",
      time: "10:45 AM",
    },
    {
      id: "INV-002",
      customer: "Sarah Lin",
      phone: "9123456780",
      total: 4200,
      advance: 2000,
      remaining: 2200,
      date: "13 Dec 2025",
      time: "02:15 PM",
    },
    {
      id: "INV-003",
      customer: "David Kim",
      phone: "9988776655",
      total: 85000,
      advance: 30000,
      remaining: 55000,
      date: "14 Dec 2025",
      time: "11:20 AM",
    },
    {
      id: "INV-004",
      customer: "Amit Sharma",
      phone: "9812345678",
      total: 250000,
      advance: 100000,
      remaining: 150000,
      date: "14 Dec 2025",
      time: "04:05 PM",
    },
    {
      id: "INV-005",
      customer: "Neha Verma",
      phone: "9900112233",
      total: 76000,
      advance: 40000,
      remaining: 36000,
      date: "15 Dec 2025",
      time: "09:30 AM",
    },
    {
      id: "INV-006",
      customer: "Rohit Mehta",
      phone: "9823456712",
      total: 540000,
      advance: 200000,
      remaining: 340000,
      date: "15 Dec 2025",
      time: "12:50 PM",
    },
    {
      id: "INV-007",
      customer: "Emily Carter",
      phone: "9011223344",
      total: 9800,
      advance: 5000,
      remaining: 4800,
      date: "16 Dec 2025",
      time: "03:10 PM",
    },
    {
      id: "INV-008",
      customer: "Arjun Patel",
      phone: "9877001122",
      total: 320000,
      advance: 120000,
      remaining: 200000,
      date: "16 Dec 2025",
      time: "05:45 PM",
    },
    {
      id: "INV-009",
      customer: "Sophia Brown",
      phone: "9345678123",
      total: 15000,
      advance: 5000,
      remaining: 10000,
      date: "17 Dec 2025",
      time: "10:00 AM",
    },
    {
      id: "INV-010",
      customer: "Kunal Singh",
      phone: "9765432109",
      total: 610000,
      advance: 250000,
      remaining: 360000,
      date: "17 Dec 2025",
      time: "01:40 PM",
    },
    {
      id: "INV-011",
      customer: "Priya Nair",
      phone: "9898989898",
      total: 43000,
      advance: 15000,
      remaining: 28000,
      date: "18 Dec 2025",
      time: "09:55 AM",
    },
    {
      id: "INV-012",
      customer: "Michael Scott",
      phone: "9554433221",
      total: 890000,
      advance: 400000,
      remaining: 490000,
      date: "18 Dec 2025",
      time: "02:35 PM",
    },
    {
      id: "INV-013",
      customer: "Ananya Roy",
      phone: "9887766554",
      total: 275000,
      advance: 125000,
      remaining: 150000,
      date: "19 Dec 2025",
      time: "11:15 AM",
    },
    {
      id: "INV-014",
      customer: "Chris Evans",
      phone: "9665544332",
      total: 18000,
      advance: 8000,
      remaining: 10000,
      date: "19 Dec 2025",
      time: "04:50 PM",
    },
    {
      id: "INV-015",
      customer: "Rahul Gupta",
      phone: "9700011223",
      total: 1250000,
      advance: 600000,
      remaining: 650000,
      date: "20 Dec 2025",
      time: "12:10 PM",
    },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Search Section (Sticky) */}
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

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4">Invoice ID</TableHead>
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
              <TableRow key={inv.id} className="hover:bg-muted/40">
                <TableCell className="py-5 font-medium">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>{inv.phone}</TableCell>
                <TableCell>₹{inv.total}</TableCell>
                <TableCell>₹{inv.advance}</TableCell>
                <TableCell className="font-semibold text-red-600">
                  ₹{inv.remaining}
                </TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.time}</TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="space-y-5 md:hidden">
        {filteredInvoices.map((inv) => (
          <Card key={inv.id} className="rounded-xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <p className="text-base font-semibold leading-tight">
                    {inv.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">{inv.id}</p>
                </div>

                <span className="text-sm font-semibold text-red-600">
                  ₹{inv.remaining}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-muted-foreground">Phone</p>
                <p>{inv.phone}</p>

                <p className="text-muted-foreground">Total</p>
                <p>₹{inv.total}</p>

                <p className="text-muted-foreground">Advance</p>
                <p>₹{inv.advance}</p>

                <p className="text-muted-foreground">Date</p>
                <p>
                  {inv.date}, {inv.time}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>

                <Button size="sm" className="flex-1 h-10 gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
