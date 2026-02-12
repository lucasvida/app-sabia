import type { Metadata } from "next";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMain } from "@/components/chat/ChatMain";

export const metadata: Metadata = {
  title: "Chat | Sabiá AI",
  description: "Converse com o Sabiá para planejar aulas e criar atividades.",
};

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <ChatSidebar />
      <ChatMain />
    </div>
  );
}
