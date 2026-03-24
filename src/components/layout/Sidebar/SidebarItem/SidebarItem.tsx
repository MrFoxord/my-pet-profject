"use client";

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function SidebarItem({
    label,
    icon,
    href = "#",
}: {
    label: string;
    icon?: ReactNode;
    href?: string;
}) {
    const pathname = usePathname();

    return (
        <ListItemButton
            component={Link}
            href={href}
            selected={pathname === href}
            sx={{
                borderRadius: 2,
                minHeight: 42,
                px: 1.25,
                color: "rgba(244, 248, 255, 0.92)",
                "& .MuiListItemText-primary": {
                    fontSize: 14,
                    fontWeight: 600,
                },
                "& .MuiListItemIcon-root": {
                    minWidth: 34,
                },
                "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.16)",
                    color: "#ffffff",
                },
                "&.Mui-selected:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.24)",
                },
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
            }}
        >
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={label} />
        </ListItemButton>
    );
}