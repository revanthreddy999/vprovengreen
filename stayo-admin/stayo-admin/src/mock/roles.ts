import type { RoleItem } from "../types/role";

export const rolesMock: RoleItem[] = [
  {
    id: "role_1", name: "Owner", description: "Full access to all modules",
    permissions: { checkin: true, checkout: true, operations: true, dashboard: true, properties: true, users: true, devices: true, billing: true, invoices: true, reports: true, audit: true, settings: true, integrations: true },
  },
  {
    id: "role_2", name: "Manager", description: "Operations and management without finance access",
    permissions: { checkin: true, checkout: true, operations: true, dashboard: true, properties: true, users: true, devices: true, billing: false, invoices: false, reports: true, audit: true, settings: false, integrations: false },
  },
  {
    id: "role_3", name: "Receptionist", description: "Front desk operations only",
    permissions: { checkin: true, checkout: true, operations: true, dashboard: true, properties: false, users: false, devices: false, billing: false, invoices: false, reports: false, audit: false, settings: false, integrations: false },
  },
];
