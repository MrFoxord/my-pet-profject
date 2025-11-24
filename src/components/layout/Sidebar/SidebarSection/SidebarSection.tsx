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
            <ListSubheader sx={{ fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>
                {title}
            </ListSubheader>
            {children}
        </div>
    );}