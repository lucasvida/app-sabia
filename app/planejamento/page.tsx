"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlanejamentoPublicRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/planejamento");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Redirecionando…</p>
    </div>
  );
}
