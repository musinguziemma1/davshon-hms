"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, FlaskConical, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const revenueData = [
  { month: "Oct", revenue: 42000, expenses: 28000 },
  { month: "Nov", revenue: 48000, expenses: 30000 },
  { month: "Dec", revenue: 52000, expenses: 32000 },
  { month: "Jan", revenue: 45000, expenses: 29000 },
  { month: "Feb", revenue: 58000, expenses: 35000 },
  { month: "Mar", revenue: 63000, expenses: 38000 },
];

const patientData = [
  { month: "Oct", new: 120, returning: 340 },
  { month: "Nov", new: 145, returning: 380 },
  { month: "Dec", new: 160, returning: 420 },
  { month: "Jan", new: 130, returning: 360 },
  { month: "Feb", new: 175, returning: 450 },
  { month: "Mar", new: 195, returning: 490 },
];

const labTestData = [
  { name: "CBC", count: 245, color: "#3b82f6" },
  { name: "Blood Glucose", count: 189, color: "#10b981" },
  { name: "Urinalysis", count: 156, color: "#f59e0b" },
  { name: "Lipid Panel", count: 98, color: "#8b5cf6" },
  { name: "Thyroid", count: 76, color: "#ef4444" },
];

const drugUsageData = [
  { name: "Antibiotics", units: 1200 },
  { name: "Antidiabetics", units: 980 },
  { name: "Antihypertensives", units: 870 },
  { name: "Analgesics", units: 1500 },
  { name: "Bronchodilators", units: 340 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("6months");

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueData.reduce((s, d) => s + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalPatients = patientData.reduce((s, d) => s + d.new + d.returning, 0);

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Hospital performance overview"
        actions={
          <div className="flex gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-field w-auto text-sm">
              <option value="7days">Last 7 Days</option>
              <option value="1month">Last Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", change: "+12.5%" },
          { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: BarChart3, color: "text-red-600", bg: "bg-red-50", change: "+8.2%" },
          { label: "Net Profit", value: formatCurrency(netProfit), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", change: "+18.4%" },
          { label: "Total Patients", value: totalPatients.toLocaleString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50", change: "+9.7%" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{kpi.change} vs prev period</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Expenses Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">Revenue vs Expenses</h3>
        <p className="text-xs text-gray-500 mb-4">Monthly financial performance</p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #f0f0f0" }} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRev)" name="Revenue" />
            <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#colorExp)" name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Patient Visits */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 className="font-semibold text-gray-900 mb-1">Patient Visits</h3>
          <p className="text-xs text-gray-500 mb-4">New vs Returning patients</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patientData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #f0f0f0" }} />
              <Legend />
              <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New" />
              <Bar dataKey="returning" fill="#10b981" radius={[4, 4, 0, 0]} name="Returning" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lab Tests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h3 className="font-semibold text-gray-900 mb-1">Top Lab Tests</h3>
          <p className="text-xs text-gray-500 mb-4">Most requested tests this period</p>
          <div className="flex items-center justify-between gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={labTestData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="count">
                  {labTestData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [v, "tests"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {labTestData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Drug Usage */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
        <h3 className="font-semibold text-gray-900 mb-1">Drug Usage by Category</h3>
        <p className="text-xs text-gray-500 mb-4">Units dispensed this period</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={drugUsageData} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #f0f0f0" }} />
            <Bar dataKey="units" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Units" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
