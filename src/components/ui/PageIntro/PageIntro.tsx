"use client";

import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { type ReactNode } from "react";

interface PageIntroProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export function PageIntro({ title, subtitle, action, sx }: PageIntroProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        flexWrap: "wrap",
        ...sx,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Box>
  );
}