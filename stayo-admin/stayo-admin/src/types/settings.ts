export type TenantSettings = {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  defaultLanguage: string;
};

export type PaymentSettings = {
  enableOnlinePayments: boolean;
  gateway: "Razorpay" | "Stripe";
  apiKey: string;
  webhookUrl: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  checkinAlerts: boolean;
  paymentAlerts: boolean;
  deviceAlerts: boolean;
};