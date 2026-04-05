export type RoleScope = "Super Admin" | "Tenant Admin" | "Property" | "Support";

export type PermissionMatrix = {
  "dashboard.view": boolean;
  "tenants.view": boolean;
  "tenants.create": boolean;
  "tenants.edit": boolean;
  "tenants.delete": boolean;
  "properties.view": boolean;
  "properties.create": boolean;
  "properties.edit": boolean;
  "properties.delete": boolean;
  "rooms.view": boolean;
  "rooms.create": boolean;
  "rooms.edit": boolean;
  "users.view": boolean;
  "users.invite": boolean;
  "users.edit": boolean;
  "users.force_reset": boolean;
  "roles.view": boolean;
  "roles.manage": boolean;
  "devices.view": boolean;
  "devices.manage": boolean;
  "checkin.create": boolean;
  "checkout.complete": boolean;
  "stays.view": boolean;
  "payments.manage": boolean;
  "invoices.view": boolean;
  "reports.view": boolean;
  "reports.export": boolean;
  "audit.view": boolean;
  "integrations.manage": boolean;
  "settings.view": boolean;
  "settings.manage": boolean;
};

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  scope: RoleScope;
  active: boolean;
  permissions: PermissionMatrix;
  userCount?: number;
  createdAt?: string;
}
