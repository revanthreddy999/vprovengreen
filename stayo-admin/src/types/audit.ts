export type AuditItem = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  property: string;
  status: "Success" | "Failed";
};