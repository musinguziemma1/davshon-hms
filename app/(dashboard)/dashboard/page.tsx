"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Users, CalendarDays, Receipt, FlaskConical,
  TrendingUp, Clock, AlertTriangle, Activity,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

// Mock data for MVP demo (replace with Convex queries in production)
const revenueData = [
  { date: "Mar 18", revenue: 4200, appointments: 28 },
  { date: "Mar 19", revenue: 3800, appointments: 24 },
  { date: "Mar 20", revenue: 5100, appointments: 35 },
  { date: "Mar 21", revenue: 4700, appointments: 31 },
  { date: "Mar 22", revenue: 6200, appointments: 42 },
  { date: "Mar 23", revenue: 5500, appointments: 38 },
  { date: "Mar 24", revenue: 7100, appointments: 47 },
];

const departmentData = [
  { name: "OPD", value: 35, color: "#3b82f6" },
  { name: "Laboratory", value: 25, color: "#10b981" },
  { name: "Pharmacy", value: 20, color: "#f59e0b" },
  { name: "Procedures", value: 20, color: "#8b5cf6" },
];

const recentAppointments = [
  { id: "APT-0042", patient: "Alice Johnson", doctor: "Dr. Wilson", time: "09:00 AM", status: "confirmed" },
  { id: "APT-0041", patient: "Bob Martinez", doctor: "Dr. Chen", time: "09:30 AM", status: "completed" },
  { id: "APT-0040", patient: "Carol White", doctor: "Dr. Wilson", time: "10:00 AM", status: "pending" },
  { id: "APT-0039", patient: "David Brown", doctor: "Dr. Patel", time: "10:30 AM", status: "confirmed" },
  { id: "APT-0038", patient: "Eva Davis", doctor: "Dr. Chen", time: "11:00 AM", status: "cancelled" },
];

const pendingAlerts = [
  { type: "Lab Result", message: "Critical result for patient PAT-0021", time: "10 min ago", severity: "high" },
  { type: "Low Stock", message: "Amoxicillin 500mg below reorder level", time: "1 hr ago", severity: "medium" },
  { type: "Pending Bill", message: "3 invoices awaiting payment approval", time: "2 hrs ago", severity: "low" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}, {userName}! 👋</h1>
            <p className="text-blue-100 mt-1 text-sm">
              Here's what's happening at DavShon Hospital today.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value="2,847" subtitle="+12 today" icon={Users} color="blue" trend={{ value: 8.2, label: "vs last week" }} index={0} />
        <StatCard title="Today's Appointments" value="47" subtitle="8 pending" icon={CalendarDays} color="green" trend={{ value: 12.5, label: "vs yesterday" }} index={1} />
        <StatCard title="Pending Bills" value="23" subtitle="$14,200 total" icon={Receipt} color="orange" trend={{ value: -3.1, label: "vs last week" }} index={2} />
        <StatCard title="Revenue Today" value={formatCurrency(7100)} subtitle="Lab + OPD + Pharmacy" icon={TrendingUp} color="purple" trend={{ value: 18.7, label: "vs yesterday" }} index={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <Activity className="w-4 h-4" />
              +18.7%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Dept Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Revenue by Dept</h3>
          <p className="text-xs text-gray-500 mb-4">Today's breakdown</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {departmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {departmentData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
            <a href="/appointments" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                    {apt.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.patient}</p>
                    <p className="text-xs text-gray-400">{apt.doctor} · {apt.time}</p>
                  </div>
                </div>
                <Badge label={apt.status} variant="status" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Alerts & Notifications</h3>
            <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
              {pendingAlerts.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingAlerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                alert.severity === "high" ? "bg-red-50 border border-red-100" :
                alert.severity === "medium" ? "bg-orange-50 border border-orange-100" :
                "bg-blue-50 border border-blue-100"
              }`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  alert.severity === "high" ? "text-red-500" :
                  alert.severity === "medium" ? "text-orange-500" : "text-blue-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{alert.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Appointments Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Daily Appointments (7 Days)</h3>
            <p className="text-xs text-gray-500">Patient visit frequency</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #f0f0f0" }} />
            <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
