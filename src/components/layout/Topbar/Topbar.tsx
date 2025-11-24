"use client"

import { AppBar, Toolbar, Box } from "@mui/material";
import { SearchInput } from "./SearchInput/SearchInput";
import { Notifications } from "./Notifications/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";

export function Topbar() {

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <SearchInput />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Notifications />
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};