"use client";

import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
        <IconButton color="inherit" onClick={handleOpen}>
            <Badge badgeContent={3} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Notification 1</MenuItem>
            <MenuItem onClick={handleClose}>Notification 2</MenuItem>
            <MenuItem onClick={handleClose}>Notification 3</MenuItem>
        </Menu>
        </>
    )
};