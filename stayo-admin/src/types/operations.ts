export type IdType = "Aadhaar" | "PAN" | "Passport" | "Driving License" | "Voter ID";
export type PaymentMethod = "Cash" | "Card" | "UPI" | "Bank Transfer" | "Cheque";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid";
export type StayStatus = "Active" | "Extended" | "Late Checkout" | "Checked Out";
export type BookingType = "Walk-In" | "Pre-Booking" | "Corporate" | "OTA";
export type BookingSource = "Direct" | "Phone" | "WhatsApp" | "OTA" | "Agent" | "Corporate";
export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";
export type DiscountType = "Fixed" | "Percentage";

// Ops room (simplified for front desk use)
export type OpsRoomStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance";
export type OpsRoomType = "Standard" | "Deluxe" | "Suite" | "Executive" | "Studio";

export interface OpsRoom {
  id: string;
  number: string;
  type: OpsRoomType;
  floor: number;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  ratePerHour: number;
  halfDayRate: number;
  fullDayRate: number;
  status: OpsRoomStatus;
  lastUpdated?: string;
}

export interface KycDocument {
  id: string;
  idType: IdType;
  idNumber: string;
  frontImage: string | null;  // mock filename
  backImage: string | null;
  uploadedAt: string;
  verified: boolean;
}

export interface GuestRecord {
  // Identity
  fullName: string;
  phone: string;
  email: string;
  gender: Gender;
  dob: string;
  nationality: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  // ID / KYC
  idType: IdType;
  idNumber: string;
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  idFrontName: string;
  idBackName: string;
  guestNotes: string;
}

export interface OccupancyRecord {
  adultMale: number;
  adultFemale: number;
  children: number;
  // derived: totalAdults = adultMale + adultFemale, totalOccupancy = totalAdults + children
}

export interface StayRecord {
  // Booking
  bookingType: BookingType;
  bookingSource: BookingSource;
  bookingRef: string;
  // Property + Room
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomNumber: string;
  roomType: OpsRoomType;
  floor: number;
  // Timing
  checkInDate: string;
  checkInTime: string;
  expectedCheckOutDate: string;
  expectedCheckOutTime: string;
  durationHours: number;
  durationLabel: string;
  // Operational
  assignedStaff: string;
  specialRequests: string;
  ratePlan: string;
  stayNotes: string;
}

export interface PaymentRecord {
  // Rates
  ratePerHour: number;
  roomSubtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  totalRoomAmount: number;
  // Collection
  collectedAtCheckin: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  balancePending: number;
  paymentStatus: PaymentStatus;
  receiptGenerated: boolean;
}

// Full stay (combines all above)
export interface ActiveStay {
  id: string;
  // Guest
  guestName: string;
  phone: string;
  email: string;
  gender: Gender;
  nationality: string;
  idType: IdType;
  idNumber: string;
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  // Occupancy
  adultMale: number;
  adultFemale: number;
  children: number;
  // Stay
  bookingType: BookingType;
  bookingSource: BookingSource;
  bookingRef: string;
  property: string;
  propertyId: string;
  roomNumber: string;
  roomType: OpsRoomType;
  floor: number;
  checkInDate: string;
  checkInTime: string;
  expectedCheckOutDate: string;
  checkOutTime: string;
  durationLabel: string;
  durationHours: number;
  assignedStaff: string;
  specialRequests: string;
  stayNotes: string;
  ratePlan: string;
  // Payment
  ratePerHour: number;
  roomSubtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  totalRoomAmount: number;
  collectedAtCheckin: number;
  balancePending: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  paymentStatus: PaymentStatus;
  // Status
  status: StayStatus;
}

export interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
  addedAt?: string;
}
