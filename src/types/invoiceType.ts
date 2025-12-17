/* ======================================
   INVOICE PAYLOAD INTERFACE
====================================== */

export interface CreateInvoicePayload {
  company:
    | "Airde Real Estate"
    | "Airde Developers"
    | "Sora Realtors"
    | "Unique Realcon";

  customer: {
    name: string;
    phone: string;
    address: string;
    PAN: string;
    GSTIN?: string;
  };

  items: {
    description: string;
    projectName: string;
    hashingCode: string;
    rate: number;
    areaSqFt: number;
  }[];

  charges: {
    parking: number;
    amenities: number;
    otherCharges: number;
  };

  gst: {
    percentage: number;
    amount: number;
  };

  payment: {
    mode:
      | "Bank Transfer"
      | "Cheque"
      | "UPI"
      | "Cash"
      | "Demand Draft"
      | "Others";
    chequeNumber: string | null;
    bankName: string | null;
  };

  itemsTotal: number;
  subTotal: number;
  totalAmount: number;

  advance: number;
  remainingAmount: number;
}

export interface INVOICE {
  _id: string;
  company: {
    name: String;
    address: String;
    phone: String;
    email: String;
  };

  customer: {
    name: string;
    phone: string;
    address: string;
    PAN: string;
    GSTIN?: string;
  };

  items: {
    description: string;
    projectName: string;
    hashingCode: string;
    rate: number;
    areaSqFt: number;
  }[];

  charges: {
    parking: number;
    amenities: number;
    otherCharges: number;
  };

  gst: {
    percentage: number;
    amount: number;
  };

  payment: {
    mode:
      | "Bank Transfer"
      | "Cheque"
      | "UPI"
      | "Cash"
      | "Demand Draft"
      | "Others";
    chequeNumber: string | null;
    bankName: string | null;
  };

  itemsTotal: number;
  subTotal: number;
  totalAmount: number;

  advance: number;
  remainingAmount: number;
  createdAt: string;
}

export interface ICreateInvoiceResponse {
  message: string;
  user: INVOICE;
}

export interface IGetAllInvoiceResponse {
  success: boolean;
  count: number;
  invoices: INVOICE[];
}

export interface IUpdateInvoicePaymentResponse {
  message: string;
  invoice: INVOICE;
}
