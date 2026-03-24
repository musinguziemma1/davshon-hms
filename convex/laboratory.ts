import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const tests = await ctx.db.query("lab_tests").order("desc").take(100);
    if (status) return tests.filter((t) => t.status === status);
    return tests;
  },
});

export const getById = query({
  args: { id: v.id("lab_tests") },
  handler: async (ctx, { id }) => {
    const test = await ctx.db.get(id);
    if (!test) return null;
    const result = await ctx.db
      .query("lab_results")
      .withIndex("by_testId", (q) => q.eq("testId", id))
      .first();
    return { ...test, result };
  },
});

export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db
      .query("lab_tests")
      .withIndex("by_status", (q) => q.eq("status", "ordered"))
      .collect();
    return tests.length;
  },
});

export const create = mutation({
  args: {
    patientId: v.id("patients"),
    appointmentId: v.optional(v.id("appointments")),
    orderedBy: v.string(),
    testName: v.string(),
    testCode: v.string(),
    priority: v.string(),
    sampleType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query("lab_tests").collect()).length;
    const testId = `LAB-${String(count + 1).padStart(4, "0")}`;
    const now = Date.now();
    return await ctx.db.insert("lab_tests", {
      ...args,
      testId,
      status: "ordered",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("lab_tests"),
    status: v.string(),
    collectedAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...rest }) => {
    return await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const addResult = mutation({
  args: {
    testId: v.id("lab_tests"),
    findings: v.string(),
    normalRange: v.optional(v.string()),
    unit: v.optional(v.string()),
    value: v.optional(v.string()),
    interpretation: v.string(),
    reportedBy: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { testId, ...rest }) => {
    await ctx.db.patch(testId, { status: "completed", updatedAt: Date.now() });
    return await ctx.db.insert("lab_results", {
      ...rest,
      testId,
      reportedAt: Date.now(),
    });
  },
});
