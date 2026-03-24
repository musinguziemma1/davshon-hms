import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  partial: "bg-orange-100 text-orange-800",
  in_progress: "bg-blue-100 text-blue-800",
  ordered: "bg-gray-100 text-gray-800",
  normal: "bg-green-100 text-green-800",
  abnormal: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
  dispensed: "bg-green-100 text-green-800",
  routine: "bg-gray-100 text-gray-800",
  urgent: "bg-orange-100 text-orange-800",
  stat: "bg-red-100 text-red-800",
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  doctor: "bg-blue-100 text-blue-800",
  nurse: "bg-green-100 text-green-800",
  receptionist: "bg-yellow-100 text-yellow-800",
  lab_technician: "bg-orange-100 text-orange-800",
  pharmacist: "bg-teal-100 text-teal-800",
};

interface BadgeProps {
  label: string;
  variant?: "status" | "role" | "custom";
  className?: string;
}

export function Badge({ label, variant = "status", className }: BadgeProps) {
  const key = label.toLowerCase().replace(" ", "_");
  let colorClass = "bg-gray-100 text-gray-700";
  if (variant === "status") colorClass = statusColors[key] || colorClass;
  else if (variant === "role") colorClass = roleColors[key] || colorClass;

  return (
    <span className={cn("badge capitalize", colorClass, className)}>
      {label.replace(/_/g, " ")}
    </span>
  );
}
