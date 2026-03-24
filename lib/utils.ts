import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID with prefix (e.g., PAT-001, APT-001)
 */
export function generateId(prefix: string, count: number): string {
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * Format currency in USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | number): string {
  try {
    const d = typeof date === "number" ? new Date(date) : new Date(date);
    return format(d, "MMM dd, yyyy");
  } catch {
    return "Invalid Date";
  }
}

/**
 * Format datetime
 */
export function formatDateTime(date: string | number): string {
  try {
    const d = typeof date === "number" ? new Date(date) : new Date(date);
    return format(d, "MMM dd, yyyy HH:mm");
  } catch {
    return "Invalid Date";
  }
}

/**
 * Time ago helper
 */
export function timeAgo(date: number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

/**
 * Role display names
 */
export const roleLabels: Record<string, string> = {
  admin: "Administrator",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  lab_technician: "Lab Technician",
  pharmacist: "Pharmacist",
};

/**
 * Role badge colors
 */
export const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  doctor: "bg-blue-100 text-blue-800",
  nurse: "bg-green-100 text-green-800",
  receptionist: "bg-yellow-100 text-yellow-800",
  lab_technician: "bg-orange-100 text-orange-800",
  pharmacist: "bg-teal-100 text-teal-800",
};

/**
 * Status badge colors
 */
export const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  partial: "bg-orange-100 text-orange-800",
  in_progress: "bg-blue-100 text-blue-800",
  ordered: "bg-gray-100 text-gray-800",
};

/**
 * Truncate text
 */
export function truncate(str: string, length: number = 50): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
