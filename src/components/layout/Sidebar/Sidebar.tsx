"use client";

import { Box, Drawer, Toolbar, List, IconButton, Typography } from "@mui/material";
import { SidebarSection } from "./SidebarSection/SidebarSection";
import { SidebarItem } from "./SidebarItem/SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { SidebarProps } from "@/types";
import { DASHBOARD_CHROME_BACKGROUND } from "@/components/layout/chrome";

const SIDEBAR_WIDTH = 248;

export function Sidebar({ boardId, mobileOpen = false, onMobileClose }: SidebarProps) {
    const t = useTranslations("sidebar");

    const content = (
        <>
            <Toolbar sx={{ display: { xs: "none", md: "flex" } }} />
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "space-between", px: 2, py: 2 }}>
                <Typography variant="h6" sx={{ color: "rgba(244, 248, 255, 0.96)", fontWeight: 700 }}>
                    {t("dashboard")}
                </Typography>
                <IconButton color="inherit" onClick={onMobileClose} aria-label="Close navigation">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ overflow: "auto", px: 1.2, py: 0.8 }}>
                <List sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <SidebarSection title={t("main")}>
                        <SidebarItem
                            label={t("dashboard")}
                            href={`/dashboard/${boardId}`}
                            onClick={onMobileClose}
                            icon={<DashboardIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                        <SidebarItem
                            label={t("users")}
                            href={`/dashboard/${boardId}/users`}
                            onClick={onMobileClose}
                            icon={<PeopleIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                    </SidebarSection>
                    <SidebarSection title={t("settings")}>
                        <SidebarItem
                            label={t("preferences")}
                            href={`/dashboard/${boardId}/settings`}
                            onClick={onMobileClose}
                            icon={<SettingsIcon sx={{ color: "rgba(244, 248, 255, 0.9)" }} />}
                        />
                    </SidebarSection>
                </List>
            </Box>
        </>
    );

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: SIDEBAR_WIDTH,
                        boxSizing: "border-box",
                        background: DASHBOARD_CHROME_BACKGROUND,
                        color: "rgba(244, 248, 255, 0.94)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                    },
                }}
            >
                {content}
            </Drawer>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    [`& .MuiDrawer-paper`]: {
                        width: "100vw",
                        maxWidth: "100vw",
                        boxSizing: "border-box",
                        background: DASHBOARD_CHROME_BACKGROUND,
                        color: "rgba(244, 248, 255, 0.94)",
                        borderRight: "none",
                    },
                }}
            >
                {content}
            </Drawer>
        </>
    );
}