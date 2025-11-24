"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function MainContent({ children }: { children: ReactNode }) {
  return <Box component="main" sx={{ flexGrow: 1 }}>{children}</Box>;
}