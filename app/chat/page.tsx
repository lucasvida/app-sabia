import type { Metadata } from "next";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMain } from "@/components/chat/ChatMain";

export const metadata: Metadata = {
  title: "Chat | Sabiá AI",
  description: "Converse com o Sabiá para planejar aulas e criar atividades.",
};

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light text-gray-900 selection:bg-primary selection:text-black dark:bg-background-dark dark:text-slate-100">
      <ChatSidebar />
      <ChatMain />
    </div>
  );
}
