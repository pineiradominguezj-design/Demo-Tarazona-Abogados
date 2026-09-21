"use client";

import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { Card, FinePrint, Notice } from "@/components/ui";
import { ChevronDown, ShieldIcon } from "@/components/icons";
import { FIRM } from "@/config/identity";
import { useStore } from "@/lib/store";
import type { TKey } from "@/lib/i18n";

const BLOCKS: { title: TKey; body: TKey }[] = [
  { title: "privacy.controllerTitle", body: "privacy.controllerBody" },
  { title: "privacy.processorTitle", body: "privacy.processorBody" },
  { title: "privacy.securityTitle", body: "privacy.securityBody" },
  { title: "privacy.rightsTitle", body: "privacy.rightsBody" },
  { title: "privacy.contactTitle", body: "privacy.contactBody" },
];

export default function PrivacidadPage() {
  return (
    <PortalShell>
      <PrivacidadContent />
    </PortalShell>
  );
}

/**
 * Aviso de privacidad. No es una sección del portal: se llega desde el pie y
 * el texto llega plegado, de modo que solo lo lee quien lo busca.
 */
function PrivacidadContent() {
  const { t } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <Card className="mx-auto max-w-3xl">
      <h1>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="privacidad-texto"
          className="flex w-full items-center gap-3 px-5 py-5 text-left transition-colors hover:bg-surface sm:px-6"
        >
          <ShieldIcon className="h-4 w-4 shrink-0 text-ink-faint" />
          <span className="ui-display flex-1 text-base text-ink">
            {t("privacy.title")}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h1>

      {open && (
        <div
          id="privacidad-texto"
          className="border-t border-line px-5 py-6 sm:px-6"
        >
          {/* La demo no puede presentar estos textos como definitivos. */}
          <Notice tone="warn">{t("privacy.draftNotice")}</Notice>

          <div className="mt-6 space-y-6">
            {BLOCKS.map((b) => (
              <section key={b.title}>
                <h2 className="text-sm font-medium text-ink">
                  {t(b.title)}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {t(b.body, {
                    firm: FIRM.name,
                    email: FIRM.email,
                    address: FIRM.address,
                  })}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <h2 className="text-sm font-medium text-ink">
              {t("privacy.policyLink")}
            </h2>
            <FinePrint className="mt-1.5">
              {t("privacy.policyPending")}
            </FinePrint>
          </div>
        </div>
      )}
    </Card>
  );
}
