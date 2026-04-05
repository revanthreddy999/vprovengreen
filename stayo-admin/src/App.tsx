import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { NavLoaderProvider } from "./context/NavLoaderContext";
import { TenantProvider } from "./context/TenantContext";
import { PATHS } from "./routes/paths";

// Auth
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotUsername from "./pages/auth/ForgotUsername";
import ResetPassword from "./pages/auth/ResetPassword";
import InviteAccept from "./pages/auth/InviteAccept";
import MFAVerification from "./pages/auth/MFAVerification";
import SetupAuthenticator from "./pages/auth/SetupAuthenticator";
import BackupCodes from "./pages/auth/BackupCodes";

// Core
import Dashboard from "./pages/dashboard/Dashboard";

// Tenants (Super Admin)
import TenantsList from "./pages/tenants/TenantsList";
import TenantNew from "./pages/tenants/TenantNew";
import TenantDetail from "./pages/tenants/TenantDetail";
import TenantEdit from "./pages/tenants/TenantEdit";

// Properties
import PropertiesList from "./pages/properties/PropertiesList";
import PropertyNew from "./pages/properties/PropertyNew";
import PropertyDetail from "./pages/properties/PropertyDetail";
import PropertyEdit from "./pages/properties/PropertyEdit";

// Rooms
import RoomsList from "./pages/rooms/RoomsList";
import RoomNew from "./pages/rooms/RoomNew";
import RoomDetail from "./pages/rooms/RoomDetail";
import RoomEdit from "./pages/rooms/RoomEdit";

// Users
import UsersList from "./pages/users/UsersList";
import UserNew from "./pages/users/UserNew";
import UserDetail from "./pages/users/UserDetail";
import UserEdit from "./pages/users/UserEdit";

// Roles
import RolesList from "./pages/roles/RolesList";
import RoleNew from "./pages/roles/RoleNew";
import RoleDetail from "./pages/roles/RoleDetail";
import RoleEdit from "./pages/roles/RoleEdit";

// Devices
import Devices from "./pages/devices/Devices";

// Finance
import Plans from "./pages/plans/Plans";
import Reports from "./pages/reports/Reports";
import Invoices from "./pages/invoices/Invoices";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";

// System
import Audit from "./pages/audit/Audit";
import Integrations from "./pages/integrations/Integrations";

// Operations
import CheckIn from "./pages/operations/CheckIn";
import ActiveStays from "./pages/operations/ActiveStays";
import StayDetail from "./pages/operations/StayDetail";
import CheckOut from "./pages/operations/CheckOut";
import RoomStatus from "./pages/operations/RoomStatus";

// Settings
import Settings from "./pages/settings/Settings";
import PaymentSettingsPage from "./pages/settings/PaymentSettings";
import NotificationSettingsPage from "./pages/settings/NotificationSettings";
import ProfileSettings from "./pages/settings/ProfileSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import SessionHistory from "./pages/settings/SessionHistory";

// Support
import SupportLogin from "./pages/support/SupportLogin";
import SupportDashboard from "./pages/support/SupportDashboard";
import RecoverUser from "./pages/support/RecoverUser";

export default function App() {
  return (
    <BrowserRouter basename="/stayo-admin">
      <TenantProvider>
        <ToastProvider>
          <NavLoaderProvider>
            <Routes>
              {/* Auth */}
              <Route path={PATHS.login} element={<Login />} />
              <Route path={PATHS.forgotPassword} element={<ForgotPassword />} />
              <Route path={PATHS.forgotUsername} element={<ForgotUsername />} />
              <Route path={PATHS.resetPassword} element={<ResetPassword />} />
              <Route path={PATHS.inviteAccept} element={<InviteAccept />} />
              <Route path={PATHS.mfa} element={<MFAVerification />} />
              <Route path={PATHS.setupAuthenticator} element={<SetupAuthenticator />} />
              <Route path={PATHS.backupCodes} element={<BackupCodes />} />

              {/* Dashboard */}
              <Route path={PATHS.dashboard} element={<Dashboard />} />

              {/* Tenants (Super Admin) */}
              <Route path={PATHS.tenants} element={<TenantsList />} />
              <Route path={PATHS.tenantNew} element={<TenantNew />} />
              <Route path={PATHS.tenantDetail} element={<TenantDetail />} />
              <Route path={PATHS.tenantEdit} element={<TenantEdit />} />

              {/* Properties */}
              <Route path={PATHS.properties} element={<PropertiesList />} />
              <Route path={PATHS.propertyNew} element={<PropertyNew />} />
              <Route path={PATHS.propertyDetail} element={<PropertyDetail />} />
              <Route path={PATHS.propertyEdit} element={<PropertyEdit />} />

              {/* Rooms */}
              <Route path={PATHS.rooms} element={<RoomsList />} />
              <Route path={PATHS.roomNew} element={<RoomNew />} />
              <Route path={PATHS.roomDetail} element={<RoomDetail />} />
              <Route path={PATHS.roomEdit} element={<RoomEdit />} />

              {/* Users */}
              <Route path={PATHS.users} element={<UsersList />} />
              <Route path={PATHS.userNew} element={<UserNew />} />
              <Route path={PATHS.userDetail} element={<UserDetail />} />
              <Route path={PATHS.userEdit} element={<UserEdit />} />

              {/* Roles */}
              <Route path={PATHS.roles} element={<RolesList />} />
              <Route path={PATHS.roleNew} element={<RoleNew />} />
              <Route path={PATHS.roleDetail} element={<RoleDetail />} />
              <Route path={PATHS.roleEdit} element={<RoleEdit />} />

              {/* Devices */}
              <Route path={PATHS.devices} element={<Devices />} />

              {/* Finance */}
              <Route path={PATHS.plans} element={<Plans />} />
              <Route path={PATHS.reports} element={<Reports />} />
              <Route path={PATHS.invoices} element={<Invoices />} />
              <Route path={PATHS.invoiceDetail} element={<InvoiceDetail />} />

              {/* System */}
              <Route path={PATHS.audit} element={<Audit />} />
              <Route path={PATHS.integrations} element={<Integrations />} />

              {/* Operations */}
              <Route path={PATHS.checkIn} element={<CheckIn />} />
              <Route path={PATHS.activeStays} element={<ActiveStays />} />
              <Route path={PATHS.stayDetail} element={<StayDetail />} />
              <Route path={PATHS.checkOut} element={<CheckOut />} />
              <Route path={PATHS.roomStatus} element={<RoomStatus />} />

              {/* Settings */}
              <Route path={PATHS.settings} element={<Settings />} />
              <Route path={PATHS.paymentSettings} element={<PaymentSettingsPage />} />
              <Route path={PATHS.notifications} element={<NotificationSettingsPage />} />
              <Route path={PATHS.profile} element={<ProfileSettings />} />
              <Route path={PATHS.securitySettings} element={<SecuritySettings />} />
              <Route path={PATHS.sessionHistory} element={<SessionHistory />} />

              {/* Support */}
              <Route path={PATHS.supportLogin} element={<SupportLogin />} />
              <Route path={PATHS.support} element={<SupportDashboard />} />
              <Route path={PATHS.recoverUser} element={<RecoverUser />} />
            </Routes>
          </NavLoaderProvider>
        </ToastProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}
