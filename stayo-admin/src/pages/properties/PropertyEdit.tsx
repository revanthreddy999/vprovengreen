import { useParams } from "react-router-dom";
import PropertyForm from "./PropertyForm";
import { propertiesMock } from "../../mock/properties";
export default function PropertyEdit() {
  const { id } = useParams();
  const prop = propertiesMock.find(p => p.id === id);
  if (!prop) return <div className="p-10 text-slate-500">Property not found.</div>;
  return <PropertyForm mode="edit" initial={prop} />;
}
