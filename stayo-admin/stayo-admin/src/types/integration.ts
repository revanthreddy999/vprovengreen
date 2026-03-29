export type IntegrationStatus = "Connected" | "Disconnected" | "Error";
export type IntegrationCategory = "Payments" | "OTA" | "PMS" | "Communication" | "Analytics";

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  logoInitials: string;
  lastSync?: string;
  connectedAt?: string;
};
