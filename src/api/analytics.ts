import type { IAnalyticsResponse } from "@/types/analyticsType";
import api from "./axios";

export const getAnalytics = async () => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IAnalyticsResponse>("/analytics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
