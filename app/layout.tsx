import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "DavShon Hospital Management System",
  description: "Production-ready Hospital Management System",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
