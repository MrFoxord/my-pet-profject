import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Box, Button, Stack, Typography } from "@mui/material";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", px: 3 }}>
      <Stack spacing={2.5} sx={{ maxWidth: 520, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t("notFoundTitle")}
        </Typography>
        <Typography color="text.secondary">{t("notFoundDescription")}</Typography>
        <Button component={Link} href="/boards" variant="contained" sx={{ alignSelf: "center" }}>
          {t("goBoards")}
        </Button>
      </Stack>
    </Box>
  );
}
