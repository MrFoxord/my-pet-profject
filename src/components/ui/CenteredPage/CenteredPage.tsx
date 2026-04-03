"use client";

import { Box, Container, type BoxProps, type ContainerProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { type ReactNode } from "react";

interface CenteredPageProps {
  children: ReactNode;
  maxWidth?: ContainerProps["maxWidth"];
  fullViewport?: boolean;
  contentSx?: BoxProps["sx"];
}

export function CenteredPage({
  children,
  maxWidth = "sm",
  fullViewport = true,
  contentSx,
}: CenteredPageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: fullViewport ? "100vh" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 3, md: 6 },
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
            "radial-gradient(circle at 18% 18%, rgba(14,165,233,0.14), transparent 24%)",
            "radial-gradient(circle at 78% 22%, rgba(249,115,22,0.1), transparent 20%)",
            `radial-gradient(circle at 50% 80%, ${alpha("#142036", 0.06)}, transparent 28%)`,
          ].join(", "),
        }}
      />

      <Container maxWidth={maxWidth} sx={{ position: "relative" }}>
        <Box sx={contentSx}>{children}</Box>
      </Container>
    </Box>
  );
}