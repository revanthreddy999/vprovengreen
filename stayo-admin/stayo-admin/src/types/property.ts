export type PropertyItem = {
  id: string;
  name: string;
  city: string;
  rooms: number;
  plan: string;
  devices: number;
  status: "Active" | "Pending" | "Disabled";
  createdAt: string;
};