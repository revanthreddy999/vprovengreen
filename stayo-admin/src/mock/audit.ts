import type { AuditItem } from "../types/audit";

export const auditMock: AuditItem[] = [
  {
    id: "aud_1",
    timestamp: "2026-03-17 10:32 AM",
    user: "Ravi Kumar",
    action: "Created Booking",
    module: "Check-In",
    property: "Stayo Tirupati Central",
    status: "Success",
  },
  {
    id: "aud_2",
    timestamp: "2026-03-17 09:48 AM",
    user: "Anitha S",
    action: "Uploaded KYC",
    module: "KYC",
    property: "Stayo Chennai Grand",
    status: "Success",
  },
  {
    id: "aud_3",
    timestamp: "2026-03-16 07:12 PM",
    user: "Arjun V",
    action: "Login Attempt",
    module: "Auth",
    property: "Stayo Hyderabad Hub",
    status: "Failed",
  },
  {
    id: "aud_4",
    timestamp: "2026-03-16 06:05 PM",
    user: "Admin User",
    action: "Updated Plan",
    module: "Billing",
    property: "Global",
    status: "Success",
  },
  {
    id: "aud_5",
    timestamp: "2026-03-16 04:22 PM",
    user: "Bhavana R",
    action: "Device Revoked",
    module: "Devices",
    property: "Stayo Bangalore Heights",
    status: "Success",
  },
];