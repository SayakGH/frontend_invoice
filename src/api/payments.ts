import type { IGetPaymentResponse } from "@/types/paymentType";
import api from "./axios";

export const getAllPayments = async (
  limit = 10,
  cursor?: string | null
): Promise<IGetPaymentResponse & { nextCursor: string | null }> => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<
    IGetPaymentResponse & { nextCursor: string | null }
  >("/payments", {
    params: {
      limit,
      cursor,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
