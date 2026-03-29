import type { RevenueDataPoint, OccupancyDataPoint, TopProperty } from "../types/report";

export const revenueData: RevenueDataPoint[] = [
  { label: "Oct", value: 84000 },
  { label: "Nov", value: 92000 },
  { label: "Dec", value: 138000 },
  { label: "Jan", value: 76000 },
  { label: "Feb", value: 95000 },
  { label: "Mar", value: 121000 },
];

export const occupancyData: OccupancyDataPoint[] = [
  { label: "Mon", rate: 62 },
  { label: "Tue", rate: 74 },
  { label: "Wed", rate: 68 },
  { label: "Thu", rate: 81 },
  { label: "Fri", rate: 95 },
  { label: "Sat", rate: 98 },
  { label: "Sun", rate: 87 },
];

export const topProperties: TopProperty[] = [
  { name: "Stayo Chennai Grand", revenue: 42180, checkins: 318, occupancy: 94 },
  { name: "Stayo Bangalore Heights", revenue: 38920, checkins: 284, occupancy: 88 },
  { name: "Stayo Tirupati Central", revenue: 31440, checkins: 241, occupancy: 82 },
  { name: "Stayo Hyderabad Hub", revenue: 28750, checkins: 198, occupancy: 76 },
  { name: "Stayo Vizag Bay", revenue: 19710, checkins: 157, occupancy: 68 },
];

export const reportSummary = {
  totalRevenue: "₹1,61,000",
  totalCheckins: 1198,
  avgOccupancy: "81.6%",
  avgStayDuration: "4.2 hrs",
  revenueGrowth: "+12.4%",
  checkinGrowth: "+8.2%",
};
