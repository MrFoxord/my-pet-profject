"use client";

import { Box, Checkbox, Typography, type CheckboxProps } from "@mui/material";

interface SettingCheckboxRowProps extends Pick<CheckboxProps, "checked" | "disabled" | "onChange"> {
  label: string;
  hint?: string;
}

export function SettingCheckboxRow({ label, hint, checked, disabled, onChange }: SettingCheckboxRowProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Checkbox checked={checked} disabled={disabled} onChange={onChange} />
      <Box>
        <Typography variant="body1">{label}</Typography>
        {hint ? (
          <Typography variant="body2" color="text.secondary">
            {hint}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}