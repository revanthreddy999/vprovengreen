export type ReportPeriod = "today" | "week" | "month" | "quarter";

export type RevenueDataPoint = {
  label: string;
  value: number;
};

export type OccupancyDataPoint = {
  label: string;
  rate: number;
};

export type TopProperty = {
  name: string;
  revenue: number;
  checkins: number;
  occupancy: number;
};
