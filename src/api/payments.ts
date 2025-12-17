import type { IGetPaymentResponse } from "@/types/paymentType";
import api from "./axios";

export const getAllPayments = async () => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IGetPaymentResponse>("/payments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
