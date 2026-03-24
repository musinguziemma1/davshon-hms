"use client";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export function StockUpdateForm({ medication, type, onSubmit, onCancel }: { medication: any; type: "restock" | "dispense"; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const isDispense = type === "dispense";
  const newStock = isDispense ? medication.stockQuantity - quantity : medication.stockQuantity + quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDispense && quantity > medication.stockQuantity) { alert("Insufficient stock"); return; }
    onSubmit({ quantity, notes, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`rounded-xl p-4 ${isDispense ? "bg-blue-50" : "bg-green-50"}`}>
        <div className="flex items-center gap-2 mb-2">
          {isDispense ? <ArrowDownCircle className="w-5 h-5 text-blue-600" /> : <ArrowUpCircle className="w-5 h-5 text-green-600" />}
          <span className={`font-semibold text-sm ${isDispense ? "text-blue-800" : "text-green-800"}`}>
            {isDispense ? "Dispensing from" : "Restocking"}: {medication.name}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          Current Stock: <span className="font-bold">{medication.stockQuantity} units</span>
        </div>
      </div>

      <div>
        <label className="label">Quantity <span className="text-red-500">*</span></label>
        <input
          type="number"
          min="1"
          max={isDispense ? medication.stockQuantity : undefined}
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 text-sm">
        <span className="text-gray-500">New stock level:</span>
        <span className={`font-bold text-lg ${newStock <= medication.reorderLevel ? "text-orange-600" : "text-green-600"}`}>
          {Math.max(0, newStock)} units
        </span>
      </div>

      <div>
        <label className="label">Notes</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Reference, patient name, etc." />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className={`text-sm font-medium px-4 py-2 rounded-lg text-white ${isDispense ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}>
          {isDispense ? "Dispense" : "Restock"}
        </button>
      </div>
    </form>
  );
}
