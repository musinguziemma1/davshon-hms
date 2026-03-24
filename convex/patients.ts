import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all patients with optional search
export const getAll = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }) => {
    if (search && search.length > 0) {
      return await ctx.db
        .query("patients")
        .withSearchIndex("search_patients", (q) =>
          q.search("firstName", search)
        )
        .take(50);
    }
    return await ctx.db.query("patients").order("desc").take(100);
  },
});

// Get single patient by ID
export const getById = query({
  args: { id: v.id("patients") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Get patient by patientId string (e.g. PAT-0001)
export const getByPatientId = query({
  args: { patientId: v.string() },
  handler: async (ctx, { patientId }) => {
    return await ctx.db
      .query("patients")
      .withIndex("by_patientId", (q) => q.eq("patientId", patientId))
      .first();
  },
});

// Get total patient count
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const patients = await ctx.db.query("patients").collect();
    return patients.length;
  },
});

// Create new patient
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.string(),
    bloodGroup: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    allergies: v.optional(v.string()),
    medicalHistory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query("patients").collect()).length;
    const patientId = `PAT-${String(count + 1).padStart(4, "0")}`;
    const now = Date.now();
    return await ctx.db.insert("patients", {
      ...args,
      patientId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update patient
export const update = mutation({
  args: {
    id: v.id("patients"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    bloodGroup: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    allergies: v.optional(v.string()),
    medicalHistory: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    return await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

// Delete patient
export const remove = mutation({
  args: { id: v.id("patients") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
