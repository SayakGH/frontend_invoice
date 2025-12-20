import type { IAnalyticsResponse } from "@/types/analyticsType";
import api from "./axios";

/**
 * Fetch analytics data from backend.
 * Returns both summary analytics and invoices for graphing.
 */
export const getAnalytics = async (): Promise<IAnalyticsResponse> => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IAnalyticsResponse>("/analytics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // res.data structure:
  // {
  //   success: boolean,
  //   analytics: { totalInvoices, totalPaid, totalDue },
  //   graphData: [
  //     { _id, phone, advance, remainingAmount, createdAt },
  //     ...
  //   ]
  // }

  return res.data;
};
