export type DeviceItem = {
  id: string;
  deviceId: string;
  user: string;
  property: string;
  platform: "Android" | "iOS";
  version: string;
  lastSeen: string;
  status: "Healthy" | "Inactive" | "Outdated";
};