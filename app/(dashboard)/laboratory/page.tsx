"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, PlusCircle, Search, CheckCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

const MOCK_LAB_TESTS = [
  { _id: "l1", testId: "LAB-0001", testName: "Complete Blood Count (CBC)", testCode: "CBC", priority: "routine", sampleType: "Blood", status: "completed", patient: { firstName: "Alice", lastName: "Johnson", patientId: "PAT-0001" }, doctor: { name: "Dr. James Wilson" }, result: { value: "WBC: 7.2, RBC: 4.8, Hgb: 14.2", interpretation: "normal", findings: "All values within normal range." }, createdAt: Date.now() - 86400000 },
  { _id: "l2", testId: "LAB-0002", testName: "Blood Glucose (Fasting)", testCode: "FBS", priority: "urgent", sampleType: "Blood", status: "in_progress", patient: { firstName: "Bob", lastName: "Martinez", patientId: "PAT-0002" }, doctor: { name: "Dr. Sarah Chen" }, result: null, createdAt: Date.now() - 3600000 },
  { _id: "l3", testId: "LAB-0003", testName: "Urinalysis", testCode: "UA", priority: "routine", sampleType: "Urine", status: "ordered", patient: { firstName: "Carol", lastName: "White", patientId: "PAT-0003" }, doctor: { name: "Dr. Ravi Patel" }, result: null, createdAt: Date.now() - 1800000 },
  { _id: "l4", testId: "LAB-0004", testName: "Lipid Panel", testCode: "LIPID", priority: "stat", sampleType: "Blood", status: "ordered", patient: { firstName: "David", lastName: "Brown", patientId: "PAT-0004" }, doctor: { name: "Dr. James Wilson" }, result: null, createdAt: Date.now() - 900000 },
];

const STATUS_TABS = ["all", "ordered", "in_progress", "completed"];
const PRIORITY_COLORS: Record<string, string> = {
  routine: "bg-gray-100 text-gray-700",
  urgent: "bg-orange-100 text-orange-700",
  stat: "bg-red-100 text-red-700",
};
const INTERP_COLORS: Record<string, string> = {
  normal: "text-green-600",
  abnormal: "text-orange-600",
  critical: "text-red-600",
};

