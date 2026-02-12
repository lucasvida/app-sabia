"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isChat = pathname?.startsWith("/chat");

  return (
    <ThemeProvider>
      {isDashboard ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : isChat ? (
        children
      ) : (
        <>
          <Header />
          <main>{children}</main>
        </>
      )}
    </ThemeProvider>
  );
}
