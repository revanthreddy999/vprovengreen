export type InvoiceItem = {
  id: string;
  invoiceNo: string;
  property: string;
  billingPeriod: string;
  amount: string;
  gst: string;
  status: "Paid" | "Pending" | "Overdue";
};