"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTranslations } from "next-intl";
import { useSocket } from "@/contexts/SocketContext";
import { RealtimeNotification } from "@/lib/api/client";
import {
    appApi,
    useGetNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
} from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { TOPBAR_OVERLAY_PAPER_SX } from "../chromeStyles";

export function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const t = useTranslations("notifications");
    const { socket } = useSocket();
    const dispatch = useAppDispatch();
    const { data } = useGetNotificationsQuery();
    const [markAllRead] = useMarkAllNotificationsReadMutation();
    const [markOneRead] = useMarkNotificationReadMutation();

    const notifications = useMemo(() => data?.items ?? [], [data?.items]);
    const unreadCount = data?.unreadCount ?? 0;

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNotification = (payload: RealtimeNotification) => {
            dispatch(
                appApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                    draft.items = [payload, ...draft.items.filter((item) => item.id !== payload.id)].slice(0, 30);
                    draft.unreadCount = typeof payload.unreadCount === "number"
                        ? payload.unreadCount
                        : draft.unreadCount + 1;
                })
            );
        };

        socket.on("notification", handleNotification);

        return () => {
            socket.off("notification", handleNotification);
        };
    }, [dispatch, socket]);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
        void (async () => {
            try {
                await markAllRead().unwrap();
            } catch (error) {
                console.error("failed to mark all notifications as read", error);
            }
        })();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: TOPBAR_OVERLAY_PAPER_SX,
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem onClick={handleClose} sx={{ py: 1.2 }}>
                        {t("empty")}
                    </MenuItem>
                ) : (
                    notifications.map((item) => (
                        <MenuItem
                            key={item.id}
                            onClick={() => {
                                if (!item.isRead) {
                                    void (async () => {
                                        try {
                                            await markOneRead(item.id).unwrap();
                                        } catch (error) {
                                            console.error("failed to mark notification as read", error);
                                        }
                                    })();
                                }
                                handleClose();
                            }}
                            sx={{
                                alignItems: "flex-start",
                                py: 1.1,
                                borderLeft: item.isRead ? "2px solid transparent" : "2px solid",
                                borderColor: item.isRead ? "transparent" : "primary.main",
                                bgcolor: item.isRead ? "transparent" : "rgba(11, 99, 206, 0.06)",
                            }}
                        >
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(item.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
}