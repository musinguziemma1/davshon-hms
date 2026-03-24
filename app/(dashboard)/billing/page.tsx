"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Search, Printer, DollarSign, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { BillForm } from "@/components/modules/billing/BillForm";
import { BillDetail } from "@/components/modules/billing/BillDetail";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOCK_BILLS = [
  { _id: "b1", billId: "BILL-0001", patientId: "p1", patient: { firstName: "Alice", lastName: "Johnson", patientId: "PAT-0001" }, subtotal: 450, tax: 45, discount: 0, total: 495, paidAmount: 495, paymentStatus: "paid", paymentMethod: "Cash", items: [{ id: "i1", description: "Consultation Fee", category: "consultation", quantity: 1, unitPrice: 300, total: 300 }, { id: "i2", description: "Blood Test (CBC)", category: "lab", quantity: 1, unitPrice: 150, total: 150 }], notes: "", _creationTime: Date.now() - 86400000 },
  { _id: "b2", billId: "BILL-0002", patientId: "p2", patient: { firstName: "Bob", lastName: "Martinez", patientId: "PAT-0002" }, subtotal: 820, tax: 82, discount: 50, total: 852, paidAmount: 0, paymentStatus: "pending", paymentMethod: "", items: [{ id: "i3", description: "Specialist Consultation", category: "consultation", quantity: 1, unitPrice: 500, total: 500 }, { id: "i4", description: "Amoxicillin 500mg x20", category: "pharmacy", quantity: 1, unitPrice: 320, total: 320 }], notes: "Patient requested installment", _creationTime: Date.now() - 3600000 },
  { _id: "b3", billId: "BILL-0003", patientId: "p3", patient: { firstName: "Carol", lastName: "White", patientId: "PAT-0003" }, subtotal: 1200, tax: 120, discount: 100, total: 1220, paidAmount: 500, paymentStatus: "partial", paymentMethod: "Card", items: [{ id: "i5", description: "Minor Procedure", category: "procedure", quantity: 1, unitPrice: 1200, total: 1200 }], notes: "", _creationTime: Date.now() - 7200000 },
];

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [bills, setBills] = useState(MOCK_BILLS);

  const filtered = bills.filter((b) => {
    const matchSearch =
      `${b.patient.firstName} ${b.patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      b.billId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bills.reduce((s, b) => s + b.paidAmount, 0);
  const pendingAmount = bills.filter((b) => b.paymentStatus !== "paid").reduce((s, b) => s + (b.total - b.paidAmount), 0);

  return (
    <div>
      <PageHeader
        title="Billing & Invoicing"
        subtitle="Manage patient bills and payment tracking"
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusCircle className="w-4 h-4" />
            Create Invoice
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Collected", value: formatCurrency(totalRevenue), color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Amount", value: formatCurrency(pendingAmount), color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Total Invoices", value: bills.length, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bills..." className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No bills found" description="Create an invoice to get started." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Bill ID", "Patient", "Subtotal", "Tax", "Discount", "Total", "Paid", "Status", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((bill, i) => (
                <motion.tr key={bill._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                  <td className="table-cell font-mono text-xs font-semibold text-blue-600">{bill.billId}</td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{bill.patient.firstName} {bill.patient.lastName}</div>
                    <div className="text-xs text-gray-400">{bill.patient.patientId}</div>
                  </td>
                  <td className="table-cell text-gray-700">{formatCurrency(bill.subtotal)}</td>
                  <td className="table-cell text-gray-500 text-xs">{formatCurrency(bill.tax)}</td>
                  <td className="table-cell text-gray-500 text-xs">{bill.discount > 0 ? `-${formatCurrency(bill.discount)}` : "—"}</td>
                  <td className="table-cell font-semibold text-gray-900">{formatCurrency(bill.total)}</td>
                  <td className="table-cell">
                    <div className="font-medium text-green-700">{formatCurrency(bill.paidAmount)}</div>
                    {bill.paymentStatus === "partial" && <div className="text-xs text-orange-500">Balance: {formatCurrency(bill.total - bill.paidAmount)}</div>}
                  </td>
                  <td className="table-cell"><Badge label={bill.paymentStatus} variant="status" /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedBill(bill); setShowDetailModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View & Print"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Create Invoice" size="xl">
        <BillForm onSubmit={(data) => { setBills([{ ...data, _id: `b${Date.now()}`, billId: `BILL-${String(bills.length + 1).padStart(4, "0")}`, _creationTime: Date.now() }, ...bills]); setShowAddModal(false); }} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Invoice Details" size="lg">
        {selectedBill && <BillDetail bill={selectedBill} />}
      </Modal>
    </div>
  );
}
