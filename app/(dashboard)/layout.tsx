"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:block min-h-screen"
      >
        <Header onMenuClick={() => setMobileMenuOpen(true)} sidebarCollapsed={sidebarCollapsed} />
        <main className="pt-14">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
      <div className="lg:hidden min-h-screen">
        <Header onMenuClick={() => setMobileMenuOpen(true)} sidebarCollapsed={false} />
        <main className="pt-14">
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
