"use client";

import { Box, Drawer, Toolbar, List } from "@mui/material";
import { SidebarSection } from "./SidebarSection/SidebarSection";
import { SidebarItem } from "./SidebarItem/SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";

export function Sidebar() {
    return (
        <Drawer
        variant="permanent"
        sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", backgroundColor: "#111827", color: "white" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
            <List>
                <SidebarSection title="Main">
                    <SidebarItem label="Dashboard"  href="/" icon={<DashboardIcon sx={{ color: "white" }} />} />
                    <SidebarItem label="Users" href="/users" icon={<PeopleIcon sx={{ color: "white" }} />} />
                </SidebarSection>
                <SidebarSection title="Settings">
                    <SidebarItem label="Preferences" href="/settings" icon={<SettingsIcon sx={{ color: "white" }} />} />
                </SidebarSection>
            </List>
        </Box>    
      </Drawer>
    );
}