import { ListSubheader } from "@mui/material";
import { ReactNode } from "react";

export function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <ListSubheader
                sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(216, 230, 255, 0.8)",
                    background: "transparent",
                    lineHeight: 1.15,
                    mb: 0.25,
                }}
            >
                {title}
            </ListSubheader>
            {children}
        </div>
    );
}