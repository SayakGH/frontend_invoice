import { getAnalytics } from "@/api/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IAnalyticsResponse, IInvoiceForGraph } from "@/types/analyticsType";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

export default function Analytics() {
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentsData, setPaymentsData] = useState<{ date: string; amount: number }[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      const data: IAnalyticsResponse = await getAnalytics();

      setTotalInvoices(Number(data.analytics.totalInvoices));
      setTotalDue(Number(data.analytics.totalDue));
      setTotalPaid(Number(data.analytics.totalPaid));

      // Map graphData to paymentsData
      const chartData = data.graphData.map((inv: IInvoiceForGraph) => ({
        // Format date as "DD MMM" for XAxis
        date: new Date(inv.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        // Total amount received for that invoice
        amount: Number(inv.advance || 0),
      }));

      // Optional: sort by date ascending
      chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setPaymentsData(chartData);
    };

    fetchdata();
  }, []);

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
              <Line type="monotone" dataKey="amount" strokeWidth={3} dot={false} stroke="#4ade80" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
