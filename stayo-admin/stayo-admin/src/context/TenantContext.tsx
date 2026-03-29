import { createContext, useContext, useState, type ReactNode } from "react";

export type Tenant = {
  id: string;
  name: string;
  plan: "Starter" | "Plus" | "Pro" | "Enterprise";
  properties: number;
  devices: number;
  status: "Active" | "Trial" | "Suspended";
};

export const ALL_TENANTS: Tenant[] = [
  { id: "t1", name: "Stayo Hyderabad Hub", plan: "Enterprise", properties: 6, devices: 48, status: "Active" },
  { id: "t2", name: "Grand Stay Hotels", plan: "Pro", properties: 8, devices: 64, status: "Active" },
  { id: "t3", name: "QuickStay Bangalore", plan: "Plus", properties: 2, devices: 12, status: "Active" },
  { id: "t4", name: "CityNest Chennai", plan: "Starter", properties: 1, devices: 4, status: "Trial" },
  { id: "t5", name: "HourlyInn Pune", plan: "Pro", properties: 5, devices: 38, status: "Active" },
  { id: "t6", name: "SleepWell Vizag", plan: "Plus", properties: 3, devices: 18, status: "Suspended" },
];

type TenantCtx = { current: Tenant; set: (t: Tenant) => void; all: Tenant[] };
const TenantContext = createContext<TenantCtx | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [current, set] = useState(ALL_TENANTS[0]);
  return <TenantContext.Provider value={{ current, set, all: ALL_TENANTS }}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant requires TenantProvider");
  return ctx;
}
