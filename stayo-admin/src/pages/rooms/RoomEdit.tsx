import { useParams } from "react-router-dom";
import RoomForm from "./RoomForm";
import { roomsMgmtMock } from "../../mock/rooms";
export default function RoomEdit() {
  const { id } = useParams();
  const room = roomsMgmtMock.find(r => r.id === id);
  if (!room) return <div className="p-10 text-slate-500">Room not found.</div>;
  return <RoomForm mode="edit" initial={room} />;
}
