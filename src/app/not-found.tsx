import { getTranslations } from "next-intl/server";
import StatusPage from "@/components/ui/StatusPage/StatusPage";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <StatusPage
      code="404"
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      primaryAction={{ label: t("goBoards"), href: "/boards" }}
      secondaryAction={{ label: t("goHome"), href: "/" }}
    />
  );
}
