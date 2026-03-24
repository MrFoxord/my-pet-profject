"use client";

import { InputBase } from "@mui/material";
import { useTranslations } from "next-intl";

export function SearchInput() {
    const t = useTranslations("topbar");

    return (
        <InputBase
            placeholder={t("searchPlaceholder")}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.14)",
                color: "#f5f9ff",
                borderRadius: 999,
                px: 1.8,
                py: 0.45,
                width: { xs: 140, sm: 220, md: 260 },
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all .2s ease",
                "& .MuiInputBase-input::placeholder": {
                    color: "rgba(245, 249, 255, 0.72)",
                    opacity: 1,
                },
                "&:focus-within": {
                    borderColor: "rgba(255, 255, 255, 0.55)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
            }}
        />
    );
}