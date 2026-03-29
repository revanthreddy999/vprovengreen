import type { PlanUsage } from "../types/plan";

export const planMock: PlanUsage = {
  planName: "Enterprise Plan",
  deviceLimit: 150,
  activeDevices: 124,
  monthlyCheckins: 1842,
  usagePercentage: 83,
  billingCycle: "March 2026",
};

export const planTiers = [
  { name: "Plus", price: "₹4,999/mo", devices: "10", checkins: "500", properties: "2", support: "Email" },
  { name: "Pro", price: "₹14,999/mo", devices: "50", checkins: "2,000", properties: "10", support: "Priority" },
  { name: "Enterprise", price: "Custom", devices: "Unlimited", checkins: "Unlimited", properties: "Unlimited", support: "Dedicated" },
];
