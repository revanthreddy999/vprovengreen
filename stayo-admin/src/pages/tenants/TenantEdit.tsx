import { useParams } from "react-router-dom";
import TenantForm from "./TenantForm";
import { tenantsMock } from "../../mock/tenants";
export default function TenantEdit() {
  const { id } = useParams();
  const tenant = tenantsMock.find(t => t.id === id);
  if (!tenant) return <div className="p-10 text-slate-500">Tenant not found</div>;
  return <TenantForm mode="edit" initial={tenant} />;
}
