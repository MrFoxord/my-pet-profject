"use client";

import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { localeCookieName, type AppLocale } from "@/i18n/config";

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
      sx={{
        minWidth: 108,
        color: "#f5f9ff",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        "& .MuiSelect-select": {
          py: 0.5,
          px: 1.2,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.38)",
        },
        "& .MuiSvgIcon-root": {
          color: "#f5f9ff",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.6)",
        },
      }}
    >
      <MenuItem value="en">{t("english")}</MenuItem>
      <MenuItem value="uk">{t("ukrainian")}</MenuItem>
      <MenuItem value="ru">{t("russian")}</MenuItem>
    </Select>
  );
}
