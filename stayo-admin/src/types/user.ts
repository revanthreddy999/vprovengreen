export type UserItem = {
  id: string;
  name: string;
  role: "Manager" | "Receptionist" | "Enterprise Admin";
  property: string;
  phone: string;
  email: string;
  status: "Active" | "Disabled";
  lastLogin: string;
};