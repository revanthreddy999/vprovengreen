import type { DeviceItem } from "../types/device";

export const devicesMock: DeviceItem[] = [
  { id: "dev_1", deviceId: "DVC-10021", user: "Ravi Kumar",  property: "Stayo Tirupati Central",  platform: "Android", version: "1.3.4", lastSeen: "2 mins ago",  status: "Healthy"  },
  { id: "dev_2", deviceId: "DVC-10045", user: "Anitha S",    property: "Stayo Chennai Grand",      platform: "iOS",     version: "1.3.4", lastSeen: "12 mins ago", status: "Healthy"  },
  { id: "dev_3", deviceId: "DVC-10088", user: "Arjun V",     property: "Stayo Hyderabad Hub",      platform: "Android", version: "1.2.9", lastSeen: "3 days ago",  status: "Inactive" },
  { id: "dev_4", deviceId: "DVC-10102", user: "Bhavana R",   property: "Stayo Bangalore Heights",  platform: "Android", version: "1.2.8", lastSeen: "1 hour ago",  status: "Outdated" },
  { id: "dev_5", deviceId: "DVC-10111", user: "Admin User",  property: "Global",                   platform: "iOS",     version: "1.3.4", lastSeen: "5 mins ago",  status: "Healthy"  },
  { id: "dev_6", deviceId: "DVC-10134", user: "Kiran B",     property: "Stayo Vizag Bay",          platform: "Android", version: "1.3.3", lastSeen: "30 mins ago", status: "Outdated" },
  { id: "dev_7", deviceId: "DVC-10156", user: "Deepa N",     property: "Stayo Kochi Residency",   platform: "iOS",     version: "1.3.4", lastSeen: "8 mins ago",  status: "Healthy"  },
  { id: "dev_8", deviceId: "DVC-10178", user: "Suresh P",    property: "Stayo Pune Junction",      platform: "Android", version: "1.1.2", lastSeen: "10 days ago", status: "Inactive" },
];
