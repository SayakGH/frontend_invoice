import { useEffect, useMemo, useState } from "react";
import { getAnalytics, getSummary, getCompanyAnalytics } from "@/api/analytics";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  IAnalyticsResponse,
  IChart,
  IGetSummaryResponse,
} from "@/types/analyticsType";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Company =
  | "Airde Real Estate"
  | "Airde Developer"
  | "Sora Realtor"
  | "Unique Realcon";

/* ================= HELPERS ================= */

const formatAmount = (value: number | string) => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatYAxis = (value: number) => {
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(1)} Cr`;
  if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(1)} L`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} K`;
  return value.toString();
};

export default function Analytics() {
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentsData, setPaymentsData] = useState<IChart[]>([]);
  const [totalEstimate, setTotalEstimate] = useState(0);

  const [company, setCompany] = useState<Company>("Airde Developer");
  const [companyInvoices, setCompanyInvoices] = useState(0);
  const [companyDue, setCompanyDue] = useState(0);
  const [companyPaid, setCompanyPaid] = useState(0);
  const [companyEstimate, setCompanyEstimate] = useState(0);

  /* ================= FETCH GLOBAL DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      const [analytics, summary]: [IAnalyticsResponse, IGetSummaryResponse] =
        await Promise.all([getAnalytics(), getSummary()]);

      const due = Number(analytics.analytics.totalDue);
      const paid = Number(analytics.analytics.totalPaid);

      setTotalInvoices(Number(analytics.analytics.totalInvoices));
      setTotalDue(due);
      setTotalPaid(paid);
      setPaymentsData(summary.analytics.last30DaysPayments);

      setTotalEstimate(due + paid);
    };

    fetchData();
  }, []);

  /* ================= FETCH COMPANY DATA ================= */

  useEffect(() => {
    const fetchCompanyAnalytics = async () => {
      const data = await getCompanyAnalytics(company);

      const due = Number(data.analytics.totalDue);
      const paid = Number(data.analytics.totalPaid);

      setCompanyInvoices(Number(data.analytics.totalInvoices));
      setCompanyDue(due);
      setCompanyPaid(paid);
      setCompanyEstimate(due + paid);
    };

    fetchCompanyAnalytics();
  }, [company]);

  /* ================= CHART DATA ================= */

  const chartData = useMemo(
    () =>
      paymentsData.map((item) => ({
        date: `${item.day} ${item.month}`,
        amount: Number(item.price),
      })),
    [paymentsData],
  );

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 0);

  return (
    <div className="space-y-6">
      {/* ================= GLOBAL DESKTOP STATS ================= */}

      <div className="hidden md:grid grid-cols-4 gap-6">
        <StatCard title="Total Invoices" value={totalInvoices} />

        <StatCard
          title="Total Amount Due"
          value={`₹${formatAmount(totalDue)}`}
          color="text-red-600"
        />

        <StatCard
          title="Total Paid Amount"
          value={`₹${formatAmount(totalPaid)}`}
          color="text-green-600"
        />

        <StatCard
          title="Total Estimate"
          value={`₹${formatAmount(totalEstimate)}`}
        />
      </div>

      {/* ================= GLOBAL MOBILE STATS ================= */}

      <div className="md:hidden">
        <Tabs defaultValue="invoices">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="estimate">Estimate</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <StatCard title="Total Invoices" value={totalInvoices} />
          </TabsContent>

          <TabsContent value="due">
            <StatCard
              title="Total Amount Due"
              value={`₹${formatAmount(totalDue)}`}
              color="text-red-600"
            />
          </TabsContent>

          <TabsContent value="paid">
            <StatCard
              title="Total Paid Amount"
              value={`₹${formatAmount(totalPaid)}`}
              color="text-green-600"
            />
          </TabsContent>

          <TabsContent value="estimate">
            <StatCard
              title="Total Estimate"
              value={`₹${formatAmount(totalEstimate)}`}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* ================= COMPANY FILTER ================= */}

      <div className="flex items-center gap-3">
        <p className="font-medium">Company:</p>

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value as Company)}
          className="border rounded-md px-3 py-2"
        >
          <option value="Airde Real Estate">Airde Real Estate</option>
          <option value="Airde Developer">Airde Developer</option>
          <option value="Sora Realtor">Sora Realtor</option>
          <option value="Unique Realcon">Unique Realcon</option>
        </select>
      </div>

      {/* ================= COMPANY BREAKDOWN ================= */}

      <Card>
        <CardHeader>
          <CardTitle>{company}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard title="Company Invoices" value={companyInvoices} />

            <StatCard
              title="Company Amount Due"
              value={`₹${formatAmount(companyDue)}`}
              color="text-red-600"
            />

            <StatCard
              title="Company Paid Amount"
              value={`₹${formatAmount(companyPaid)}`}
              color="text-green-600"
            />

            <StatCard
              title="Company Estimate"
              value={`₹${formatAmount(companyEstimate)}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= LINE CHART ================= */}

      <Card>
        <CardHeader>
          <CardTitle>Payments Received (Last 30 Days)</CardTitle>
        </CardHeader>

        <CardContent className="h-[320px] sm:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />

              <YAxis
                width={90}
                tickFormatter={formatYAxis}
                tickCount={6}
                domain={[0, Math.ceil(maxAmount * 1.1)]}
                allowDecimals={false}
              />

              <Tooltip
                formatter={(value: number | undefined) => [
                  `₹${formatAmount(value || 0)}`,
                  "Amount",
                ]}
              />

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

/* ================= REUSABLE CARD ================= */

function StatCard({
  title,
  value,
  color = "",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
