"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Users, CalendarDays, Receipt,
  FlaskConical, Pill, BarChart3, Settings, Hospital,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import type { UserRole } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
  { href: "/patients", label: "Patients", icon: Users, module: "patients" },
  { href: "/appointments", label: "Appointments", icon: CalendarDays, module: "appointments" },
  { href: "/billing", label: "Billing", icon: Receipt, module: "billing" },
  { href: "/laboratory", label: "Laboratory", icon: FlaskConical, module: "laboratory" },
  { href: "/pharmacy", label: "Pharmacy", icon: Pill, module: "pharmacy" },
  { href: "/reports", label: "Reports", icon: BarChart3, module: "reports" },
  { href: "/admin", label: "Administration", icon: Settings, module: "admin" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as UserRole;

  const allowedItems = NAV_ITEMS.filter((item) =>
    role ? hasPermission(role, item.module) : false
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Hospital className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-gray-900 whitespace-nowrap">DavShon HMS</div>
              <div className="text-xs text-gray-400 whitespace-nowrap">Hospital System</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {allowedItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "sidebar-link group relative",
                isActive ? "sidebar-link-active" : "sidebar-link-inactive"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-50 rounded-lg"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:flex border-t border-gray-100 px-3 py-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg p-2 transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <><ChevronLeft className="w-4 h-4" /><span className="text-xs">Collapse</span></>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:block fixed left-0 top-0 bottom-0 z-30 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
            >
              <div className="relative h-full">
                <button onClick={onMobileClose} className="absolute top-4 right-3 z-10 p-1 rounded-lg hover:bg-gray-100 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
