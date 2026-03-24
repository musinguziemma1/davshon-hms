"use client";
import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BillItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const CATEGORIES = ["consultation", "lab", "pharmacy", "procedure", "other"];

export function BillForm({ onSubmit, onCancel }: { onSubmit: (d: any) => void; onCancel: () => void }) {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<BillItem[]>([
    { id: "1", description: "", category: "consultation", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const addItem = () => setItems([...items, { id: Date.now().toString(), description: "", category: "consultation", quantity: 1, unitPrice: 0, total: 0 }]);
  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      updated.total = updated.quantity * updated.unitPrice;
      return updated;
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + tax - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [firstName, ...rest] = patientName.split(" ");
    onSubmit({
      patient: { firstName: firstName || "Patient", lastName: rest.join(" ") || "", patientId },
      patientId, items, subtotal, tax, discount, total,
      paidAmount, paymentMethod,
      paymentStatus: paidAmount >= total ? "paid" : paidAmount > 0 ? "partial" : "pending",
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Patient Name</label>
          <input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="input-field" placeholder="Full name" required />
        </div>
        <div>
          <label className="label">Patient ID</label>
          <input value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input-field" placeholder="PAT-0001" required />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Bill Items</label>
          <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <PlusCircle className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Description", "Category", "Qty", "Unit Price", "Total", ""].map((h) => (
                  <th key={h} className="table-header text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2"><input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="input-field text-xs py-1.5" placeholder="Item description" required /></td>
                  <td className="px-3 py-2"><select value={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)} className="input-field text-xs py-1.5">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></td>
                  <td className="px-3 py-2 w-16"><input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", +e.target.value)} className="input-field text-xs py-1.5 text-center" /></td>
                  <td className="px-3 py-2 w-28"><input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", +e.target.value)} className="input-field text-xs py-1.5" /></td>
                  <td className="px-3 py-2 w-24 font-medium text-sm text-gray-800">{formatCurrency(item.total)}</td>
                  <td className="px-3 py-2"><button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        {[["Subtotal", formatCurrency(subtotal)], ["Tax (10%)", formatCurrency(tax)]].map(([l, v]) => (
          <div key={l} className="flex justify-between text-sm"><span className="text-gray-500">{l}</span><span>{v}</span></div>
        ))}
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">Discount</span>
          <input type="number" min="0" value={discount} onChange={(e) => setDiscount(+e.target.value)} className="w-24 input-field text-xs py-1 text-right" />
        </div>
        <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
          <span>Total</span><span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
            {["Cash", "Card", "Insurance", "Bank Transfer", "Other"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Amount Paid</label>
          <input type="number" min="0" value={paidAmount} onChange={(e) => setPaidAmount(+e.target.value)} className="input-field" placeholder="0.00" />
        </div>
        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Create Invoice</button>
      </div>
    </form>
  );
}
