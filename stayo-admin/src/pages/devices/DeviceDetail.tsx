import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { devicesMock } from "../../mock/devices";
import { useToast } from "../../context/ToastContext";
import { Smartphone, RefreshCw, Shield, AlertTriangle } from "lucide-react";

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const device = devicesMock.find(d => d.id === id);
  if (!device) return <div className="p-10 text-slate-500">Device not found.</div>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={device.deviceName}
          subtitle={`${device.deviceCode} · ${device.deviceType} · ${device.platform}`}
          primaryActionLabel="Force Update"
          onPrimaryAction={() => toast(`Update pushed to ${device.deviceName}`)}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <StatusChip status={device.status} />, label: "Status" },
            { icon: <span className="text-sm font-bold font-mono text-slate-700">v{device.appVersion}</span>, label: "App Version" },
            { icon: <span className="text-sm text-slate-700">{device.lastSeen}</span>, label: "Last Seen" },
            { icon: <span className="text-sm text-slate-700">{device.enrollmentDate}</span>, label: "Enrolled" },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.icon}</div>
            </div>
          ))}
        </div>

        <DetailSection title="Device Identity">
          <DetailGrid>
            <DetailField label="Device Name" value={device.deviceName} />
            <DetailField label="Device Code" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{device.deviceCode}</code>} />
            <DetailField label="Device Type" value={device.deviceType} />
            <DetailField label="Platform" value={device.platform} />
            <DetailField label="OS Version" value={device.osVersion} />
            <DetailField label="App Version" value={`v${device.appVersion}`} />
            <DetailField label="Serial Number" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{device.serialNumber}</code>} />
            <DetailField label="Push Token" value={device.pushToken
              ? <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono truncate block max-w-xs">{device.pushToken}</code>
              : <span className="text-slate-400 italic">Not configured</span>} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Assignment">
          <DetailGrid>
            <DetailField label="Assigned Property" value={device.propertyName || "Global"} />
            <DetailField label="Assigned User" value={device.assignedUserName} />
            <DetailField label="Enrollment Date" value={device.enrollmentDate} />
          </DetailGrid>
        </DetailSection>

        {device.remarks && (
          <DetailSection title="Remarks">
            <p className="text-sm text-slate-600 leading-relaxed">{device.remarks}</p>
          </DetailSection>
        )}

        <DetailSection title="Actions">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => toast(`Update pushed to ${device.deviceName}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              <RefreshCw size={14} />Force App Update
            </button>
            <button onClick={() => toast("Device re-enrolled")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-blue-100 bg-blue-50 text-sm text-blue-700 hover:bg-blue-100 transition">
              <Shield size={14} />Re-enroll Device
            </button>
            <button onClick={() => toast(`${device.deviceName} revoked`, "error")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-red-100 bg-red-50 text-sm text-red-600 hover:bg-red-100 transition">
              <AlertTriangle size={14} />Revoke Device
            </button>
          </div>
        </DetailSection>
      </div>
    </MainLayout>
  );
}
