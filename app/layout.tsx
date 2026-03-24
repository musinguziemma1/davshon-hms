import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "DavShon Hospital Management System",
  description: "Production-ready Hospital Management System",
};

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #f9fafb; color: #111827; -webkit-font-smoothing: antialiased; }
  .sidebar-link { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:8px; font-size:14px; font-weight:500; transition:all 0.15s; text-decoration:none; }
  .sidebar-link-active { background:#eff6ff; color:#1d4ed8; }
  .sidebar-link-inactive { color:#4b5563; }
  .sidebar-link-inactive:hover { background:#f3f4f6; color:#111827; }
  .card { background:#fff; border-radius:12px; border:1px solid #f3f4f6; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
  .stat-card { background:#fff; border-radius:12px; border:1px solid #f3f4f6; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
  .badge { display:inline-flex; align-items:center; padding:2px 10px; border-radius:9999px; font-size:12px; font-weight:500; }
  .btn-primary { background:#2563eb; color:#fff; padding:8px 16px; border-radius:8px; font-size:14px; font-weight:500; border:none; cursor:pointer; transition:background 0.15s; display:inline-flex; align-items:center; gap:8px; }
  .btn-primary:hover { background:#1d4ed8; }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; padding:8px 16px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; transition:background 0.15s; }
  .btn-secondary:hover { background:#f9fafb; }
  .btn-danger { background:#dc2626; color:#fff; padding:8px 16px; border-radius:8px; font-size:14px; font-weight:500; border:none; cursor:pointer; }
  .input-field { width:100%; padding:8px 12px; border:1px solid #e5e7eb; border-radius:8px; font-size:14px; outline:none; background:#fff; transition:all 0.15s; }
  .input-field:focus { border-color:transparent; box-shadow:0 0 0 2px #3b82f6; }
  .label { display:block; font-size:14px; font-weight:500; color:#374151; margin-bottom:4px; }
  .table-header { font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; padding:12px 16px; background:#f9fafb; text-align:left; }
  .table-cell { padding:12px 16px; font-size:14px; color:#374151; }
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:#f1f5f9; }
  ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:#94a3b8; }
  @media print { .no-print { display:none !important; } }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com" async></script>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>
        <AuthProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
