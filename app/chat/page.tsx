import type { Metadata } from "next";
import { ChatLayout } from "@/components/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Chat | Sabiá",
  description: "Converse com o Sabiá para planejar aulas e criar atividades.",
};

export default function ChatPage() {
  return <ChatLayout />;
}
