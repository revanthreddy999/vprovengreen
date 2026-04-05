export type ServiceCategory =
  | "Food"
  | "Beverages"
  | "Laundry"
  | "Housekeeping"
  | "Early Check-In"
  | "Late Check-Out"
  | "Extra Bedding"
  | "Extra Person Charge"
  | "Parking"
  | "Mini Bar"
  | "Local Transport"
  | "Room Damage"
  | "Miscellaneous";

export type ServiceChargeStatus = "Active" | "Voided";

export interface ServiceCharge {
  id: string;
  stayId: string;
  // Item info
  category: ServiceCategory;
  itemName: string;
  description: string;
  // Pricing
  quantity: number;
  unitPrice: number;
  subtotal: number; // quantity × unitPrice
  taxable: boolean;
  taxRate: number;   // percentage e.g. 5, 12, 18
  taxAmount: number; // computed
  total: number;     // subtotal + taxAmount
  // Meta
  addedAt: string;   // "28 Mar 2026, 02:15 PM"
  addedBy: string;   // staff name
  notes: string;
  status: ServiceChargeStatus;
  voidedAt?: string;
  voidedBy?: string;
  voidReason?: string;
}

// ─── Category config ──────────────────────────────────────────────────────────
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Food", "Beverages", "Laundry", "Housekeeping",
  "Early Check-In", "Late Check-Out", "Extra Bedding",
  "Extra Person Charge", "Parking", "Mini Bar",
  "Local Transport", "Room Damage", "Miscellaneous",
];

export const CATEGORY_ICON: Record<ServiceCategory, string> = {
  "Food":               "🍽",
  "Beverages":          "🥤",
  "Laundry":            "👕",
  "Housekeeping":       "🧹",
  "Early Check-In":     "🌅",
  "Late Check-Out":     "🌙",
  "Extra Bedding":      "🛏",
  "Extra Person Charge":"👤",
  "Parking":            "🚗",
  "Mini Bar":           "🍾",
  "Local Transport":    "🚖",
  "Room Damage":        "⚠️",
  "Miscellaneous":      "📦",
};

export const CATEGORY_DEFAULT_TAX: Record<ServiceCategory, number> = {
  "Food": 5, "Beverages": 12, "Laundry": 18, "Housekeeping": 18,
  "Early Check-In": 12, "Late Check-Out": 12, "Extra Bedding": 12,
  "Extra Person Charge": 12, "Parking": 18, "Mini Bar": 18,
  "Local Transport": 5, "Room Damage": 18, "Miscellaneous": 12,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function computeCharge(
  quantity: number,
  unitPrice: number,
  taxable: boolean,
  taxRate: number
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = Math.round(quantity * unitPrice * 100) / 100;
  const taxAmount = taxable ? Math.round(subtotal * taxRate / 100) : 0;
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

export function summariseCharges(charges: ServiceCharge[]) {
  const active = charges.filter(c => c.status === "Active");
  const taxableItems = active.filter(c => c.taxable);
  const nonTaxableItems = active.filter(c => !c.taxable);
  return {
    count: active.length,
    taxableSubtotal: taxableItems.reduce((s, c) => s + c.subtotal, 0),
    nonTaxableSubtotal: nonTaxableItems.reduce((s, c) => s + c.subtotal, 0),
    totalTax: active.reduce((s, c) => s + c.taxAmount, 0),
    grandTotal: active.reduce((s, c) => s + c.total, 0),
  };
}
