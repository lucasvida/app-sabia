"use client";

import { ChatProvider } from "./ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMain } from "./ChatMain";

export function ChatLayout() {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <ChatSidebar />
        <ChatMain />
      </div>
    </ChatProvider>
  );
}
