"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Edit2, ToggleLeft, ToggleRight, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { roleLabels, getInitials } from "@/lib/utils";
import type { UserRole } from "@/types";

const MOCK_USERS = [
  { _id: "u1", name: "Dr. Admin User", email: "admin@davshon.com", role: "admin" as UserRole, phone: "555-0001", department: "Administration", specialization: "", isActive: true },
  { _id: "u2", name: "Dr. James Wilson", email: "doctor@davshon.com", role: "doctor" as UserRole, phone: "555-0002", department: "Internal Medicine", specialization: "Cardiology", isActive: true },
  { _id: "u3", name: "Nurse Sarah Johnson", email: "nurse@davshon.com", role: "nurse" as UserRole, phone: "555-0003", department: "Ward A", specialization: "", isActive: true },
  { _id: "u4", name: "Mary Receptionist", email: "receptionist@davshon.com", role: "receptionist" as UserRole, phone: "555-0004", department: "OPD", specialization: "", isActive: true },
  { _id: "u5", name: "Lab Tech Tom", email: "lab@davshon.com", role: "lab_technician" as UserRole, phone: "555-0005", department: "Laboratory", specialization: "Hematology", isActive: true },
  { _id: "u6", name: "Pharmacist Alice", email: "pharmacist@davshon.com", role: "pharmacist" as UserRole, phone: "555-0006", department: "Pharmacy", specialization: "", isActive: false },
];

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleActive = (id: string) => setUsers(users.map((u) => u._id === id ? { ...u, isActive: !u.isActive } : u));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    setUsers([{ _id: `u${Date.now()}`, name: fd.get("name") as string, email: fd.get("email") as string, role: fd.get("role") as UserRole, phone: fd.get("phone") as string, department: fd.get("department") as string, specialization: fd.get("specialization") as string, isActive: true }, ...users]);
    setShowAddModal(false);
  };

  const roleCounts = MOCK_USERS.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Administration"
        subtitle="Manage hospital staff and system users"
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        }
      />

      {/* Role Summary */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Object.entries(roleLabels).map(([role, label]) => (
          <div key={role} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{roleCounts[role] || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="input-field pl-9" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto">
          <option value="all">All Roles</option>
          {Object.entries(roleLabels).map(([r, l]) => <option key={r} value={r}>{l}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Shield} title="No staff found" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>{["Staff Member", "Role", "Department", "Specialization", "Phone", "Status", "Actions"].map((h) => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><Badge label={user.role} variant="role" /></td>
                  <td className="table-cell text-sm text-gray-600">{user.department || "—"}</td>
                  <td className="table-cell text-sm text-gray-500">{user.specialization || "—"}</td>
                  <td className="table-cell text-sm text-gray-600">{user.phone || "—"}</td>
                  <td className="table-cell">
                    <span className={`badge ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => toggleActive(user._id)} className={`p-1.5 rounded-lg transition-colors ${user.isActive ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-green-500 hover:bg-green-50"}`} title={user.isActive ? "Deactivate" : "Activate"}>
                      {user.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Staff Member" size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"], ["department", "Department", "text"], ["specialization", "Specialization", "text"]].map(([n, l, t]) => (
              <div key={n}><label className="label">{l}</label><input name={n} type={t} className="input-field" required={n !== "specialization"} /></div>
            ))}
            <div>
              <label className="label">Role</label>
              <select name="role" className="input-field" required>
                {Object.entries(roleLabels).map(([r, l]) => <option key={r} value={r}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" className="btn-primary text-sm">Add Staff Member</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
