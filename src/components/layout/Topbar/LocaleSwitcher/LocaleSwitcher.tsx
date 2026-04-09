"use client";

import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { localeCookieName, type AppLocale } from "@/i18n/config";
import { TOPBAR_SELECT_SX } from "../chromeStyles";

const localeOrder: AppLocale[] = ["en", "uk", "ru"];

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("common");
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const nextLocale = event.target.value as AppLocale;
    if (!localeOrder.includes(nextLocale)) {
      return;
    }

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <Select
      size="small"
      value={locale}
      onChange={handleChange}
      aria-label={t("language")}
      renderValue={(value) => String(value).toUpperCase()}
      sx={TOPBAR_SELECT_SX}
    >
      <MenuItem value="en">{t("english")}</MenuItem>
      <MenuItem value="uk">{t("ukrainian")}</MenuItem>
      <MenuItem value="ru">{t("russian")}</MenuItem>
    </Select>
  );
}
