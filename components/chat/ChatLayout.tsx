"use client";

import { useState } from "react";
import { ChatProvider } from "./ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMain } from "./ChatMain";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <ChatMain onMenuClick={() => setSidebarOpen(true)} />
        </div>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </ChatProvider>
  );
}
