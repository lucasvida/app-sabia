"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar />
        <div className="flex-1 overflow-y-auto px-6 pb-10 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
