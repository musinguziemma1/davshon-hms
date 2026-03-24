"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Explicit type for the form (all numbers, as entered by user)
type FormData = {
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  sellingPrice: number;
};

const schema = z.object({
  name: z.string().min(1, "Required"),
  genericName: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  dosageForm: z.string().min(1, "Required"),
  strength: z.string().min(1, "Required"),
  manufacturer: z.string().min(1, "Required"),
  batchNumber: z.string().min(1, "Required"),
  expiryDate: z.string().min(1, "Required"),
  stockQuantity: z.number().min(0),
  reorderLevel: z.number().min(1),
  unitPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
});

const CATEGORIES = ["Antibiotic", "Antidiabetic", "Antihypertensive", "Analgesic", "Statin", "Bronchodilator", "Antihistamine", "Antifungal", "Vitamin/Supplement", "Other"];
const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Inhaler", "Cream", "Drops", "Suppository", "Patch"];

export function MedicationForm({ onSubmit, onCancel }: { onSubmit: (d: any) => void; onCancel: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  const F = ({ label, name, type = "text", placeholder = "" }: any) => (
    <div>
      <label className="label">{label}</label>
      <input {...register(name)} type={type} placeholder={placeholder} className="input-field" />
      {errors[name as keyof typeof errors] && <p className="text-red-500 text-xs mt-1">{(errors[name as keyof typeof errors] as any)?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Brand Name <span className="text-red-500">*</span></label>
          <input {...register("name")} className="input-field" placeholder="e.g. Amoxicillin 500mg" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <F label="Generic Name *" name="genericName" placeholder="e.g. Amoxicillin" />
        <div>
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select {...register("category")} className="input-field">
            <option value="">Select...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="label">Dosage Form <span className="text-red-500">*</span></label>
          <select {...register("dosageForm")} className="input-field">
            <option value="">Select...</option>
            {DOSAGE_FORMS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <F label="Strength *" name="strength" placeholder="e.g. 500mg" />
        <F label="Manufacturer *" name="manufacturer" placeholder="Company name" />
        <F label="Batch Number *" name="batchNumber" placeholder="e.g. BT-2024-001" />
        <F label="Expiry Date *" name="expiryDate" type="date" />
        <F label="Initial Stock Qty *" name="stockQuantity" type="number" placeholder="0" />
        <F label="Reorder Level *" name="reorderLevel" type="number" placeholder="50" />
        <F label="Unit Cost ($) *" name="unitPrice" type="number" placeholder="0.00" />
        <F label="Selling Price ($) *" name="sellingPrice" type="number" placeholder="0.00" />
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Add Medication</button>
      </div>
    </form>
  );
}
