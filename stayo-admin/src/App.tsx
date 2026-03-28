import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { PATHS } from "./routes/paths";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Properties from "./pages/properties/Properties";
import Users from "./pages/users/Users";
import Roles from "./pages/roles/Roles";
import Devices from "./pages/devices/Devices";
import Plans from "./pages/plans/Plans";
import Reports from "./pages/reports/Reports";
import Invoices from "./pages/invoices/Invoices";
import Audit from "./pages/audit/Audit";
import Integrations from "./pages/integrations/Integrations";
import Settings from "./pages/settings/Settings";
import PaymentSettingsPage from "./pages/settings/PaymentSettings";
import NotificationSettingsPage from "./pages/settings/NotificationSettings";

// Operations
import CheckIn from "./pages/operations/CheckIn";
import ActiveStays from "./pages/operations/ActiveStays";
import CheckOut from "./pages/operations/CheckOut";
import RoomStatus from "./pages/operations/RoomStatus";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path={PATHS.login} element={<Login />} />
          <Route path={PATHS.dashboard} element={<Dashboard />} />
          <Route path={PATHS.properties} element={<Properties />} />
          <Route path={PATHS.users} element={<Users />} />
          <Route path={PATHS.roles} element={<Roles />} />
          <Route path={PATHS.devices} element={<Devices />} />
          <Route path={PATHS.plans} element={<Plans />} />
          <Route path={PATHS.reports} element={<Reports />} />
          <Route path={PATHS.invoices} element={<Invoices />} />
          <Route path={PATHS.audit} element={<Audit />} />
          <Route path={PATHS.integrations} element={<Integrations />} />
          <Route path={PATHS.settings} element={<Settings />} />
          <Route path={PATHS.paymentSettings} element={<PaymentSettingsPage />} />
          <Route path={PATHS.notifications} element={<NotificationSettingsPage />} />
          {/* Operations */}
          <Route path={PATHS.checkIn} element={<CheckIn />} />
          <Route path={PATHS.activeStays} element={<ActiveStays />} />
          <Route path={PATHS.checkOut} element={<CheckOut />} />
          <Route path={PATHS.roomStatus} element={<RoomStatus />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
