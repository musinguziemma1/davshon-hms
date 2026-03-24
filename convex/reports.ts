import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const [patients, todayApts, pendingBills, paidBills, pendingLabs] =
      await Promise.all([
        ctx.db.query("patients").collect(),
        ctx.db
          .query("appointments")
          .withIndex("by_date", (q) =>
            q.eq("date", new Date().toISOString().split("T")[0])
          )
          .collect(),
        ctx.db
          .query("bills")
          .withIndex("by_paymentStatus", (q) => q.eq("paymentStatus", "pending"))
          .collect(),
        ctx.db
          .query("bills")
          .withIndex("by_paymentStatus", (q) => q.eq("paymentStatus", "paid"))
          .collect(),
        ctx.db
          .query("lab_tests")
          .withIndex("by_status", (q) => q.eq("status", "ordered"))
          .collect(),
      ]);

    const totalRevenue = paidBills.reduce((s, b) => s + b.paidAmount, 0);

    return {
      totalPatients: patients.length,
      todayAppointments: todayApts.length,
      pendingBills: pendingBills.length,
      totalRevenue,
      pendingLabTests: pendingLabs.length,
    };
  },
});

export const getRevenueByDateRange = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, { startDate, endDate }) => {
    const bills = await ctx.db.query("bills").collect();
    const filtered = bills.filter((b) => {
      const d = new Date(b.createdAt).toISOString().split("T")[0];
      return d >= startDate && d <= endDate;
    });

    // Group by date
    const grouped: Record<string, number> = {};
    for (const bill of filtered) {
      const d = new Date(bill.createdAt).toISOString().split("T")[0];
      grouped[d] = (grouped[d] ?? 0) + bill.paidAmount;
    }

    return Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getPatientVisits = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const appointments = await ctx.db.query("appointments").collect();
    const grouped: Record<string, number> = {};

    for (const apt of appointments) {
      grouped[apt.date] = (grouped[apt.date] ?? 0) + 1;
    }

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  },
});

export const getLabTestSummary = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("lab_tests").collect();
    const summary: Record<string, number> = {};
    for (const t of tests) {
      summary[t.testName] = (summary[t.testName] ?? 0) + 1;
    }
    return Object.entries(summary)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
});
