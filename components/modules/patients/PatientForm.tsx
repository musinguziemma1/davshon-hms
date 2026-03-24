"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const patientSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(7, "Invalid phone"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Required"),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  defaultValues?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

export function PatientForm({ defaultValues, onSubmit, onCancel }: PatientFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });

  const Field = ({ label, name, type = "text", required = false }: any) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input {...register(name)} type={type} className="input-field" />
      {errors[name as keyof typeof errors] && (
        <p className="text-red-500 text-xs mt-1">{(errors[name as keyof typeof errors] as any)?.message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" name="firstName" required />
        <Field label="Last Name" name="lastName" required />
        <Field label="Date of Birth" name="dateOfBirth" type="date" required />
        <div>
          <label className="label">Gender <span className="text-red-500">*</span></label>
          <select {...register("gender")} className="input-field">
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>
        <Field label="Phone Number" name="phone" required />
        <Field label="Email Address" name="email" type="email" />
        <div>
          <label className="label">Blood Group</label>
          <select {...register("bloodGroup")} className="input-field">
            <option value="">Unknown</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <Field label="Emergency Contact Name" name="emergencyContact" />
        <Field label="Emergency Phone" name="emergencyPhone" />
        <div className="col-span-2">
          <label className="label">Address <span className="text-red-500">*</span></label>
          <input {...register("address")} className="input-field" />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>
        <div>
          <label className="label">Known Allergies</label>
          <input {...register("allergies")} placeholder="e.g. Penicillin, Sulfa" className="input-field" />
        </div>
        <div>
          <label className="label">Medical History</label>
          <input {...register("medicalHistory")} placeholder="e.g. Diabetes, Hypertension" className="input-field" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary text-sm disabled:opacity-60">
          {defaultValues ? "Save Changes" : "Register Patient"}
        </button>
      </div>
    </form>
  );
}
