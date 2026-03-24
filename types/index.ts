// ============================================================
// DavShon HMS - Core TypeScript Types
// ============================================================

export type UserRole =
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "lab_technician"
  | "pharmacist";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "partial" | "cancelled";
export type LabStatus = "ordered" | "in_progress" | "completed" | "cancelled";
export type Gender = "male" | "female" | "other";

// ── User ──────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  specialization?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// ── Patient ───────────────────────────────────────────────
export interface Patient {
  _id: string;
  patientId: string; // e.g. PAT-001
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  medicalHistory?: string;
  createdAt: number;
  updatedAt: number;
}

// ── Appointment ───────────────────────────────────────────
export interface Appointment {
  _id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string; // OPD, follow-up, etc.
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  // Populated
  patient?: Patient;
  doctor?: User;
}

// ── Bill ──────────────────────────────────────────────────
export interface Bill {
  _id: string;
  billId: string;
  patientId: string;
  appointmentId?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paidAmount: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  patient?: Patient;
}

export interface BillItem {
  id: string;
  description: string;
  category: "consultation" | "lab" | "pharmacy" | "procedure" | "other";
  quantity: number;
  unitPrice: number;
  total: number;
}

// ── Lab ───────────────────────────────────────────────────
export interface LabTest {
  _id: string;
  testId: string;
  patientId: string;
  appointmentId?: string;
  orderedBy: string; // doctorId
  testName: string;
  testCode: string;
  status: LabStatus;
  priority: "routine" | "urgent" | "stat";
  sampleType: string;
  collectedAt?: number;
  notes?: string;
  result?: LabResult;
  createdAt: number;
  updatedAt: number;
  patient?: Patient;
  doctor?: User;
}

export interface LabResult {
  _id: string;
  testId: string;
  findings: string;
  normalRange?: string;
  unit?: string;
  value?: string;
  interpretation: "normal" | "abnormal" | "critical";
  reportedBy: string; // lab technician id
  reportedAt: number;
  notes?: string;
}

// ── Pharmacy / Medications ────────────────────────────────
export interface Medication {
  _id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string; // tablet, syrup, injection, etc.
  strength: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  sellingPrice: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Prescription {
  _id: string;
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  medications: PrescriptionItem[];
  status: "pending" | "dispensed" | "partial";
  notes?: string;
  createdAt: number;
  updatedAt: number;
  patient?: Patient;
}

export interface PrescriptionItem {
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  dispensed: number;
  instructions?: string;
}

export interface InventoryLog {
  _id: string;
  medicationId: string;
  type: "restock" | "dispense" | "adjustment" | "expired";
  quantity: number;
  previousStock: number;
  newStock: number;
  reference?: string;
  notes?: string;
  performedBy: string;
  createdAt: number;
}

// ── Dashboard / Reports ───────────────────────────────────
export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingBills: number;
  totalRevenue: number;
  activePrescriptions: number;
  pendingLabTests: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
}

export interface PatientVisitData {
  date: string;
  count: number;
}
