import type { AuditItem } from "../types/audit";

export const auditMock: AuditItem[] = [
  { id: "a01", timestamp: "28 Mar 2026, 10:32 AM", user: "Ravi Kumar", action: "Check-In Guest", module: "Check-In", property: "Stayo Hyderabad Hub", status: "Success" },
  { id: "a02", timestamp: "28 Mar 2026, 10:15 AM", user: "Anitha S", action: "Upload KYC Document", module: "KYC", property: "Stayo Chennai Grand", status: "Success" },
  { id: "a03", timestamp: "28 Mar 2026, 09:48 AM", user: "Arjun V", action: "Login Attempt", module: "Auth", property: "Stayo Hyderabad Hub", status: "Failed" },
  { id: "a04", timestamp: "28 Mar 2026, 09:20 AM", user: "Admin User", action: "Update Billing Plan", module: "Billing", property: "Global", status: "Success" },
  { id: "a05", timestamp: "28 Mar 2026, 08:55 AM", user: "Bhavana R", action: "Revoke Device", module: "Devices", property: "Stayo Bangalore Heights", status: "Success" },
  { id: "a06", timestamp: "28 Mar 2026, 08:30 AM", user: "Priya M", action: "Check-Out Guest", module: "Check-Out", property: "Stayo Tirupati Central", status: "Success" },
  { id: "a07", timestamp: "27 Mar 2026, 07:45 PM", user: "Kiran Babu", action: "Update Settings", module: "Settings", property: "Stayo Hyderabad Hub", status: "Success" },
  { id: "a08", timestamp: "27 Mar 2026, 06:30 PM", user: "Admin User", action: "Create User Account", module: "Users", property: "Global", status: "Success" },
  { id: "a09", timestamp: "27 Mar 2026, 05:12 PM", user: "Deepa Nair", action: "Login Attempt", module: "Auth", property: "Stayo Vizag Bay", status: "Failed" },
  { id: "a10", timestamp: "27 Mar 2026, 04:00 PM", user: "Ravi Kumar", action: "Check-In Guest", module: "Check-In", property: "Stayo Hyderabad Hub", status: "Success" },
  { id: "a11", timestamp: "27 Mar 2026, 02:20 PM", user: "Anitha S", action: "Create Booking", module: "Check-In", property: "Stayo Chennai Grand", status: "Success" },
  { id: "a12", timestamp: "27 Mar 2026, 01:45 PM", user: "Bhavana R", action: "Reset Password", module: "Auth", property: "Global", status: "Success" },
];
