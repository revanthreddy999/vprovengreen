import { useParams } from "react-router-dom";
import RoleForm from "./RoleForm";
import { rolesMock } from "../../mock/roles";
export default function RoleEdit() {
  const { id } = useParams();
  const role = rolesMock.find(r => r.id === id);
  if (!role) return <div className="p-10 text-slate-500">Role not found.</div>;
  return <RoleForm mode="edit" initial={role} />;
}
