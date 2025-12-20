import api from "./axios";
import type {
  ICreateInvoiceResponse,
  IGetAllInvoiceResponse,
  INVOICE,
  InvoiceCursorResponse,
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

export const getAllInvoices = async (
  limit = 10,
  cursor?: string | null
): Promise<InvoiceCursorResponse> => {
  const token = localStorage.getItem("authToken");

  const res = await api.get<InvoiceCursorResponse>("/invoices", {
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

export const generateInvoicePDF = async (invoice: INVOICE): Promise<Blob> => {
  const token = localStorage.getItem("authToken");
  const id = invoice._id;

  const res = await api.get<Blob>(`/invoices/pdf/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", // 🔴 REQUIRED for PDFs
  });

  return res.data;
};
