"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading DavShon HMS..." />
      </div>
    );
  }

  if (!session) return null;

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
