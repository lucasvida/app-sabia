import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const WEBHOOK_URL = "https://n8n-n8n.7wi3mx.easypanel.host/webhook/chat-sabia";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem é obrigatória." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const user_session_id = user?.id ?? "";
    const nome_professor =
      user?.user_metadata?.full_name ??
      user?.user_metadata?.name ??
      user?.user_metadata?.display_name ??
      user?.email?.split("@")[0] ??
      "";

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, user_session_id, nome_professor }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Webhook error:", res.status, text);
      return NextResponse.json(
        { error: "Erro ao conversar com o Sabiá. Tente novamente." },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    let responseText: string;

    if (contentType.includes("application/json")) {
      const data = (await res.json()) as Record<string, unknown>;
      responseText =
        typeof data?.response === "string"
          ? data.response
          : typeof data?.output === "string"
            ? data.output
            : typeof data?.text === "string"
              ? data.text
              : typeof data?.message === "string"
                ? data.message
                : JSON.stringify(data);
    } else {
      responseText = await res.text();
    }

    return NextResponse.json({ response: responseText });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Erro de conexão. Tente novamente." },
      { status: 500 }
    );
  }
}
