"use client";

import { useTranslations } from "next-intl";
import StatusPage from "@/components/ui/StatusPage/StatusPage";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors");

  return (
    <StatusPage
      code="500"
      title={t("unexpectedTitle")}
      description={t("unexpectedDescription")}
      primaryAction={{ label: t("tryAgain"), onClick: () => reset() }}
      secondaryAction={{ label: t("goBoards"), href: "/boards" }}
    />
  );
}
