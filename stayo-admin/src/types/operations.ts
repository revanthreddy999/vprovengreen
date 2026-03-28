export type RoomStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance";
export type RoomType = "Standard" | "Deluxe" | "Suite";
export type IdType = "Aadhaar" | "PAN" | "Passport" | "Driving License" | "Voter ID";
export type PaymentMethod = "Cash" | "Card" | "UPI";
export type StayStatus = "Active" | "Extended" | "Late Checkout";

export type Room = {
  id: string;
  number: string;
  type: RoomType;
  floor: number;
  capacity: number;
  ratePerHour: number;
  status: RoomStatus;
  lastUpdated?: string;
};

export type Guest = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  idType: IdType;
  idNumber: string;
};

export type ActiveStay = {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  checkInTime: string;
  checkInDate: string;
  durationLabel: string;
  durationHours: number;
  checkOutTime: string;
  status: StayStatus;
  ratePerHour: number;
  baseAmount: number;
  idType: IdType;
  idNumber: string;
  paymentMethod: PaymentMethod;
  property: string;
};

export type ExtraCharge = {
  id: string;
  description: string;
  amount: number;
};
