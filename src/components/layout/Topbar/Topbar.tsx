"use client"

import { AppBar, Toolbar, Box, IconButton, Typography, Avatar } from "@mui/material";
import { SearchInput } from "./SearchInput/SearchInput";
import { Notifications } from "./Notifications/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { TopbarProps } from "@/types";

export function Topbar({boardTitle, boardLogo}: TopbarProps) {

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {boardLogo && <Avatar src={boardLogo} alt={boardTitle} />}
                    <Typography variant="h6" noWrap component="div">
                        {boardTitle}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <SearchInput />
                    <Notifications />
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};