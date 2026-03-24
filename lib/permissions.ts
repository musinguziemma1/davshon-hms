import type { UserRole } from "@/types";

// Permission map: role -> allowed modules
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "patients",
    "appointments",
    "billing",
    "laboratory",
    "pharmacy",
    "reports",
    "admin",
  ],
  doctor: ["dashboard", "patients", "appointments", "laboratory"],
  nurse: ["dashboard", "patients", "appointments"],
  receptionist: ["dashboard", "patients", "appointments", "billing"],
  lab_technician: ["dashboard", "laboratory"],
  pharmacist: ["dashboard", "pharmacy"],
};

export function hasPermission(role: UserRole, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false;
}

export function getDefaultRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    admin: "/dashboard",
    doctor: "/appointments",
    nurse: "/patients",
    receptionist: "/appointments",
    lab_technician: "/laboratory",
    pharmacist: "/pharmacy",
  };
  return routes[role] ?? "/dashboard";
}
