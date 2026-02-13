"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isChat = pathname?.startsWith("/chat");
  const isLogin = pathname === "/login";
  const isHome = pathname === "/";

  return (
    <ThemeProvider>
      {isDashboard ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : isChat ? (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
          {children}
        </div>
      ) : isLogin ? (
        <main className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
          {children}
        </main>
      ) : isHome ? (
        <>{children}</>
      ) : (
        <>
          <HomeHeader />
          <main className="bg-slate-50 dark:bg-slate-950 pt-16 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen md:pt-20">
            {children}
          </main>
        </>
      )}
    </ThemeProvider>
  );
}
