"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "purple" | "red" | "teal";
  trend?: { value: number; label: string };
  index?: number;
}

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
  red: { bg: "bg-red-50", icon: "text-red-600" },
  teal: { bg: "bg-teal-50", icon: "text-teal-600" },
};

export function StatCard({ title, value, subtitle, icon: Icon, color, trend, index = 0 }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="stat-card hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
