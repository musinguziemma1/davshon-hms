"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  patientName: z.string().min(1, "Required"),
  patientId: z.string().min(1, "Required"),
  doctorName: z.string().min(1, "Required"),
  testName: z.string().min(1, "Required"),
  testCode: z.string().min(1, "Required"),
  priority: z.enum(["routine", "urgent", "stat"]),
  sampleType: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const LAB_TESTS = [
  { name: "Complete Blood Count (CBC)", code: "CBC", sample: "Blood" },
  { name: "Blood Glucose (Fasting)", code: "FBS", sample: "Blood" },
  { name: "Lipid Profile", code: "LIPID", sample: "Blood" },
  { name: "Liver Function Test (LFT)", code: "LFT", sample: "Blood" },
  { name: "Kidney Function Test (KFT)", code: "KFT", sample: "Blood" },
  { name: "Urinalysis", code: "UA", sample: "Urine" },
  { name: "HbA1c", code: "HBA1C", sample: "Blood" },
  { name: "Troponin I", code: "TROP", sample: "Blood" },
  { name: "Thyroid Function (TSH/T3/T4)", code: "TFT", sample: "Blood" },
  { name: "Chest X-Ray", code: "CXR", sample: "N/A" },
];

export function LabTestForm({ onSubmit, onCancel }: { onSubmit: (d: any) => void; onCancel: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "routine" },
  });

  const handleTestSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const test = LAB_TESTS.find((t) => t.name === e.target.value);
    if (test) {
      setValue("testName", test.name);
      setValue("testCode", test.code);
      setValue("sampleType", test.sample);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Patient Name <span className="text-red-500">*</span></label>
          <input {...register("patientName")} className="input-field" placeholder="Full name" />
          {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
        </div>
        <div>
          <label className="label">Patient ID <span className="text-red-500">*</span></label>
          <input {...register("patientId")} className="input-field" placeholder="PAT-0001" />
          {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId.message}</p>}
        </div>
        <div>
          <label className="label">Ordering Doctor <span className="text-red-500">*</span></label>
          <select {...register("doctorName")} className="input-field">
            <option value="">Select doctor...</option>
            {["Dr. James Wilson", "Dr. Sarah Chen", "Dr. Ravi Patel", "Dr. Maria Lopez"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.doctorName && <p className="text-red-500 text-xs mt-1">{errors.doctorName.message}</p>}
        </div>
        <div>
          <label className="label">Priority <span className="text-red-500">*</span></label>
          <select {...register("priority")} className="input-field">
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="stat">STAT (Emergency)</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Select Test <span className="text-red-500">*</span></label>
          <select onChange={handleTestSelect} className="input-field mb-2">
            <option value="">Choose from common tests...</option>
            {LAB_TESTS.map((t) => <option key={t.code} value={t.name}>{t.name} ({t.code})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Test Name</label>
              <input {...register("testName")} className="input-field" placeholder="Or type custom test" />
              {errors.testName && <p className="text-red-500 text-xs mt-1">{errors.testName.message}</p>}
            </div>
            <div>
              <label className="label text-xs">Test Code</label>
              <input {...register("testCode")} className="input-field" placeholder="e.g. CBC" />
              {errors.testCode && <p className="text-red-500 text-xs mt-1">{errors.testCode.message}</p>}
            </div>
          </div>
        </div>
        <div>
          <label className="label">Sample Type <span className="text-red-500">*</span></label>
          <input {...register("sampleType")} className="input-field" placeholder="Blood, Urine, etc." />
          {errors.sampleType && <p className="text-red-500 text-xs mt-1">{errors.sampleType.message}</p>}
        </div>
        <div>
          <label className="label">Notes</label>
          <input {...register("notes")} className="input-field" placeholder="Special instructions..." />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Order Test</button>
      </div>
    </form>
  );
}
