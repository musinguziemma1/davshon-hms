import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {
    status: v.optional(v.string()),
    date: v.optional(v.string()),
    doctorId: v.optional(v.string()),
  },
  handler: async (ctx, { status, date, doctorId }) => {
    let q = ctx.db.query("appointments");
    const appointments = await q.order("desc").take(200);

    return appointments.filter((a) => {
      if (status && a.status !== status) return false;
      if (date && a.date !== date) return false;
      if (doctorId && a.doctorId !== doctorId) return false;
      return true;
    });
  },
});

export const getById = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const getTodayCount = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const all = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
    return all.length;
  },
});

export const create = mutation({
  args: {
    patientId: v.id("patients"),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    reason: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query("appointments").collect()).length;
    const appointmentId = `APT-${String(count + 1).padStart(4, "0")}`;
    const now = Date.now();
    return await ctx.db.insert("appointments", {
      ...args,
      appointmentId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, notes }) => {
    return await ctx.db.patch(id, { status, notes, updatedAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("appointments"),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    reason: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    return await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
});
