"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Eye, Edit2, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PatientForm } from "@/components/modules/patients/PatientForm";
import { PatientDetail } from "@/components/modules/patients/PatientDetail";
import { calculateAge, formatDate } from "@/lib/utils";

// Mock patients for demo
const MOCK_PATIENTS = [
  { _id: "p1", patientId: "PAT-0001", firstName: "Alice", lastName: "Johnson", dateOfBirth: "1985-03-15", gender: "female", phone: "555-0101", email: "alice@email.com", address: "123 Main St, New York", bloodGroup: "A+", allergies: "Penicillin", medicalHistory: "Hypertension", emergencyContact: "Bob Johnson", emergencyPhone: "555-0102" },
  { _id: "p2", patientId: "PAT-0002", firstName: "Bob", lastName: "Martinez", dateOfBirth: "1978-07-22", gender: "male", phone: "555-0103", email: "bob@email.com", address: "456 Oak Ave, Boston", bloodGroup: "O+", allergies: "", medicalHistory: "Diabetes Type 2", emergencyContact: "Maria Martinez", emergencyPhone: "555-0104" },
  { _id: "p3", patientId: "PAT-0003", firstName: "Carol", lastName: "White", dateOfBirth: "1992-11-08", gender: "female", phone: "555-0105", address: "789 Pine Rd, Chicago", bloodGroup: "B-", allergies: "Sulfa drugs", medicalHistory: "", emergencyContact: "Tom White", emergencyPhone: "555-0106" },
  { _id: "p4", patientId: "PAT-0004", firstName: "David", lastName: "Brown", dateOfBirth: "1965-05-30", gender: "male", phone: "555-0107", address: "321 Elm St, Houston", bloodGroup: "AB+", allergies: "", medicalHistory: "Asthma", emergencyContact: "Nancy Brown", emergencyPhone: "555-0108" },
  { _id: "p5", patientId: "PAT-0005", firstName: "Eva", lastName: "Davis", dateOfBirth: "2000-09-14", gender: "female", phone: "555-0109", address: "654 Maple Dr, Phoenix", bloodGroup: "A-", allergies: "NSAIDs", medicalHistory: "", emergencyContact: "Frank Davis", emergencyPhone: "555-0110" },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  const filtered = patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleAdd = (data: any) => {
    const newPatient = {
      ...data,
      _id: `p${Date.now()}`,
      patientId: `PAT-${String(patients.length + 1).padStart(4, "0")}`,
    };
    setPatients([newPatient, ...patients]);
    setShowAddModal(false);
  };

  const handleEdit = (data: any) => {
    setPatients(patients.map((p) => (p._id === selectedPatient._id ? { ...p, ...data } : p)));
    setShowEditModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this patient record?")) {
      setPatients(patients.filter((p) => p._id !== id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Patient Management"
        subtitle={`${patients.length} patients registered`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <UserPlus className="w-4 h-4" />
            Register Patient
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, Patient ID, or phone..."
          className="input-field pl-9 max-w-md"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={search ? "Try a different search term." : "Register your first patient to get started."}
          action={
            !search && (
              <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm">
                Register Patient
              </button>
            )
          }
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Patient ID", "Name", "Age / Gender", "Blood Group", "Phone", "Allergies", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((patient, i) => (
                <motion.tr
                  key={patient._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="table-cell font-mono text-xs font-semibold text-blue-600">{patient.patientId}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                        <div className="text-xs text-gray-400">{patient.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium">{calculateAge(patient.dateOfBirth)} yrs</div>
                    <div className="text-xs capitalize text-gray-400">{patient.gender}</div>
                  </td>
                  <td className="table-cell">
                    {patient.bloodGroup ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-bold">{patient.bloodGroup}</span>
                    ) : (
                      <span className="text-gray-300 text-xs">Unknown</span>
                    )}
                  </td>
                  <td className="table-cell text-gray-600">{patient.phone}</td>
                  <td className="table-cell">
                    {patient.allergies ? (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{patient.allergies}</span>
                    ) : (
                      <span className="text-xs text-gray-300">None</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedPatient(patient); setShowDetailModal(true); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedPatient(patient); setShowEditModal(true); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Patient" size="lg">
        <PatientForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Patient" size="lg">
        <PatientForm defaultValues={selectedPatient} onSubmit={handleEdit} onCancel={() => setShowEditModal(false)} />
      </Modal>

      {/* Detail Modal */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Patient Profile" size="lg">
        {selectedPatient && <PatientDetail patient={selectedPatient} />}
      </Modal>
    </div>
  );
}
