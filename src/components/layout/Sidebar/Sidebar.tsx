"use client";

import { Box, Drawer, Toolbar, List } from "@mui/material";
import { SidebarSection } from "./SidebarSection/SidebarSection";
import { SidebarItem } from "./SidebarItem/SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { useTranslations } from "next-intl";
import { SidebarProps } from "@/types";

export function Sidebar({ boardId, themeColor }: SidebarProps) {
    const t = useTranslations("sidebar");

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 248,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: 248,
                    boxSizing: "border-box",
                    background: `linear-gradient(180deg, ${themeColor || "#173464"} 0%, #0f2244 100%)`,
                    color: "rgba(244, 248, 255, 0.94)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto", px: 1.2, py: 0.8 }}>
                <List sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <SidebarSection title={t("main")}>
                        <SidebarItem
                            label={t("dashboard")}
                            href={`/dashboard/${boardId}`}
                            icon={<DashboardIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                        <SidebarItem
                            label={t("users")}
                            href={`/dashboard/${boardId}/users`}
                            icon={<PeopleIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                    </SidebarSection>
                    <SidebarSection title={t("settings")}>
                        <SidebarItem
                            label={t("preferences")}
                            href={`/dashboard/${boardId}/settings`}
                            icon={<SettingsIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                    </SidebarSection>
                </List>
            </Box>
        </Drawer>
    );
}