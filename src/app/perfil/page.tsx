"use client";

import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import {
  Button,
  Card,
  Field,
  FinePrint,
  SectionTitle,
} from "@/components/ui";
import { LockIcon, UserIcon } from "@/components/icons";
import {
  formatDate,
  formatDateTime,
  maskIdDocument,
  relativeLabel,
} from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { AuthorizedPersonScope } from "@/lib/types";

export default function PerfilPage() {
  return (
    <PortalShell>
      <PerfilContent />
    </PortalShell>
  );
}

function PerfilContent() {
  const { client, cases, t, locale } = useStore();
  const l = useL();

  const [pwdClicked, setPwdClicked] = useState(false);

  if (!client) return null;

  const caseTitle = (id: string) =>
    l(cases.find((c) => c.id === id)?.title ?? { es: "—", en: "—" });

  return (
    <>
      <header>
        <h1 className="ui-display text-xl text-ink">{t("profile.title")}</h1>
        <div className="ui-rule mt-3 w-16" />
      </header>

      <div className="mt-8">
        {/* Datos de contacto */}
        <Card className="p-5 sm:p-6">
          <SectionTitle>{t("profile.contactTitle")}</SectionTitle>

          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label={t("profile.name")}>{client.name}</Field>
            <Field label={t("profile.idDocument")}>
              <span className="tabular-nums">
                {maskIdDocument(client.idDocument)}
              </span>
              <FinePrint className="mt-1">{t("profile.idMaskedHint")}</FinePrint>
            </Field>
            <Field label={t("profile.address")}>{l(client.address)}</Field>
            <Field label={t("profile.email")}>{client.email}</Field>
            <Field label={t("profile.phone")}>{client.phone}</Field>
          </dl>

          <div className="mt-6 border-t border-line pt-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
              <LockIcon className="h-4 w-4" />
              {t("profile.passwordTitle")}
            </h3>
            <FinePrint className="mt-1.5">{t("profile.passwordIntro")}</FinePrint>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => setPwdClicked(true)}
            >
              {t("profile.changePassword")}
            </Button>
            {pwdClicked && (
              <FinePrint className="mt-2">{t("profile.passwordDemo")}</FinePrint>
            )}
          </div>
        </Card>
      </div>

      {/* Personas autorizadas */}
      <section className="mt-10">
        <SectionTitle>{t("profile.authorizedTitle")}</SectionTitle>
        <p className="mb-4 text-xs text-ink-faint">
          {t("profile.authorizedIntro")}
        </p>

        {client.authorizedPeople.length === 0 ? (
          <Card className="p-5">
            <p className="text-sm text-ink-faint">
              {t("profile.authorizedEmpty")}
            </p>
          </Card>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {client.authorizedPeople.map((p) => (
              <li key={p.id}>
                <Card className="h-full p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-surface text-ink-muted">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {l(p.relationship)}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="ui-eyebrow text-ink-faint">
                        {t("profile.authorizedScope")}
                      </dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1.5">
                        {p.scopes.map((s) => (
                          <ScopeTag key={s} scope={s} />
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="ui-eyebrow text-ink-faint">
                        {t("profile.authorizedCases")}
                      </dt>
                      <dd className="mt-1 text-[0.8125rem] text-ink-soft">
                        {p.caseIds.map(caseTitle).join(" · ")}
                      </dd>
                    </div>
                  </dl>

                  <FinePrint className="mt-4 border-t border-line pt-3">
                    {t("profile.authorizedSince")} {formatDate(p.addedOn, locale)}
                  </FinePrint>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historial de accesos */}
      <section className="mt-10">
        <SectionTitle>{t("profile.accessTitle")}</SectionTitle>
        <p className="mb-4 text-xs text-ink-faint">
          {t("profile.accessIntro")}
        </p>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {[
                  "profile.accessWhen",
                  "profile.accessWho",
                  "profile.accessDevice",
                  "profile.accessLocation",
                ].map((k) => (
                  <th key={k} className="ui-eyebrow px-4 py-3 text-ink-faint">
                    {t(k as never)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {client.accessLog.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-ink">
                    {formatDateTime(a.date, locale)}
                    <span className="ml-2 text-ink-faint">
                      · {relativeLabel(a.date, t)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {a.actor}
                    {a.actorIsAuthorized && (
                      <span className="text-ink-faint">
                        {" "}
                        ({t("profile.accessAuthorized")})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{l(a.device)}</td>
                  <td className="px-4 py-3 text-ink-muted">{a.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  );
}

function ScopeTag({ scope }: { scope: AuthorizedPersonScope }) {
  const { t } = useStore();
  return (
    <span className="bg-surface px-2 py-0.5 text-[0.6875rem] text-ink-muted">
      {t(`scope.${scope}`)}
    </span>
  );
}

