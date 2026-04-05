export type DeviceStatus = "Active" | "Inactive" | "Revoked" | "Outdated" | "Healthy";
export type DeviceType = "Tablet" | "Phone" | "Kiosk" | "POS Terminal" | "Laptop" | "Desktop";
export type DevicePlatform = "Android" | "iOS" | "Windows" | "Linux" | "Web";

export interface DeviceItem {
  id: string;
  deviceName: string;
  deviceCode: string;
  deviceType: DeviceType;
  platform: DevicePlatform;
  appVersion: string;
  osVersion: string;
  propertyId: string;
  propertyName: string;
  assignedUserId: string;
  assignedUserName: string;
  serialNumber: string;
  pushToken: string;
  enrollmentDate: string;
  lastSeen: string;
  status: DeviceStatus;
  remarks: string;
  // Legacy compat
  deviceId: string;
  user: string;
  property: string;
  version: string;
}