export default function LaboratoryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [tests, setTests] = useState(MOCK_LAB_TESTS);
  const [resultForm, setResultForm] = useState({ value: "", findings: "", interpretation: "normal" as "normal" | "abnormal" | "critical", normalRange: "", unit: "" });

  const filtered = tests.filter((t) => {
    const matchSearch = `${t.patient.firstName} ${t.patient.lastName}`.toLowerCase().includes(search.toLowerCase()) || t.testId.toLowerCase().includes(search.toLowerCase()) || t.testName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || t.status === activeTab;
    return matchSearch && matchTab;
  });

  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "all" ? tests.length : tests.filter((t) => t.status === tab).length;
    return acc;
  }, {} as Record<string, number>);

  const updateStatus = (id: string, status: string) => setTests(tests.map((t) => t._id === id ? { ...t, status } : t));
  const addResult = () => {
    setTests(tests.map((t) => t._id === selectedTest._id ? { ...t, status: "completed", result: { ...resultForm } } : t));
    setShowResultModal(false);
    setResultForm({ value: "", findings: "", interpretation: "normal", normalRange: "", unit: "" });
  };

  return (
    <div>
      <PageHeader
        title="Laboratory"
        subtitle="Manage lab test orders and results"
        actions={
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusCircle className="w-4 h-4" /> Order Test
          </button>
        }
      />

      <div className="flex items-center gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.replace("_", " ")} ({counts[tab]})
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests..." className="input-field pl-9 max-w-md" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FlaskConical} title="No lab tests found" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>{["Test ID", "Test Name", "Patient", "Doctor", "Priority", "Sample", "Status", "Result", "Actions"].map((h) => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((test, i) => (
                <motion.tr key={test._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                  <td className="table-cell font-mono text-xs font-semibold text-blue-600">{test.testId}</td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{test.testName}</div>
                    <div className="text-xs text-gray-400">{test.testCode}</div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium">{test.patient.firstName} {test.patient.lastName}</div>
                    <div className="text-xs text-gray-400">{test.patient.patientId}</div>
                  </td>
                  <td className="table-cell text-sm text-gray-600">{test.doctor.name}</td>
                  <td className="table-cell"><span className={`badge capitalize ${PRIORITY_COLORS[test.priority]}`}>{test.priority}</span></td>
                  <td className="table-cell text-sm text-gray-600">{test.sampleType}</td>
                  <td className="table-cell"><Badge label={test.status.replace("_", " ")} variant="status" /></td>
                  <td className="table-cell">
                    {test.result ? (
                      <span className={`text-xs font-semibold capitalize ${INTERP_COLORS[test.result.interpretation]}`}>{test.result.interpretation}</span>
                    ) : (
                      <span className="text-xs text-gray-300">Pending</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      {test.status === "ordered" && (
                        <button onClick={() => updateStatus(test._id, "in_progress")} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Start Processing"><Clock className="w-4 h-4" /></button>
                      )}
                      {test.status === "in_progress" && (
                        <button onClick={() => { setSelectedTest(test); setShowResultModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Enter Result"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {test.status === "completed" && test.result && (
                        <button onClick={() => { setSelectedTest(test); setShowResultModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Result"><FlaskConical className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Order Test Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Order Lab Test" size="md">
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target as HTMLFormElement); const newTest = { _id: `l${Date.now()}`, testId: `LAB-${String(tests.length + 1).padStart(4, "0")}`, testName: fd.get("testName") as string, testCode: (fd.get("testName") as string).substring(0, 4).toUpperCase(), priority: fd.get("priority") as string, sampleType: fd.get("sampleType") as string, status: "ordered", patient: { firstName: fd.get("patientName") as string, lastName: "", patientId: fd.get("patientId") as string }, doctor: { name: fd.get("doctor") as string }, result: null, createdAt: Date.now() }; setTests([newTest, ...tests]); setShowAddModal(false); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["Patient Name", "patientName", "text"], ["Patient ID", "patientId", "text"], ["Test Name", "testName", "text"]].map(([l, n, t]) => (
              <div key={n}><label className="label">{l}</label><input name={n} type={t} className="input-field" required /></div>
            ))}
            <div>
              <label className="label">Doctor</label>
              <select name="doctor" className="input-field" required>
                {["Dr. James Wilson", "Dr. Sarah Chen", "Dr. Ravi Patel"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" className="input-field">
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>
            <div>
              <label className="label">Sample Type</label>
              <select name="sampleType" className="input-field">
                {["Blood", "Urine", "Stool", "Sputum", "Swab", "CSF"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" className="btn-primary text-sm">Order Test</button>
          </div>
        </form>
      </Modal>

      {/* Result Modal */}
      <Modal open={showResultModal} onClose={() => setShowResultModal(false)} title={selectedTest?.status === "completed" ? "Test Result" : "Enter Result"} size="md">
        {selectedTest && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm font-semibold text-blue-800">{selectedTest.testName}</p>
              <p className="text-xs text-blue-600">{selectedTest.patient.firstName} {selectedTest.patient.lastName} · {selectedTest.testId}</p>
            </div>
            {selectedTest.status === "completed" && selectedTest.result ? (
              <div className="space-y-2">
                {[["Value", selectedTest.result.value], ["Normal Range", selectedTest.result.normalRange || "N/A"], ["Unit", selectedTest.result.unit || "N/A"], ["Findings", selectedTest.result.findings], ["Interpretation", selectedTest.result.interpretation]].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{l}</span>
                    <span className={`text-sm font-medium ${l === "Interpretation" ? INTERP_COLORS[v as string] || "" : "text-gray-900"} capitalize`}>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Result Value</label><input value={resultForm.value} onChange={(e) => setResultForm({ ...resultForm, value: e.target.value })} className="input-field" /></div>
                  <div><label className="label">Unit</label><input value={resultForm.unit} onChange={(e) => setResultForm({ ...resultForm, unit: e.target.value })} className="input-field" placeholder="e.g. mg/dL" /></div>
                  <div><label className="label">Normal Range</label><input value={resultForm.normalRange} onChange={(e) => setResultForm({ ...resultForm, normalRange: e.target.value })} className="input-field" /></div>
                  <div><label className="label">Interpretation</label>
                    <select value={resultForm.interpretation} onChange={(e) => setResultForm({ ...resultForm, interpretation: e.target.value as any })} className="input-field">
                      <option value="normal">Normal</option><option value="abnormal">Abnormal</option><option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div><label className="label">Findings</label><textarea value={resultForm.findings} onChange={(e) => setResultForm({ ...resultForm, findings: e.target.value })} rows={3} className="input-field resize-none" /></div>
                <div className="flex justify-end gap-3"><button onClick={() => setShowResultModal(false)} className="btn-secondary text-sm">Cancel</button><button onClick={addResult} className="btn-primary text-sm">Save Result</button></div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
