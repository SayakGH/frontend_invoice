import api from "./axios";
import type {
  ICreateInvoiceResponse,
  IGetAllInvoiceResponse,
  INVOICE,
  IUpdateInvoicePaymentResponse,
} from "@/types/invoiceType.ts";

export const createInvoice = async (data: INVOICE) => {
  const token = localStorage.getItem("authToken");

  const res = await api.post<ICreateInvoiceResponse>(
    "/invoices/create",
    { data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllInvoices = async () => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<IGetAllInvoiceResponse>("/invoices", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateInvoice = async (
  id: string,
  payload: {
    amount: number;
    customerName: string;
    paymentMode:
      | "Bank Transfer"
      | "Cheque"
      | "UPI"
      | "Cash"
      | "Demand Draft"
      | "Others";
    chequeNumber?: string;
    bankName?: string;
  }
) => {
  const token = localStorage.getItem("authToken");

  const res = await api.put<IUpdateInvoicePaymentResponse>(
    `/invoices/update/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
