import type {
  IAnalyticsResponse,
  IGetSummaryResponse,
} from "@/types/analyticsType";
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

export const getSummary = async () => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IGetSummaryResponse>("/analytics/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getCompanyAnalytics = async (company: string) => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IAnalyticsResponse>(
    `/analytics/company/${encodeURIComponent(company)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
