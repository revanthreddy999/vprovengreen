import type { TenantSettings } from "../types/settings";
import type { PaymentSettings } from "../types/settings";
import type { NotificationSettings }  from "../types/settings";

export const tenantSettingsMock: TenantSettings = {
  companyName: "Stayo Hospitality Pvt Ltd",
  contactEmail: "support@stayo.com",
  contactPhone: "+91 9876543210",
  address: "Tirupati, Andhra Pradesh, India",
  timezone: "Asia/Kolkata",
  defaultLanguage: "English",
};

export const paymentSettingsMock: PaymentSettings = {
  enableOnlinePayments: true,
  gateway: "Razorpay",
  apiKey: "rzp_test_123456",
  webhookUrl: "https://api.stayo.com/webhooks/payment",
};

export const notificationSettingsMock: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  checkinAlerts: true,
  paymentAlerts: true,
  deviceAlerts: true,
};