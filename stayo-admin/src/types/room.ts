export type RoomStatus = "Active" | "Inactive" | "Under Renovation";
export type HousekeepingStatus = "Clean" | "Dirty" | "In Progress" | "Inspected";
export type OccupancyStatus = "Available" | "Occupied" | "Reserved" | "Blocked";
export type RoomType = "Standard" | "Deluxe" | "Suite" | "Executive" | "Studio" | "Dormitory";

export interface RoomPhoto {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isPrimary: boolean;
  url: string; // placeholder/mock URL
}

export interface PricingWindow {
  id: string;
  label: string;        // "Weekend Surge", "Festival Pricing"
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  reason: string;       // "Diwali 2026", "Summer peak"
  active: boolean;
  createdAt: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  propertyId: string;
  propertyName: string;
  floor: number;
  roomType: RoomType;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  // Base pricing (always active unless a window overrides)
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  // Pricing windows
  pricingWindows: PricingWindow[];
  // Photos
  photos: RoomPhoto[];
  amenities: string[];
  housekeepingStatus: HousekeepingStatus;
  occupancyStatus: OccupancyStatus;
  maintenanceBlock: boolean;
  status: RoomStatus;
  notes: string;
  createdAt: string;
  // Legacy ops compatibility
  number: string;
  type: string;
  ratePerHour: number;
}

export interface MediaFile {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isPrimary?: boolean;
  url: string;
}
