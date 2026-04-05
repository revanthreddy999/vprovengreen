export type UserStatus = "Active" | "Disabled" | "Invited" | "Locked";
export type UserRole = "Super Admin" | "Tenant Admin" | "Property Manager" | "Front Desk" | "Finance" | "Auditor" | "Support Admin" | "Support Agent" | "Manager" | "Receptionist" | "Enterprise Admin";
export type InviteStatus = "Accepted" | "Pending" | "Expired";

export interface UserItem {
  id: string;
  fullName: string;
  employeeCode: string;
  email: string;
  phone: string;
  alternatePhone: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  defaultPropertyId: string;
  defaultPropertyName: string;
  accessibleProperties: string[];
  preferredLanguage: string;
  status: UserStatus;
  joinDate: string;
  profilePhotoUrl: string;
  inviteStatus: InviteStatus;
  mfaEnabled: boolean;
  lastLogin: string;
  notes: string;
  // Legacy aliases
  name: string;
  property: string;
}
