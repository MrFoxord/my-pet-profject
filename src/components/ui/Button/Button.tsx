"use client";

import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = MuiButtonProps;

export function Button({ sx, ...props }: ButtonProps) {
  return <MuiButton sx={{ textTransform: "none", ...sx }} {...props} />;
}