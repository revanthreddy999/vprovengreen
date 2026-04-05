import { useParams } from "react-router-dom";
import UserForm from "./UserForm";
import { usersMock } from "../../mock/users";
export default function UserEdit() {
  const { id } = useParams();
  const user = usersMock.find(u => u.id === id);
  if (!user) return <div className="p-10 text-slate-500">User not found.</div>;
  return <UserForm mode="edit" initial={user} />;
}
