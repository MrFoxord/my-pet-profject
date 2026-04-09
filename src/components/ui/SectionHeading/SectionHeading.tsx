"use client";

import { Box, Typography } from "@mui/material";
import { type ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  tone?: "default" | "danger";
}

export function SectionHeading({
  title,
  description,
  meta,
  tone = "default",
}: SectionHeadingProps) {
  return (
    <Box>
      <Typography variant="h6" color={tone === "danger" ? "error.main" : undefined}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
      {meta ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {meta}
        </Typography>
      ) : null}
    </Box>
  );
}