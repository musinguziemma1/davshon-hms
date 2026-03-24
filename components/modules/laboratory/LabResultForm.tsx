"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  value: z.string().optional(),
  findings: z.string().min(1, "Findings are required"),
  normalRange: z.string().optional(),
  unit: z.string().optional(),
  interpretation: z.enum(["normal", "abnormal", "critical"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LabResultForm({ test, onSubmit, onCancel }: { test: any; onSubmit: (d: any) => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { interpretation: "normal" },
  });

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4 text-sm">
        <p className="font-semibold text-blue-800">{test.testName} ({test.testCode})</p>
        <p className="text-blue-600 text-xs mt-0.5">Patient: {test.patient.firstName} {test.patient.lastName} · {test.patient.patientId}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Result Value</label>
            <input {...register("value")} className="input-field" placeholder="e.g. 7.5 x10³/µL" />
          </div>
          <div>
            <label className="label">Unit</label>
            <input {...register("unit")} className="input-field" placeholder="e.g. mg/dL" />
          </div>
          <div>
            <label className="label">Normal Range</label>
            <input {...register("normalRange")} className="input-field" placeholder="e.g. 70-100 mg/dL" />
          </div>
          <div>
            <label className="label">Interpretation <span className="text-red-500">*</span></label>
            <select {...register("interpretation")} className="input-field">
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Findings / Report <span className="text-red-500">*</span></label>
            <textarea {...register("findings")} rows={4} className="input-field resize-none" placeholder="Detailed findings and observations..." />
            {errors.findings && <p className="text-red-500 text-xs mt-1">{errors.findings.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="label">Additional Notes</label>
            <textarea {...register("notes")} rows={2} className="input-field resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button type="submit" className="btn-primary text-sm">Submit Result</button>
        </div>
      </form>
    </div>
  );
}
