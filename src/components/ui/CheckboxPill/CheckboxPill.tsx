"use client";

import { Box, Checkbox, Typography } from "@mui/material";

interface CheckboxPillProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  onToggle: () => void;
}

export function CheckboxPill({ checked, label, disabled = false, onToggle }: CheckboxPillProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        border: "1px solid",
        borderColor: checked ? "primary.main" : "divider",
        borderRadius: 999,
        pr: 1.25,
        pl: 0.5,
        py: 0.25,
      }}
    >
      <Checkbox checked={checked} onChange={onToggle} disabled={disabled} size="small" />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}