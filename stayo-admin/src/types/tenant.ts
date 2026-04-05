export type TenantStatus = "Active" | "Trial" | "Suspended" | "Churned";
export type TenantPlan = "Starter" | "Plus" | "Pro" | "Enterprise";
export type BillingCycle = "Monthly" | "Quarterly" | "Annual";

export interface Tenant {
  id: string;
  // Identity
  name: string;
  legalBusinessName: string;
  tenantCode: string;
  // Contact
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  billingEmail: string;
  supportPhone: string;
  // Plan & Billing
  plan: TenantPlan;
  status: TenantStatus;
  trialStartDate: string;
  trialEndDate: string;
  billingCycle: BillingCycle;
  gstin: string;
  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  // Limits
  maxProperties: number;
  maxDevices: number;
  // Locale
  defaultLanguage: string;
  timezone: string;
  // Meta
  notes: string;
  createdAt: string;
  // Computed
  properties: number;
  devices: number;
}
