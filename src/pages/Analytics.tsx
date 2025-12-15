import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const totalInvoices = 152;
  const totalDue = 2750000;
  const totalPaid = 1980000;

  const paymentsData = [
    { date: "Aug 01", amount: 12000 },
    { date: "Aug 05", amount: 24000 },
    { date: "Aug 10", amount: 19000 },
    { date: "Aug 15", amount: 18000 },
    { date: "Aug 20", amount: 27000 },
    { date: "Aug 25", amount: 30000 },
    { date: "Aug 30", amount: 36000 },
  ];

  return (
    <div className="space-y-6">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalInvoices}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Amount Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ₹{totalDue.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden">
        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalInvoices}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="due">
            <Card>
              <CardHeader>
                <CardTitle>Total Amount Due</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  ₹{totalDue.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card>
              <CardHeader>
                <CardTitle>Total Paid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  ₹{totalPaid.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ================= LINE CHART ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Payments Received (Last 30 Days)</CardTitle>
        </CardHeader>

        <CardContent className="h-[300px] sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paymentsData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />

              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="amount"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
