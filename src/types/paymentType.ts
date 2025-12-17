export interface IPayment {
  _id: string;
  invoiceId: string;
  amount: number;
  customerName: string;
  paymentMode:
    | "Bank Transfer"
    | "Cheque"
    | "UPI"
    | "Cash"
    | "Demand Draft"
    | "Others";
  chequeNumber?: string | null;
  bankName?: string | null;
  createdAt: string;
}

export interface IGetPaymentResponse {
  payments: IPayment[];
}
