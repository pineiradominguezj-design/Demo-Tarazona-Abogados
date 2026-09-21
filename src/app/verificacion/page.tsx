"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Button, Notice } from "@/components/ui";
import { getClientById } from "@/lib/data";
import { useStore } from "@/lib/store";

type Method = "sms" | "email" | null;

function VerificacionInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, completeLogin } = useStore();

  const clientId = params.get("c") ?? "";
  const client = getClientById(clientId);

  const [method, setMethod] = useState<Method>(null);
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [error, setError] = useState(false);

  if (!client) {
    return (
      <AuthShell>
        <p className="text-sm text-ink-muted">{t("login.error")}</p>
        <Button className="mt-6" onClick={() => router.replace("/acceso")}>
          {t("recover.backToLogin")}
        </Button>
      </AuthShell>
    );
  }

  const maskedPhone = client.phone.slice(-3);
  const maskedEmail = client.email.replace(/^(.).*(@.*)$/, "$1•••••$2");

  function verify(e: React.FormEvent) {
    e.preventDefault();
    // En la demostración cualquier código de seis dígitos vale, y también ninguno.
    if (code.length > 0 && code.length !== 6) {
      setError(true);
      return;
    }
    completeLogin(clientId);
    router.replace("/");
  }

  return (
    <AuthShell>
      <h2 className="ui-display text-lg text-ink">{t("twofa.title")}</h2>
      <div className="ui-rule mt-3 w-16" />

      {method === null ? (
        <>
          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            {t("twofa.intro")}
          </p>

          <div className="mt-7 space-y-3">
            <button
              type="button"
              onClick={() => setMethod("sms")}
              className="flex w-full items-center justify-between border border-line px-4 py-3.5 text-left transition-colors hover:border-accent hover:bg-accent-wash"
            >
              <span className="text-sm font-medium text-ink">
                {t("twofa.bySms")}
              </span>
              <span className="text-xs text-ink-faint">
                ••• ••• {maskedPhone}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("email")}
              className="flex w-full items-center justify-between border border-line px-4 py-3.5 text-left transition-colors hover:border-accent hover:bg-accent-wash"
            >
              <span className="text-sm font-medium text-ink">
                {t("twofa.byEmail")}
              </span>
              <span className="text-xs text-ink-faint">{maskedEmail}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            {method === "sms"
              ? `${t("twofa.sentBySms")} ••• ••• ${maskedPhone}.`
              : `${t("twofa.sentByEmail")} ${maskedEmail}.`}
          </p>

          <form onSubmit={verify} className="mt-7 space-y-5">
            <div>
              <label htmlFor="code" className="ui-eyebrow block text-ink-faint">
                {t("twofa.code")}
              </label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError(false);
                }}
                className="mt-2 w-full border border-line bg-white px-3 py-3 text-center text-lg tracking-[0.6em] text-ink outline-none transition-colors focus:border-accent"
              />
              {error && (
                <p className="mt-2 text-xs text-[#A33A3A]">
                  {t("twofa.invalid")}
                </p>
              )}
            </div>

            <Button type="submit" full>
              {t("twofa.verify")}
            </Button>

            <div className="flex items-center justify-between gap-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMethod(null);
                  setCode("");
                  setResent(false);
                }}
                className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                {t("twofa.changeMethod")}
              </button>
              <button
                type="button"
                onClick={() => setResent(true)}
                className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                {resent ? t("twofa.resent") : t("twofa.resend")}
              </button>
            </div>
          </form>
        </>
      )}

      <Notice tone="neutral" className="mt-8">
        {t("twofa.demoNote")}
      </Notice>
    </AuthShell>
  );
}

export default function VerificacionPage() {
  return (
    <Suspense>
      <VerificacionInner />
    </Suspense>
  );
}
