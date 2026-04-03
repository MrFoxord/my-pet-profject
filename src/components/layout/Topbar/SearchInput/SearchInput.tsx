"use client";

import { InputBase } from "@mui/material";
import { useTranslations } from "next-intl";
import { TOPBAR_SEARCH_INPUT_SX } from "../chromeStyles";

export function SearchInput() {
    const t = useTranslations("topbar");

    return (
        <InputBase
            placeholder={t("searchPlaceholder")}
            sx={TOPBAR_SEARCH_INPUT_SX}
        />
    );
}