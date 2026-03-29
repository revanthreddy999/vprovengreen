export type RoleItem = {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
};