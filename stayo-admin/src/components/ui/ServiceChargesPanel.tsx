import { useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle, X, ChevronDown } from "lucide-react";
import type {
  ServiceCharge, ServiceCategory,
} from "../../types/serviceCharge";
import {
  SERVICE_CATEGORIES, CATEGORY_ICON, CATEGORY_DEFAULT_TAX,
  computeCharge, summariseCharges,
} from "../../types/serviceCharge";
import { usersMock } from "../../mock/users";
import ConfirmModal from "./ConfirmModal";
import clsx from "clsx";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inp =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition";

const now = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

function uid() {
  return "sc_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

interface FormState {
  category: ServiceCategory;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
  taxRate: number;
  notes: string;
  addedBy: string;
}

const freshForm = (): FormState => ({
  category: "Food",
  itemName: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  taxable: true,
  taxRate: CATEGORY_DEFAULT_TAX["Food"],
  notes: "",
  addedBy: usersMock[0]?.fullName ?? "Staff",
});

// ─── Summary cards ────────────────────────────────────────────────────────────
function SummaryCards({ charges }: { charges: ServiceCharge[] }) {
  const s = summariseCharges(charges);
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { label: "Total Items", value: String(s.count), color: "text-slate-800" },
        {
          label: "Taxable Services",
          value: `₹${s.taxableSubtotal.toLocaleString()}`,
          color: "text-blue-700",
        },
        {
          label: "Non-Taxable",
          value: `₹${s.nonTaxableSubtotal.toLocaleString()}`,
          color: "text-slate-600",
        },
        {
          label: "Total Tax",
          value: `₹${s.totalTax.toLocaleString()}`,
          color: "text-amber-700",
        },
        {
          label: "Grand Total",
          value: `₹${s.grandTotal.toLocaleString()}`,
          color: "text-emerald-700 font-bold",
        },
      ].map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1"
        >
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            {c.label}
          </p>
          <p className={clsx("text-lg font-semibold", c.color)}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Add/Edit form ────────────────────────────────────────────────────────────
function ChargeForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FormState;
  onSave: (f: FormState) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(initial ?? freshForm());
  const set = (k: keyof FormState, v: unknown) =>
    setF((p) => ({ ...p, [k]: v }));

  const { subtotal, taxAmount, total } = computeCharge(
    f.quantity,
    f.unitPrice,
    f.taxable,
    f.taxRate
  );

  const onCategoryChange = (cat: ServiceCategory) => {
    setF((p) => ({
      ...p,
      category: cat,
      taxRate: CATEGORY_DEFAULT_TAX[cat],
    }));
  };

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
      <p className="text-sm font-semibold text-slate-700">
        {initial ? "Edit Service Charge" : "Add Service Charge"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Category */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Category
          </label>
          <div className="relative">
            <select
              className={`${inp} appearance-none pr-7`}
              value={f.category}
              onChange={(e) => onCategoryChange(e.target.value as ServiceCategory)}
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICON[c]} {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Item name */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Item / Service Name <span className="text-red-400">*</span>
          </label>
          <input
            className={inp}
            value={f.itemName}
            onChange={(e) => set("itemName", e.target.value)}
            placeholder="e.g. Club Sandwich"
          />
        </div>

        {/* Added by */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Added By
          </label>
          <select
            className={`${inp} appearance-none`}
            value={f.addedBy}
            onChange={(e) => set("addedBy", e.target.value)}
          >
            {usersMock.map((u) => (
              <option key={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            className={inp}
            value={f.quantity}
            onChange={(e) => set("quantity", Math.max(1, Number(e.target.value)))}
          />
        </div>

        {/* Unit price */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Unit Price (₹)
          </label>
          <input
            type="number"
            min={0}
            className={inp}
            value={f.unitPrice}
            onChange={(e) => set("unitPrice", Math.max(0, Number(e.target.value)))}
          />
        </div>

        {/* Tax */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Taxable
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set("taxable", v)}
                className={clsx(
                  "flex-1 py-2 text-xs font-medium transition",
                  f.taxable === v
                    ? "bg-blue-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {v ? "Taxable" : "Non-Taxable"}
              </button>
            ))}
          </div>
        </div>

        {/* Tax rate */}
        {f.taxable && (
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              Tax Rate (%)
            </label>
            <select
              className={`${inp} appearance-none`}
              value={f.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
            >
              {[0, 5, 12, 18, 28].map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Description
          </label>
          <input
            className={inp}
            value={f.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief description (optional)"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Notes
          </label>
          <input
            className={inp}
            value={f.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any additional notes…"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="flex items-center gap-6 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm flex-wrap">
        <span className="text-slate-400 text-xs">Preview:</span>
        <span>
          Subtotal{" "}
          <strong className="text-slate-800">₹{subtotal.toLocaleString()}</strong>
        </span>
        {f.taxable && taxAmount > 0 && (
          <span>
            Tax ({f.taxRate}%){" "}
            <strong className="text-amber-700">+₹{taxAmount.toLocaleString()}</strong>
          </span>
        )}
        <span className="ml-auto font-bold text-emerald-700">
          Total ₹{total.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (!f.itemName.trim() || f.unitPrice <= 0) return;
            onSave(f);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition"
        >
          <CheckCircle size={13} />
          {initial ? "Save Changes" : "Add Charge"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition"
        >
          <X size={13} />Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Void modal ────────────────────────────────────────────────────────────────
function VoidModal({
  charge,
  onConfirm,
  onCancel,
}: {
  charge: ServiceCharge;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Void Charge</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {charge.itemName} — ₹{charge.total.toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1.5">
            Void Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 resize-none"
            placeholder="Added in error, guest complaint, management waiver…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason)}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            Void Charge
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
interface Props {
  stayId: string;
  guestName: string;
  initialCharges: ServiceCharge[];
}

export default function ServiceChargesPanel({
  stayId,
  guestName,
  initialCharges,
}: Props) {
  const [charges, setCharges] = useState<ServiceCharge[]>(initialCharges);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceCharge | null>(null);
  const [voidTarget, setVoidTarget] = useState<ServiceCharge | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCharge | null>(null);
  const [showVoided, setShowVoided] = useState(false);

  const active = charges.filter((c) => c.status === "Active");
  const voided = charges.filter((c) => c.status === "Voided");

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleAdd = (f: FormState) => {
    const { subtotal, taxAmount, total } = computeCharge(
      f.quantity,
      f.unitPrice,
      f.taxable,
      f.taxRate
    );
    const newCharge: ServiceCharge = {
      id: uid(),
      stayId,
      category: f.category,
      itemName: f.itemName,
      description: f.description,
      quantity: f.quantity,
      unitPrice: f.unitPrice,
      subtotal,
      taxable: f.taxable,
      taxRate: f.taxRate,
      taxAmount,
      total,
      addedAt: now(),
      addedBy: f.addedBy,
      notes: f.notes,
      status: "Active",
    };
    setCharges((p) => [newCharge, ...p]);
    setShowForm(false);
  };

  const handleEdit = (f: FormState) => {
    if (!editTarget) return;
    const { subtotal, taxAmount, total } = computeCharge(
      f.quantity,
      f.unitPrice,
      f.taxable,
      f.taxRate
    );
    setCharges((p) =>
      p.map((c) =>
        c.id === editTarget.id
          ? {
              ...c,
              category: f.category,
              itemName: f.itemName,
              description: f.description,
              quantity: f.quantity,
              unitPrice: f.unitPrice,
              subtotal,
              taxable: f.taxable,
              taxRate: f.taxRate,
              taxAmount,
              total,
              notes: f.notes,
              addedBy: f.addedBy,
            }
          : c
      )
    );
    setEditTarget(null);
  };

  const handleVoid = (reason: string) => {
    if (!voidTarget) return;
    setCharges((p) =>
      p.map((c) =>
        c.id === voidTarget.id
          ? {
              ...c,
              status: "Voided",
              voidedAt: now(),
              voidedBy: usersMock[0]?.fullName ?? "Staff",
              voidReason: reason,
            }
          : c
      )
    );
    setVoidTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCharges((p) => p.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const catBadge: Record<string, string> = {
    Food: "bg-orange-50 text-orange-700 border-orange-100",
    Beverages: "bg-cyan-50 text-cyan-700 border-cyan-100",
    Laundry: "bg-blue-50 text-blue-700 border-blue-100",
    Housekeeping: "bg-teal-50 text-teal-700 border-teal-100",
    "Early Check-In": "bg-yellow-50 text-yellow-700 border-yellow-100",
    "Late Check-Out": "bg-purple-50 text-purple-700 border-purple-100",
    "Extra Bedding": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "Extra Person Charge": "bg-pink-50 text-pink-700 border-pink-100",
    Parking: "bg-slate-100 text-slate-700 border-slate-200",
    "Mini Bar": "bg-rose-50 text-rose-700 border-rose-100",
    "Local Transport": "bg-lime-50 text-lime-700 border-lime-100",
    "Room Damage": "bg-red-50 text-red-700 border-red-100",
    Miscellaneous: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <SummaryCards charges={charges} />

      {/* Panel */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Services & Charges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {active.length} active charge{active.length !== 1 ? "s" : ""} ·{" "}
              {guestName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditTarget(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition"
          >
            <Plus size={13} />Add Service
          </button>
        </div>

        {/* Add form */}
        {showForm && !editTarget && (
          <div className="border-b border-slate-100 p-5">
            <ChargeForm
              onSave={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Edit form */}
        {editTarget && (
          <div className="border-b border-slate-100 p-5">
            <ChargeForm
              initial={{
                category: editTarget.category,
                itemName: editTarget.itemName,
                description: editTarget.description,
                quantity: editTarget.quantity,
                unitPrice: editTarget.unitPrice,
                taxable: editTarget.taxable,
                taxRate: editTarget.taxRate,
                notes: editTarget.notes,
                addedBy: editTarget.addedBy,
              }}
              onSave={handleEdit}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        )}

        {/* Active charges table */}
        {active.length === 0 && !showForm ? (
          <div className="px-6 py-12 text-center">
            <div className="text-3xl mb-3">🧾</div>
            <p className="text-sm font-medium text-slate-600">
              No charges added yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add food, beverages, laundry, and other services as they occur.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    "Category",
                    "Item",
                    "Qty × Price",
                    "Subtotal",
                    "Tax",
                    "Total",
                    "Added By",
                    "Time",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.map((charge) => (
                  <tr
                    key={charge.id}
                    className="border-b border-slate-100 hover:bg-slate-50/60 transition"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap",
                          catBadge[charge.category] ?? catBadge["Miscellaneous"]
                        )}
                      >
                        {CATEGORY_ICON[charge.category]} {charge.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {charge.itemName}
                      </p>
                      {charge.description && (
                        <p className="text-xs text-slate-400">
                          {charge.description}
                        </p>
                      )}
                      {charge.notes && (
                        <p className="text-xs text-blue-500 mt-0.5">
                          ℹ {charge.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {charge.quantity} × ₹{charge.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      ₹{charge.subtotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {charge.taxable ? (
                        <span className="text-amber-600">
                          ₹{charge.taxAmount.toLocaleString()}{" "}
                          <span className="text-xs text-slate-400">
                            ({charge.taxRate}%)
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">
                      ₹{charge.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {charge.addedBy}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      {charge.addedAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditTarget(charge)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-700 hover:border-blue-200 transition"
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoidTarget(charge)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 transition"
                          title="Void"
                        >
                          <X size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(charge)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Voided section toggle */}
        {voided.length > 0 && (
          <div className="border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowVoided((v) => !v)}
              className="w-full px-6 py-3 flex items-center justify-between text-xs text-slate-400 hover:bg-slate-50 transition"
            >
              <span>
                {voided.length} voided charge{voided.length !== 1 ? "s" : ""}{" "}
                (excluded from bill)
              </span>
              <ChevronDown
                size={13}
                className={clsx(
                  "transition-transform",
                  showVoided && "rotate-180"
                )}
              />
            </button>
            {showVoided && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {voided.map((charge) => (
                  <div
                    key={charge.id}
                    className="px-6 py-3 flex items-start justify-between gap-4 opacity-50"
                  >
                    <div>
                      <p className="text-sm text-slate-600 line-through">
                        {CATEGORY_ICON[charge.category]} {charge.itemName} —
                        ₹{charge.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Voided {charge.voidedAt} by {charge.voidedBy}
                        {charge.voidReason && ` · ${charge.voidReason}`}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 shrink-0">
                      Voided
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer total */}
        {active.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/60">
            <span className="text-sm text-slate-500">
              Running total ({active.length} item
              {active.length !== 1 ? "s" : ""})
            </span>
            <span className="font-bold text-emerald-700 text-base">
              ₹{summariseCharges(charges).grandTotal.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      {voidTarget && (
        <VoidModal
          charge={voidTarget}
          onConfirm={handleVoid}
          onCancel={() => setVoidTarget(null)}
        />
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Charge"
        message={`Permanently delete "${deleteTarget?.itemName}"? This cannot be undone. Use Void instead to keep an audit trail.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
