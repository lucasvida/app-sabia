"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PlanejamentoIdPublicRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (id) {
      router.replace(`/dashboard/planejamento/${id}`);
    } else {
      router.replace("/dashboard/planejamento");
    }
  }, [router, id]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Redirecionando…</p>
    </div>
  );
}
