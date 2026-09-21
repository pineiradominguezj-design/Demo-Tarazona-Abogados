"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { FIRM } from "@/config/identity";

/**
 * Punto de entrada: si hay sesión se va a los asuntos, si no al acceso.
 * Un cliente con un único expediente entra directamente a su ficha.
 */
export default function Home() {
  const router = useRouter();
  const { hydrated, client, cases } = useStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!client) {
      router.replace("/acceso");
    } else if (cases.length === 1) {
      router.replace(`/asuntos/${cases[0].id}`);
    } else {
      router.replace("/asuntos");
    }
  }, [hydrated, client, cases, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="ui-eyebrow text-ink-faint">{FIRM.name}</span>
    </div>
  );
}
