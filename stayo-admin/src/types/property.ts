export type PropertyStatus = "Active" | "Pending" | "Disabled";
export type PropertyType = "Hotel" | "Guesthouse" | "Hostel" | "Service Apartment" | "Resort" | "Boutique";
export type PricingMode = "Hourly" | "Daily" | "Hybrid";
export type TaxConfig = "Inclusive" | "Exclusive" | "None";

export interface Property {
  id: string;
  name: string;
  propertyCode: string;
  tenantId: string;
  tenantName: string;
  brandName: string;
  propertyType: PropertyType;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: string;
  longitude: string;
  totalFloors: number;
  totalRooms: number;
  defaultCheckIn: string;
  defaultCheckOut: string;
  hourlyStayEnabled: boolean;
  pricingMode: PricingMode;
  taxConfig: TaxConfig;
  kycRequired: boolean;
  status: PropertyStatus;
  openingDate: string;
  notes: string;
  createdAt: string;
  rooms: number;
  plan: string;
  devices: number;
}

export type PropertyItem = Property;
