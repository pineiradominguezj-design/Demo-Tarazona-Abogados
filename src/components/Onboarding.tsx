"use client";

import { useState } from "react";
import { FIRM } from "@/config/identity";
import { useStore } from "@/lib/store";
import { Button, LogoMark } from "./ui";
import type { TKey } from "@/lib/i18n";

const STEPS: { title: TKey; body: TKey }[] = [
  { title: "onb.1.title", body: "onb.1.body" },
  { title: "onb.2.title", body: "onb.2.body" },
  { title: "onb.3.title", body: "onb.3.body" },
];

/**
 * Bienvenida de tres pasos la primera vez que un cliente entra.
 * El segundo paso fija expectativas: qué NO es el portal.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const { t } = useStore();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  return (
    <div className="ui-no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white">
        <div className="ui-rule" />

        <div className="px-7 py-7 sm:px-9 sm:py-9">
          <div className="flex items-center justify-between gap-4">
            <LogoMark />
            <span className="ui-eyebrow text-ink-faint">
              {t("onb.step", { n: step + 1, total: STEPS.length })}
            </span>
          </div>

          <h2 className="ui-display mt-7 text-lg leading-snug text-ink">
            {t(STEPS[step].title)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            {t(STEPS[step].body, { phone: FIRM.phone })}
          </p>

          {/* Indicador de pasos */}
          <div className="mt-8 flex gap-1.5" aria-hidden>
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 transition-colors ${
                  i <= step ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onDone}
              className="text-xs text-ink-faint underline-offset-4 hover:text-ink hover:underline"
            >
              {t("onb.skip")}
            </button>

            <Button
              onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
            >
              {isLast ? t("onb.start") : t("onb.next")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
