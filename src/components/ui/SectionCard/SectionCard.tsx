"use client";

import { Paper, type PaperProps } from "@mui/material";

interface SectionCardProps extends PaperProps {
  tone?: "default" | "danger";
}

export function SectionCard({ tone = "default", sx, children, ...props }: SectionCardProps) {
  return (
    <Paper
      {...props}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        ...(tone === "danger"
          ? {
              border: "1px solid",
              borderColor: "error.light",
            }
          : {}),
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}