"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  patientName: z.string().min(1, "Required"),
  patientId: z.string().min(1, "Required"),
  doctorName: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  time: z.string().min(1, "Required"),
  type: z.string().min(1, "Required"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const DOCTORS = ["Dr. James Wilson", "Dr. Sarah Chen", "Dr. Ravi Patel", "Dr. Maria Lopez"];
const TYPES = ["OPD", "Follow-up", "Consultation", "Emergency", "Routine Checkup"];

export function AppointmentForm({ onSubmit, onCancel }: { onSubmit: (d: any) => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Patient Name <span className="text-red-500">*</span></label>
          <input {...register("patientName")} placeholder="Full name" className="input-field" />
          {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
        </div>
        <div>
          <label className="label">Patient ID <span className="text-red-500">*</span></label>
          <input {...register("patientId")} placeholder="PAT-0001" className="input-field" />
          {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId.message}</p>}
        </div>
        <div>
          <label className="label">Doctor <span className="text-red-500">*</span></label>
          <select {...register("doctorName")} className="input-field">
            <option value="">Select doctor...</option>
            {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.doctorName && <p className="text-red-500 text-xs mt-1">{errors.doctorName.message}</p>}
        </div>
        <div>
          <label className="label">Appointment Type <span className="text-red-500">*</span></label>
          <select {...register("type")} className="input-field">
            <option value="">Select type...</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>
        <div>
          <label className="label">Date <span className="text-red-500">*</span></label>
          <input {...register("date")} type="date" className="input-field" />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="label">Time <span className="text-red-500">*</span></label>
          <input {...register("time")} type="time" className="input-field" />
          {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="label">Reason for Visit</label>
          <input {...register("reason")} placeholder="Brief description..." className="input-field" />
        </div>
        <div className="col-span-2">
          <label className="label">Additional Notes</label>
          <textarea {...register("notes")} rows={2} className="input-field resize-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Book Appointment</button>
      </div>
    </form>
  );
}
