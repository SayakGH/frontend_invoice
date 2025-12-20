export interface IInvoiceForGraph {
  _id: string;
  phone?: string; // optional because some invoices may have undefined
  advance: number;
  remainingAmount: number;
  createdAt: string;
}

export interface IAnalytics {
  totalInvoices: number;
  totalPaid: number;
  totalDue: number;
}

export interface IAnalyticsResponse {
  success: boolean;
  analytics: IAnalytics;              // summary totals
  graphData: IInvoiceForGraph[];      // array of invoices for graph
}
