import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { paymentStatus: v.optional(v.string()) },
  handler: async (ctx, { paymentStatus }) => {
    const bills = await ctx.db.query("bills").order("desc").take(100);
    if (paymentStatus) return bills.filter((b) => b.paymentStatus === paymentStatus);
    return bills;
  },
});

export const getById = query({
  args: { id: v.id("bills") },
  handler: async (ctx, { id }) => {
    const bill = await ctx.db.get(id);
    if (!bill) return null;
    const items = await ctx.db
      .query("bill_items")
      .withIndex("by_billId", (q) => q.eq("billId", id))
      .collect();
    return { ...bill, items };
  },
});

export const getTotalRevenue = query({
  args: {},
  handler: async (ctx) => {
    const bills = await ctx.db
      .query("bills")
      .withIndex("by_paymentStatus", (q) => q.eq("paymentStatus", "paid"))
      .collect();
    return bills.reduce((sum, b) => sum + b.paidAmount, 0);
  },
});

export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const bills = await ctx.db
      .query("bills")
      .withIndex("by_paymentStatus", (q) => q.eq("paymentStatus", "pending"))
      .collect();
    return bills.length;
  },
});

export const create = mutation({
  args: {
    patientId: v.id("patients"),
    appointmentId: v.optional(v.id("appointments")),
    items: v.array(
      v.object({
        description: v.string(),
        category: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      })
    ),
    tax: v.number(),
    discount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { items, tax, discount, ...rest }) => {
    const count = (await ctx.db.query("bills").collect()).length;
    const billId = `BILL-${String(count + 1).padStart(4, "0")}`;
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const total = subtotal + tax - discount;
    const now = Date.now();

    const id = await ctx.db.insert("bills", {
      ...rest,
      billId,
      subtotal,
      tax,
      discount,
      total,
      paymentStatus: "pending",
      paidAmount: 0,
      createdAt: now,
      updatedAt: now,
    });

    for (const item of items) {
      await ctx.db.insert("bill_items", { ...item, billId: id });
    }
    return id;
  },
});

export const updatePayment = mutation({
  args: {
    id: v.id("bills"),
    paidAmount: v.number(),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
  },
  handler: async (ctx, { id, ...rest }) => {
    return await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});
