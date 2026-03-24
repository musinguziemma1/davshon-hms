import { calculateAge, formatDate } from "@/lib/utils";
import { User, Phone, MapPin, Droplets, AlertTriangle, FileText, Users } from "lucide-react";

interface PatientDetailProps {
  patient: any;
}

export function PatientDetail({ patient }: PatientDetailProps) {
  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{patient.firstName} {patient.lastName}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
            <span className="font-mono font-semibold text-blue-600">{patient.patientId}</span>
            <span>·</span>
            <span>{calculateAge(patient.dateOfBirth)} years</span>
            <span>·</span>
            <span className="capitalize">{patient.gender}</span>
            {patient.bloodGroup && (
              <>
                <span>·</span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-bold">{patient.bloodGroup}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-0">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Contact Information</p>
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={User} label="Email" value={patient.email} />
          <InfoRow icon={MapPin} label="Address" value={patient.address} />
        </div>
        <div className="space-y-0">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Medical Information</p>
          <InfoRow icon={Droplets} label="Blood Group" value={patient.bloodGroup} />
          <InfoRow icon={AlertTriangle} label="Allergies" value={patient.allergies} />
          <InfoRow icon={FileText} label="Medical History" value={patient.medicalHistory} />
        </div>
      </div>

      {(patient.emergencyContact || patient.emergencyPhone) && (
        <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-semibold text-orange-700">Emergency Contact</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{patient.emergencyContact}</p>
          <p className="text-sm text-gray-600">{patient.emergencyPhone}</p>
        </div>
      )}

      <div className="text-xs text-gray-400 text-right">
        DOB: {formatDate(patient.dateOfBirth)}
      </div>
    </div>
  );
}
