import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllMedications = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const meds = await ctx.db.query("medications").order("asc").take(200);
    if (category) return meds.filter((m) => m.category === category);
    return meds;
  },
});

export const getMedicationById = query({
  args: { id: v.id("medications") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const meds = await ctx.db.query("medications").collect();
    return meds.filter((m) => m.stockQuantity <= m.reorderLevel && m.isActive);
  },
});

export const createMedication = mutation({
  args: {
    name: v.string(),
    genericName: v.string(),
    category: v.string(),
    dosageForm: v.string(),
    strength: v.string(),
    manufacturer: v.string(),
    batchNumber: v.string(),
    expiryDate: v.string(),
    stockQuantity: v.number(),
    reorderLevel: v.number(),
    unitPrice: v.number(),
    sellingPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("medications", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStock = mutation({
  args: {
    id: v.id("medications"),
    quantity: v.number(),
    type: v.string(),
    performedBy: v.string(),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, quantity, type, performedBy, reference, notes }) => {
    const med = await ctx.db.get(id);
    if (!med) throw new Error("Medication not found");

    const previousStock = med.stockQuantity;
    const newStock =
      type === "dispense"
        ? previousStock - quantity
        : previousStock + quantity;

    if (newStock < 0) throw new Error("Insufficient stock");

    await ctx.db.patch(id, { stockQuantity: newStock, updatedAt: Date.now() });
    await ctx.db.insert("inventory_logs", {
      medicationId: id,
      type,
      quantity,
      previousStock,
      newStock,
      reference,
      notes,
      performedBy,
      createdAt: Date.now(),
    });

    return newStock;
  },
});

export const getInventoryLogs = query({
  args: { medicationId: v.optional(v.id("medications")) },
  handler: async (ctx, { medicationId }) => {
    if (medicationId) {
      return await ctx.db
        .query("inventory_logs")
        .withIndex("by_medicationId", (q) => q.eq("medicationId", medicationId))
        .order("desc")
        .take(50);
    }
    return await ctx.db.query("inventory_logs").order("desc").take(100);
  },
});
