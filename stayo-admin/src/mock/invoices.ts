import type { InvoiceItem } from "../types/invoice";

export const invoicesMock: InvoiceItem[] = [
  {
    id: "inv_1",
    invoiceNo: "INV-2026-031",
    property: "Stayo Tirupati Central",
    billingPeriod: "Mar 2026",
    amount: "₹18,540",
    gst: "₹3,337",
    status: "Pending",
  },
  {
    id: "inv_2",
    invoiceNo: "INV-2026-028",
    property: "Stayo Chennai Grand",
    billingPeriod: "Mar 2026",
    amount: "₹22,100",
    gst: "₹3,978",
    status: "Paid",
  },
  {
    id: "inv_3",
    invoiceNo: "INV-2026-025",
    property: "Stayo Hyderabad Hub",
    billingPeriod: "Mar 2026",
    amount: "₹14,720",
    gst: "₹2,649",
    status: "Paid",
  },
  {
    id: "inv_4",
    invoiceNo: "INV-2026-019",
    property: "Stayo Bangalore Heights",
    billingPeriod: "Feb 2026",
    amount: "₹19,880",
    gst: "₹3,578",
    status: "Overdue",
  },
  {
    id: "inv_5",
    invoiceNo: "INV-2026-016",
    property: "Stayo Vizag Bay",
    billingPeriod: "Feb 2026",
    amount: "₹12,460",
    gst: "₹2,243",
    status: "Paid",
  },
];