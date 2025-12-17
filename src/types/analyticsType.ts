export interface IAnalytics {
  totalInvoices: number;
  totalPaid: Number;
  totalDue: Number;
}

export interface IAnalyticsResponse {
  message: string;
  analytics: IAnalytics;
}
