

import { ReactNode } from "react";
import { Topbar } from "@/components/layout/Topbar/Topbar";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Box, Toolbar } from "@mui/material";
import MainContent from "./MainContent";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <MainContent>
        <Topbar />
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </MainContent>
    </Box>
  );
}