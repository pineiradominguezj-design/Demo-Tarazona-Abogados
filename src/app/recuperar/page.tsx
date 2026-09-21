"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { Button, Notice } from "@/components/ui";
import { useStore } from "@/lib/store";
import { CheckIcon } from "@/components/icons";

export default function RecuperarPage() {
  const { t } = useStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell>
      <h2 className="ui-display text-lg text-ink">{t("recover.title")}</h2>
      <div className="ui-rule mt-3 w-16" />

      {sent ? (
        <div className="mt-7">
          <div className="flex items-start gap-3 border border-line bg-surface px-4 py-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-ink">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">
                {t("recover.sentTitle")}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                {t("recover.sentBody")}
              </p>
            </div>
          </div>

          <Link href="/acceso" className="mt-6 block">
            <Button variant="secondary" full>
              {t("recover.backToLogin")}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            {t("recover.intro")}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="remail"
                className="ui-eyebrow block text-ink-faint"
              >
                {t("login.email")}
              </label>
              <input
                id="remail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
              />
            </div>

            <Button type="submit" full>
              {t("recover.submit")}
            </Button>

            <Link
              href="/acceso"
              className="block text-center text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            >
              {t("recover.backToLogin")}
            </Link>
          </form>
        </>
      )}

      <Notice tone="neutral" className="mt-8">
        {t("recover.demoNote")}
      </Notice>
    </AuthShell>
  );
}
