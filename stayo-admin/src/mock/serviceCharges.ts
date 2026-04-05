import type { ServiceCharge } from "../types/serviceCharge";

export const serviceChargesMock: ServiceCharge[] = [
  // ─── stay_001 (Priya Sharma) ───────────────────────────────────────────────
  {
    id: "sc_001", stayId: "stay_001",
    category: "Food", itemName: "Club Sandwich",
    description: "Chicken club sandwich with fries", quantity: 2, unitPrice: 220,
    subtotal: 440, taxable: true, taxRate: 5, taxAmount: 22, total: 462,
    addedAt: "28 Mar 2026, 11:15 AM", addedBy: "Arjun V",
    notes: "", status: "Active",
  },
  {
    id: "sc_002", stayId: "stay_001",
    category: "Beverages", itemName: "Fresh Juice (2x)",
    description: "Orange and watermelon juice", quantity: 2, unitPrice: 90,
    subtotal: 180, taxable: true, taxRate: 12, taxAmount: 22, total: 202,
    addedAt: "28 Mar 2026, 11:20 AM", addedBy: "Arjun V",
    notes: "", status: "Active",
  },
  {
    id: "sc_003", stayId: "stay_001",
    category: "Laundry", itemName: "Express Laundry",
    description: "3 items express wash and fold", quantity: 3, unitPrice: 80,
    subtotal: 240, taxable: true, taxRate: 18, taxAmount: 43, total: 283,
    addedAt: "28 Mar 2026, 12:00 PM", addedBy: "Ravi Kumar",
    notes: "Ready by 2 PM", status: "Active",
  },
  {
    id: "sc_004", stayId: "stay_001",
    category: "Parking", itemName: "Parking Charge",
    description: "Basement parking slot A-12", quantity: 1, unitPrice: 50,
    subtotal: 50, taxable: false, taxRate: 0, taxAmount: 0, total: 50,
    addedAt: "28 Mar 2026, 10:35 AM", addedBy: "Arjun V",
    notes: "Car number: TS09AB1234", status: "Active",
  },

  // ─── stay_002 (Rahul Mehta) ────────────────────────────────────────────────
  {
    id: "sc_005", stayId: "stay_002",
    category: "Mini Bar", itemName: "Mini Bar Items",
    description: "2 beers + 1 soft drink + chips", quantity: 1, unitPrice: 480,
    subtotal: 480, taxable: true, taxRate: 18, taxAmount: 86, total: 566,
    addedAt: "28 Mar 2026, 10:00 AM", addedBy: "Ravi Kumar",
    notes: "Minibar replenishment charge", status: "Active",
  },
  {
    id: "sc_006", stayId: "stay_002",
    category: "Extra Person Charge", itemName: "Extra Person",
    description: "Additional guest charge for 1 person", quantity: 1, unitPrice: 300,
    subtotal: 300, taxable: true, taxRate: 12, taxAmount: 36, total: 336,
    addedAt: "28 Mar 2026, 08:15 AM", addedBy: "Ravi Kumar",
    notes: "", status: "Active",
  },
  {
    id: "sc_007", stayId: "stay_002",
    category: "Food", itemName: "Room Service Breakfast",
    description: "Continental breakfast for 2", quantity: 2, unitPrice: 350,
    subtotal: 700, taxable: true, taxRate: 5, taxAmount: 35, total: 735,
    addedAt: "28 Mar 2026, 09:30 AM", addedBy: "Ravi Kumar",
    notes: "", status: "Active",
  },
  {
    id: "sc_008", stayId: "stay_002",
    category: "Beverages", itemName: "Bottled Water (Premium)",
    description: "Pack of 6 mineral water bottles", quantity: 1, unitPrice: 120,
    subtotal: 120, taxable: true, taxRate: 12, taxAmount: 14, total: 134,
    addedAt: "28 Mar 2026, 08:05 AM", addedBy: "Ravi Kumar",
    notes: "", status: "Voided",
    voidedAt: "28 Mar 2026, 09:00 AM", voidedBy: "Ravi Kumar",
    voidReason: "Added in error — guest brought own water",
  },

  // ─── stay_003 (Anita Reddy) ────────────────────────────────────────────────
  {
    id: "sc_009", stayId: "stay_003",
    category: "Late Check-Out", itemName: "Late Check-Out Fee",
    description: "Extended stay past 1 PM checkout", quantity: 1, unitPrice: 400,
    subtotal: 400, taxable: true, taxRate: 12, taxAmount: 48, total: 448,
    addedAt: "28 Mar 2026, 01:10 PM", addedBy: "Bhavana R",
    notes: "Guest requested 3 PM checkout", status: "Active",
  },
  {
    id: "sc_010", stayId: "stay_003",
    category: "Local Transport", itemName: "Airport Drop",
    description: "Cab arranged to Hyderabad airport", quantity: 1, unitPrice: 850,
    subtotal: 850, taxable: false, taxRate: 0, taxAmount: 0, total: 850,
    addedAt: "28 Mar 2026, 11:45 AM", addedBy: "Bhavana R",
    notes: "Cab partner: Olacabs", status: "Active",
  },
];
