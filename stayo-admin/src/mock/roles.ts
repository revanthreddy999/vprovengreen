import type { RoleItem } from "../types/role";

export const rolesMock: RoleItem[] = [
  {
    id: "role_1",
    name: "Owner",
    description: "Full access to all modules",
    permissions: {
      dashboard: true,
      properties: true,
      users: true,
      devices: true,
      billing: true,
      audit: true,
      settings: true,
    },
  },
  {
    id: "role_2",
    name: "Manager",
    description: "Manage operations without billing access",
    permissions: {
      dashboard: true,
      properties: true,
      users: true,
      devices: true,
      billing: false,
      audit: true,
      settings: false,
    },
  },
  {
    id: "role_3",
    name: "Receptionist",
    description: "Limited front-desk access",
    permissions: {
      dashboard: true,
      properties: false,
      users: false,
      devices: false,
      billing: false,
      audit: false,
      settings: false,
    },
  },
];