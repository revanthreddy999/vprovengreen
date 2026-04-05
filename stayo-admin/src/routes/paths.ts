export const PATHS = {
  login: "/login",
  dashboard: "/",

  // Auth flows
  inviteAccept: "/auth/invite-accept",
  forgotPassword: "/auth/forgot-password",
  forgotUsername: "/auth/forgot-username",
  resetPassword: "/auth/reset-password",
  changePassword: "/auth/change-password",
  mfa: "/auth/mfa",
  setupAuthenticator: "/auth/setup-authenticator",
  backupCodes: "/auth/backup-codes",
  trustedDevice: "/auth/trusted-device",
  accountLocked: "/auth/account-locked",

  // Super Admin — Tenants
  tenants: "/super-admin/tenants",
  tenantNew: "/super-admin/tenants/new",
  tenantDetail: "/super-admin/tenants/:id",
  tenantEdit: "/super-admin/tenants/:id/edit",

  // Properties
  properties: "/properties",
  propertyNew: "/properties/new",
  propertyDetail: "/properties/:id",
  propertyEdit: "/properties/:id/edit",

  // Rooms
  rooms: "/rooms",
  roomNew: "/rooms/new",
  roomDetail: "/rooms/:id",
  roomEdit: "/rooms/:id/edit",

  // Users
  users: "/users",
  userNew: "/users/new",
  userDetail: "/users/:id",
  userEdit: "/users/:id/edit",

  // Roles
  roles: "/roles",
  roleNew: "/roles/new",
  roleDetail: "/roles/:id",
  roleEdit: "/roles/:id/edit",

  // Devices
  devices: "/devices",
  deviceNew: "/devices/new",
  deviceDetail: "/devices/:id",

  // Operations
  checkIn: "/operations/check-in",
  activeStays: "/operations/active-stays",
  stayDetail: "/operations/active-stays/:id",
  checkOut: "/operations/check-out",
  roomStatus: "/operations/rooms",

  // Finance
  plans: "/plans",
  invoices: "/invoices",
  invoiceDetail: "/invoices/:id",
  reports: "/reports",

  // System
  audit: "/audit",
  integrations: "/integrations",

  // Settings
  settings: "/settings",
  paymentSettings: "/settings/payment",
  notifications: "/settings/notifications",
  securitySettings: "/settings/security",
  profile: "/settings/profile",
  sessionHistory: "/settings/sessions",

  // Support
  supportLogin: "/support/login",
  support: "/support",
  recoverUser: "/support/recover-user",
  unlockUser: "/support/unlock-user",
  forcePasswordReset: "/support/force-password-reset",
  resetMFA: "/support/reset-mfa",
} as const;

export const buildPath = {
  tenantDetail: (id: string) => `/super-admin/tenants/${id}`,
  tenantEdit: (id: string) => `/super-admin/tenants/${id}/edit`,
  propertyDetail: (id: string) => `/properties/${id}`,
  propertyEdit: (id: string) => `/properties/${id}/edit`,
  roomDetail: (id: string) => `/rooms/${id}`,
  roomEdit: (id: string) => `/rooms/${id}/edit`,
  userDetail: (id: string) => `/users/${id}`,
  userEdit: (id: string) => `/users/${id}/edit`,
  roleDetail: (id: string) => `/roles/${id}`,
  roleEdit: (id: string) => `/roles/${id}/edit`,
  deviceDetail: (id: string) => `/devices/${id}`,
  stayDetail: (id: string) => `/operations/active-stays/${id}`,
  invoiceDetail: (id: string) => `/invoices/${id}`,
};
