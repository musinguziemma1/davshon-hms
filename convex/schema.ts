import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Users ──────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    role: v.string(),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    specialization: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ── Patients ───────────────────────────────────────────
  patients: defineTable({
    patientId: v.string(),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_patientId", ["patientId"])
    .index("by_phone", ["phone"])
    .searchIndex("search_patients", {
      searchField: "firstName",
      filterFields: ["gender", "bloodGroup"],
    }),

  // ── Appointments ───────────────────────────────────────
  appointments: defineTable({
    appointmentId: v.string(),
    patientId: v.id("patients"),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    status: v.string(),
    reason: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_appointmentId", ["appointmentId"])
    .index("by_patientId", ["patientId"])
    .index("by_doctorId", ["doctorId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // ── Bills ──────────────────────────────────────────────
  bills: defineTable({
    billId: v.string(),
    patientId: v.id("patients"),
    appointmentId: v.optional(v.id("appointments")),
    subtotal: v.number(),
    tax: v.number(),
    discount: v.number(),
    total: v.number(),
    paymentStatus: v.string(),
    paymentMethod: v.optional(v.string()),
    paidAmount: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_billId", ["billId"])
    .index("by_patientId", ["patientId"])
    .index("by_paymentStatus", ["paymentStatus"]),

  // ── Bill Items ─────────────────────────────────────────
  bill_items: defineTable({
    billId: v.id("bills"),
    description: v.string(),
    category: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    total: v.number(),
  }).index("by_billId", ["billId"]),

  // ── Lab Tests ──────────────────────────────────────────
  lab_tests: defineTable({
    testId: v.string(),
    patientId: v.id("patients"),
    appointmentId: v.optional(v.id("appointments")),
    orderedBy: v.string(),
    testName: v.string(),
    testCode: v.string(),
    status: v.string(),
    priority: v.string(),
    sampleType: v.string(),
    collectedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_testId", ["testId"])
    .index("by_patientId", ["patientId"])
    .index("by_status", ["status"]),

  // ── Lab Results ────────────────────────────────────────
  lab_results: defineTable({
    testId: v.id("lab_tests"),
    findings: v.string(),
    normalRange: v.optional(v.string()),
    unit: v.optional(v.string()),
    value: v.optional(v.string()),
    interpretation: v.string(),
    reportedBy: v.string(),
    reportedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_testId", ["testId"]),

  // ── Medications ────────────────────────────────────────
  medications: defineTable({
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
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["category"]),

  // ── Inventory Logs ─────────────────────────────────────
  inventory_logs: defineTable({
    medicationId: v.id("medications"),
    type: v.string(),
    quantity: v.number(),
    previousStock: v.number(),
    newStock: v.number(),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    performedBy: v.string(),
    createdAt: v.number(),
  }).index("by_medicationId", ["medicationId"]),

  // ── Prescriptions ──────────────────────────────────────
  prescriptions: defineTable({
    prescriptionId: v.string(),
    patientId: v.id("patients"),
    doctorId: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_prescriptionId", ["prescriptionId"])
    .index("by_patientId", ["patientId"]),

  // ── Prescription Items ─────────────────────────────────
  prescription_items: defineTable({
    prescriptionId: v.id("prescriptions"),
    medicationId: v.id("medications"),
    medicationName: v.string(),
    dosage: v.string(),
    frequency: v.string(),
    duration: v.string(),
    quantity: v.number(),
    dispensed: v.number(),
    instructions: v.optional(v.string()),
  }).index("by_prescriptionId", ["prescriptionId"]),
});
