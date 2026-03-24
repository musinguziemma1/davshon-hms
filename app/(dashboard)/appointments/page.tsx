"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppointmentForm } from "@/components/modules/appointments/AppointmentForm";
import { formatDate } from "@/lib/utils";

const MOCK_APPOINTMENTS = [
  { _id: "a1", appointmentId: "APT-0001", patientId: "p1", doctorId: "d1", date: "2025-03-24", time: "09:00", type: "OPD", status: "confirmed", reason: "Chest pain follow-up", patient: { firstName: "Alice", lastName: "Johnson", patientId: "PAT-0001" }, doctor: { name: "Dr. James Wilson" } },
  { _id: "a2", appointmentId: "APT-0002", patientId: "p2", doctorId: "d2", date: "2025-03-24", time: "09:30", type: "Follow-up", status: "completed", reason: "Diabetes management", patient: { firstName: "Bob", lastName: "Martinez", patientId: "PAT-0002" }, doctor: { name: "Dr. Sarah Chen" } },
  { _id: "a3", appointmentId: "APT-0003", patientId: "p3", doctorId: "d1", date: "2025-03-24", time: "10:00", type: "OPD", status: "pending", reason: "Annual checkup", patient: { firstName: "Carol", lastName: "White", patientId: "PAT-0003" }, doctor: { name: "Dr. James Wilson" } },
  { _id: "a4", appointmentId: "APT-0004", patientId: "p4", doctorId: "d3", date: "2025-03-25", time: "11:00", type: "OPD", status: "pending", reason: "Knee pain", patient: { firstName: "David", lastName: "Brown", patientId: "PAT-0004" }, doctor: { name: "Dr. Ravi Patel" } },
  { _id: "a5", appointmentId: "APT-0005", patientId: "p5", doctorId: "d2", date: "2025-03-23", time: "14:00", type: "Consultation", status: "cancelled", reason: "Skin rash", patient: { firstName: "Eva", lastName: "Davis", patientId: "PAT-0005" }, doctor: { name: "Dr. Sarah Chen" } },
];

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      `${a.patient.firstName} ${a.patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      a.appointmentId.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || a.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleAdd = (data: any) => {
    const newApt = {
      ...data,
      _id: `a${Date.now()}`,
      appointmentId: `APT-${String(appointments.length + 1).padStart(4, "0")}`,
      status: "pending",
      patient: { firstName: data.patientName?.split(" ")[0] || "Patient", lastName: data.patientName?.split(" ")[1] || "", patientId: data.patientId },
      doctor: { name: data.doctorName || "Doctor" },
    };
    setAppointments([newApt, ...appointments]);
    setShowAddModal(false);
  };

  const updateStatus = (id: string, status: string) => {
    setAppointments(appointments.map((a) => (a._id === id ? { ...a, status } : a)));
  };

  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "all" ? appointments.length : appointments.filter((a) => a.status === tab).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Appointments (OPD)"
        subtitle="Manage patient appointments and doctor schedules"
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <CalendarPlus className="w-4 h-4" />
            Book Appointment
          </button>
        }
      />

      {/* Status Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab} <span className="ml-1 text-gray-400">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments..." className="input-field pl-9 max-w-md" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Clock} title="No appointments found" description="Try adjusting your filters or book a new appointment." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Appt ID", "Patient", "Doctor", "Date & Time", "Type", "Reason", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((apt, i) => (
                <motion.tr key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                  <td className="table-cell font-mono text-xs font-semibold text-blue-600">{apt.appointmentId}</td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{apt.patient.firstName} {apt.patient.lastName}</div>
                    <div className="text-xs text-gray-400">{apt.patient.patientId}</div>
                  </td>
                  <td className="table-cell text-sm text-gray-700">{apt.doctor.name}</td>
                  <td className="table-cell">
                    <div className="font-medium">{formatDate(apt.date)}</div>
                    <div className="text-xs text-gray-400">{apt.time}</div>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{apt.type}</span>
                  </td>
                  <td className="table-cell text-xs text-gray-500 max-w-[150px] truncate">{apt.reason || "—"}</td>
                  <td className="table-cell"><Badge label={apt.status} variant="status" /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedApt(apt); setShowDetailModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      {apt.status === "pending" && (
                        <button onClick={() => updateStatus(apt._id, "confirmed")} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Confirm"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {apt.status === "confirmed" && (
                        <button onClick={() => updateStatus(apt._id, "completed")} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {["pending", "confirmed"].includes(apt.status) && (
                        <button onClick={() => updateStatus(apt._id, "cancelled")} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Cancel"><XCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Book New Appointment" size="md">
        <AppointmentForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Appointment Details" size="md">
        {selectedApt && (
          <div className="space-y-3">
            {[
              ["Appointment ID", selectedApt.appointmentId],
              ["Patient", `${selectedApt.patient.firstName} ${selectedApt.patient.lastName} (${selectedApt.patient.patientId})`],
              ["Doctor", selectedApt.doctor.name],
              ["Date", formatDate(selectedApt.date)],
              ["Time", selectedApt.time],
              ["Type", selectedApt.type],
              ["Reason", selectedApt.reason || "Not specified"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Status</span>
              <Badge label={selectedApt.status} variant="status" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
