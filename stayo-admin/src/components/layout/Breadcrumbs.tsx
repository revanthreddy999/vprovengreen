import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeNameMap: Record<string, string> = {
  "": "Dashboard",
  properties: "Properties",
  users: "Users",
  roles: "Roles & Permissions",
  devices: "Devices",
  plans: "Plans & Usage",
  reports: "Reports",
  invoices: "Invoices",
  audit: "Audit Logs",
  integrations: "Integrations",
  settings: "Settings",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: routeNameMap[segment] ?? segment,
      path,
    };
  });

  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
      <Link to="/" className="hover:text-slate-700">
        Dashboard
      </Link>

      {crumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight size={14} />
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-slate-700">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-slate-700">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}