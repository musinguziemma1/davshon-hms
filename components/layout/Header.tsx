"use client";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Bell, Menu, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn, getInitials, roleLabels } from "@/lib/utils";
import type { UserRole } from "@/types";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const role = (session?.user as any)?.role as UserRole;

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    doctor: "bg-blue-100 text-blue-700",
    nurse: "bg-green-100 text-green-700",
    receptionist: "bg-yellow-100 text-yellow-700",
    lab_technician: "bg-orange-100 text-orange-700",
    pharmacist: "bg-teal-100 text-teal-700",
  };

  return (
    <header className="fixed top-0 right-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-4" style={{ left: sidebarCollapsed ? 64 : 240, transition: "left 0.2s" }}>
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(session?.user?.name || "U")}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-800 leading-tight">
                {session?.user?.name?.split(" ").slice(0, 2).join(" ") || "User"}
              </div>
              <div className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium inline-block", roleColors[role] || "bg-gray-100 text-gray-600")}>
                {roleLabels[role] || role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20"
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
