export type PlanUsage = {
  planName: string;
  deviceLimit: number;
  activeDevices: number;
  monthlyCheckins: number;
  usagePercentage: number;
  billingCycle: string;
};