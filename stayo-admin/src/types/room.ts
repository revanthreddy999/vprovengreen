export type RoomStatus = "Active" | "Inactive" | "Under Renovation";
export type HousekeepingStatus = "Clean" | "Dirty" | "In Progress" | "Inspected";
export type OccupancyStatus = "Available" | "Occupied" | "Reserved" | "Blocked";
export type RoomType = "Standard" | "Deluxe" | "Suite" | "Executive" | "Studio" | "Dormitory";

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
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
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
