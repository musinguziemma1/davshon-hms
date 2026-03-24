"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, PlusCircle, Search, AlertTriangle, Package, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MedicationForm } from "@/components/modules/pharmacy/MedicationForm";
import { StockUpdateForm } from "@/components/modules/pharmacy/StockUpdateForm";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOCK_MEDICATIONS = [
  { _id: "m1", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotic", dosageForm: "Capsule", strength: "500mg", manufacturer: "PharmaCo Ltd", batchNumber: "BT-2024-001", expiryDate: "2026-06-30", stockQuantity: 450, reorderLevel: 100, unitPrice: 0.80, sellingPrice: 1.20, isActive: true },
  { _id: "m2", name: "Metformin 500mg", genericName: "Metformin HCl", category: "Antidiabetic", dosageForm: "Tablet", strength: "500mg", manufacturer: "MedGen Inc", batchNumber: "BT-2024-002", expiryDate: "2025-12-31", stockQuantity: 80, reorderLevel: 100, unitPrice: 0.30, sellingPrice: 0.60, isActive: true },
  { _id: "m3", name: "Lisinopril 10mg", genericName: "Lisinopril", category: "Antihypertensive", dosageForm: "Tablet", strength: "10mg", manufacturer: "CardioPharm", batchNumber: "BT-2024-003", expiryDate: "2026-03-31", stockQuantity: 320, reorderLevel: 50, unitPrice: 0.50, sellingPrice: 0.90, isActive: true },
  { _id: "m4", name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Analgesic", dosageForm: "Tablet", strength: "500mg", manufacturer: "GenMed Corp", batchNumber: "BT-2024-004", expiryDate: "2026-09-30", stockQuantity: 1200, reorderLevel: 200, unitPrice: 0.10, sellingPrice: 0.25, isActive: true },
  { _id: "m5", name: "Atorvastatin 20mg", genericName: "Atorvastatin Calcium", category: "Statin", dosageForm: "Tablet", strength: "20mg", manufacturer: "LipoPharm", batchNumber: "BT-2024-005", expiryDate: "2025-08-31", stockQuantity: 25, reorderLevel: 50, unitPrice: 1.20, sellingPrice: 2.00, isActive: true },
  { _id: "m6", name: "Salbutamol Inhaler", genericName: "Albuterol", category: "Bronchodilator", dosageForm: "Inhaler", strength: "100mcg/dose", manufacturer: "RespiCare Ltd", batchNumber: "BT-2024-006", expiryDate: "2025-11-30", stockQuantity: 60, reorderLevel: 20, unitPrice: 8.00, sellingPrice: 14.00, isActive: true },
];

const CATEGORIES = ["All", "Antibiotic", "Antidiabetic", "Antihypertensive", "Analgesic", "Statin", "Bronchodilator", "Other"];

export default function PharmacyPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [stockType, setStockType] = useState<"restock" | "dispense">("restock");
  const [medications, setMedications] = useState(MOCK_MEDICATIONS);

  const filtered = medications.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const lowStockMeds = medications.filter((m) => m.stockQuantity <= m.reorderLevel);
  const totalValue = medications.reduce((s, m) => s + m.stockQuantity * m.unitPrice, 0);

  const handleAddMedication = (data: any) => {
    setMedications([{ ...data, _id: `m${Date.now()}`, isActive: true }, ...medications]);
    setShowAddModal(false);
  };

  const handleStockUpdate = (data: any) => {
    setMedications(medications.map((m) => {
      if (m._id !== selectedMed._id) return m;
      const qty = stockType === "restock" ? m.stockQuantity + data.quantity : m.stockQuantity - data.quantity;
      return { ...m, stockQuantity: Math.max(0, qty) };
    }));
    setShowStockModal(false);
  };

  const openStockModal = (med: any, type: "restock" | "dispense") => {
    setSelectedMed(med);
    setStockType(type);
    setShowStockModal(true);
  };

  const stockStatusColor = (med: any) => {
    if (med.stockQuantity === 0) return "text-red-600 bg-red-50";
    if (med.stockQuantity <= med.reorderLevel) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div>
      <PageHeader
        title="Pharmacy"
        subtitle="Manage drug inventory and dispensing"
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusCircle className="w-4 h-4" /> Add Medication
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Drugs", value: medications.length, color: "bg-blue-50 text-blue-700" },
          { label: "Low Stock Alerts", value: lowStockMeds.length, color: "bg-orange-50 text-orange-700" },
          { label: "Out of Stock", value: medications.filter((m) => m.stockQuantity === 0).length, color: "bg-red-50 text-red-700" },
          { label: "Inventory Value", value: formatCurrency(totalValue), color: "bg-green-50 text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-3`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockMeds.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-700">
            <span className="font-semibold">{lowStockMeds.length} medication{lowStockMeds.length > 1 ? "s" : ""}</span> at or below reorder level:{" "}
            {lowStockMeds.map((m) => m.name).join(", ")}
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medications..." className="input-field pl-9 w-64" />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${categoryFilter === cat ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Pill} title="No medications found" description="Add medications to your inventory." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Medication", "Category", "Form / Strength", "Batch / Expiry", "Stock", "Selling Price", "Actions"].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((med, i) => (
                <motion.tr key={med._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{med.name}</div>
                    <div className="text-xs text-gray-400">{med.genericName}</div>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{med.category}</span>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm">{med.dosageForm}</div>
                    <div className="text-xs text-gray-400">{med.strength}</div>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs font-mono text-gray-600">{med.batchNumber}</div>
                    <div className={`text-xs mt-0.5 ${new Date(med.expiryDate) < new Date(Date.now() + 90 * 86400000) ? "text-orange-600 font-medium" : "text-gray-400"}`}>
                      Exp: {formatDate(med.expiryDate)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${stockStatusColor(med)}`}>
                      <Package className="w-3 h-3" />
                      {med.stockQuantity} units
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Reorder: {med.reorderLevel}</div>
                  </td>
                  <td className="table-cell font-semibold text-gray-900">{formatCurrency(med.sellingPrice)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openStockModal(med, "restock")} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Restock">
                        <ArrowUpCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => openStockModal(med, "dispense")} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Dispense" disabled={med.stockQuantity === 0}>
                        <ArrowDownCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Medication" size="lg">
        <MedicationForm onSubmit={handleAddMedication} onCancel={() => setShowAddModal(false)} />
      </Modal>
      <Modal open={showStockModal} onClose={() => setShowStockModal(false)} title={stockType === "restock" ? "Restock Medication" : "Dispense Medication"} size="sm">
        {selectedMed && <StockUpdateForm medication={selectedMed} type={stockType} onSubmit={handleStockUpdate} onCancel={() => setShowStockModal(false)} />}
      </Modal>
    </div>
  );
}
