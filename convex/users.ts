import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, { role }) => {
    const users = await ctx.db.query("users").collect();
    return role ? users.filter((u) => u.role === role) : users;
  },
});

export const getDoctors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "doctor"))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("doctor"),
      v.literal("nurse"),
      v.literal("receptionist"),
      v.literal("lab_technician"),
      v.literal("pharmacist")
    ),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    specialization: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check email uniqueness
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("Email already exists");

    const { passwordHash, ...rest } = args;
    const now = Date.now();
    return await ctx.db.insert("users", { 
      ...rest, 
      password: passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    specialization: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});
