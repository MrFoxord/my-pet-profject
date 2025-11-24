"use client";

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function SidebarItem({
    label,
    icon,
    href='#',
}: {
    label:string;
    icon?:ReactNode;
    href?:string;
}) {
    const pathname = usePathname();

    return (
        <ListItemButton
        component={Link}
        href={href}
        selected={pathname === href}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={label} />
        </ListItemButton>
    );
}