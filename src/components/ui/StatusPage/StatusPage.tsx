"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type LinkAction = {
  label: string;
  href: string;
};

type ClickAction = {
  label: string;
  onClick: () => void;
};

type StatusPageAction = LinkAction | ClickAction;

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  primaryAction?: StatusPageAction;
  secondaryAction?: StatusPageAction;
  fullViewport?: boolean;
};

function renderAction(action: StatusPageAction | undefined, variant: "contained" | "outlined") {
  if (!action) {
    return null;
  }

  if ("href" in action) {
    return (
      <Button href={action.href} size="large" variant={variant}>
        {action.label}
      </Button>
    );
  }

  return (
    <Button onClick={action.onClick} size="large" variant={variant}>
      {action.label}
    </Button>
  );
}

export default function StatusPage({
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
  fullViewport = false,
}: StatusPageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: fullViewport
          ? "100vh"
          : { xs: "calc(100vh - 64px)", md: "calc(100vh - 72px)" },
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 8 },
        px: 2,
        background:
          "linear-gradient(180deg, rgba(247,250,252,0.96) 0%, rgba(236,242,255,0.98) 100%)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(circle at 18% 18%, rgba(14,165,233,0.16), transparent 24%)",
            "radial-gradient(circle at 78% 22%, rgba(249,115,22,0.14), transparent 20%)",
            "radial-gradient(circle at 50% 80%, rgba(15,23,42,0.08), transparent 28%)",
          ].join(", "),
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 6,
            border: `1px solid ${alpha("#142036", 0.08)}`,
            backgroundColor: alpha("#ffffff", 0.78),
            backdropFilter: "blur(18px)",
            boxShadow: "0 24px 80px rgba(20, 32, 54, 0.14)",
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 7 },
          }}
        >
          <Typography
            aria-hidden
            sx={{
              position: "absolute",
              right: { xs: -8, md: 16 },
              top: { xs: -16, md: -28 },
              fontSize: { xs: "5.5rem", md: "9rem" },
              lineHeight: 0.9,
              fontWeight: 800,
              letterSpacing: "-0.08em",
              color: alpha("#142036", 0.06),
              userSelect: "none",
            }}
          >
            {code}
          </Typography>

          <Stack spacing={3} sx={{ position: "relative", maxWidth: 520 }}>
            <Typography
              sx={{
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "primary.main",
              }}
            >
              {code}
            </Typography>

            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  maxWidth: 480,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                {description}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              {renderAction(primaryAction, "contained")}
              {renderAction(secondaryAction, "outlined")}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}