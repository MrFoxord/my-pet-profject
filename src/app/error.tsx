"use client";

import { useTranslations } from "next-intl";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors");

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 3 }}>
      <Stack spacing={2.5} sx={{ maxWidth: 520, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t("unexpectedTitle")}
        </Typography>
        <Typography color="text.secondary">{t("unexpectedDescription")}</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button variant="contained" onClick={() => reset()}>
            {t("tryAgain")}
          </Button>
          <Button href="/boards" variant="outlined">
            {t("goBoards")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
