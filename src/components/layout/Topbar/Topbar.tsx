"use client"

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Typography,
    Avatar,
    Menu,
    MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Notifications } from "./Notifications/Notifications";
import { LocaleSwitcher } from "./LocaleSwitcher/LocaleSwitcher";
import { Button } from "@/components/ui";
import { useGetBoardByIdQuery, useLeaveBoardMutation } from "@/store/api";
import { signOut, useSession } from "next-auth/react";
import { DASHBOARD_CHROME_BACKGROUND } from "@/components/layout/chrome";

export function Topbar() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("topbar");
    const { data: session, status: sessionStatus } = useSession();

    const [isHydrated, setIsHydrated] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveBoardMutation] = useLeaveBoardMutation();

    const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)(?:\/(.+))?$/);
    const boardId = dashboardMatch?.[1] ?? null;
    const isDashboardRoute = Boolean(boardId);
    const isDashboardSubsection = Boolean(dashboardMatch?.[2]);
    const isAuthRoute = pathname.startsWith("/auth");
    const isAuthenticated = sessionStatus === "authenticated";
    const { data: boardData, error: boardError } = useGetBoardByIdQuery(boardId ?? "", {
        skip: isAuthRoute || !isAuthenticated || !boardId,
    });
    const isOwner = boardData?.currentUserRole === "OWNER";

    const isBackendUnavailable = useMemo(() => {
        if (!boardError || typeof boardError !== "object" || !("error" in boardError)) {
            return false;
        }

        const value = String(boardError.error ?? "");
        return value.includes("503") || value.includes("Backend API is unavailable");
    }, [boardError]);

    const boardTitle = boardData?.title ?? null;
    const boardLogo = boardData?.logoUrl ?? null;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated || isAuthRoute || !isAuthenticated) {
        return null;
    }

    const heading = isDashboardRoute
        ? boardTitle ?? t("dashboardFallback")
        : session?.user?.name ?? session?.user?.email ?? t("workspaceFallback");

    const handleOpenProfileMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseProfileMenu = () => {
        setAnchorEl(null);
    };

    const handleLeaveBoard = async () => {
        if (isOwner || !boardId) {
            return;
        }

        const confirmed = window.confirm(t("leaveBoardConfirm"));
        if (!confirmed) {
            return;
        }

        try {
            setIsLeaving(true);
            await leaveBoardMutation({ boardId }).unwrap();
            router.push("/boards");
        } catch (error) {
            console.error("failed to leave board", error);
            const message = error instanceof Error ? error.message : "";
            if (message.includes("owner cannot leave")) {
                window.alert(t("leaveBoardOwnerAlert"));
            } else {
                window.alert(t("leaveBoardErrorAlert"));
            }
        } finally {
            setIsLeaving(false);
        }
    };

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: DASHBOARD_CHROME_BACKGROUND,
                    top: 0,
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        rowGap: { xs: 1, sm: 1.25 },
                        columnGap: 1,
                        py: { xs: 1, sm: 0.75 },
                        minHeight: { xs: 76, sm: 76, md: 66 },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: "1 1 auto", pr: 1 }}>
                        {boardLogo ? (
                            <Avatar src={boardLogo} alt={heading} sx={{ width: 34, height: 34 }} />
                        ) : (
                            <Avatar sx={{ width: 34, height: 34 }}>{heading.charAt(0).toUpperCase()}</Avatar>
                        )}
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                fontSize: { xs: 15, sm: 18 },
                                maxWidth: { xs: "calc(100vw - 132px)", sm: "none" },
                            }}
                        >
                            {heading}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "flex-start", md: "flex-end" },
                            flexWrap: "wrap",
                            gap: { xs: 0.6, sm: 0.9, md: 1.2 },
                            width: { xs: "100%", md: "auto" },
                        }}
                    >
                        {isBackendUnavailable ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#ffe3b2",
                                    fontWeight: 600,
                                    mr: { xs: "auto", md: 0 },
                                    maxWidth: { xs: "100%", md: 220 },
                                }}
                            >
                                {t("backendUnavailable")}
                            </Typography>
                        ) : null}

                        {isDashboardRoute ? (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    sx={{
                                        borderColor: "rgba(255, 255, 255, 0.44)",
                                        px: { xs: 1, sm: 1.5 },
                                        minWidth: 0,
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={() => router.push("/boards")}
                                >
                                    {t("home")}
                                </Button>

                                {isDashboardSubsection ? (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="inherit"
                                        sx={{
                                            borderColor: "rgba(255, 255, 255, 0.44)",
                                            px: { xs: 1, sm: 1.5 },
                                            minWidth: 0,
                                            whiteSpace: "nowrap",
                                        }}
                                        onClick={() => router.push(`/dashboard/${boardId}`)}
                                    >
                                        {t("backToBoard")}
                                    </Button>
                                ) : (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            boxShadow: "none",
                                            px: { xs: 1, sm: 1.5 },
                                            minWidth: 0,
                                            whiteSpace: "nowrap",
                                            color: "#ffffff",
                                            "&.Mui-disabled": {
                                                color: "#ffffff",
                                                backgroundColor: "rgba(211, 47, 47, 0.78)",
                                            },
                                        }}
                                        disabled={isLeaving || isOwner}
                                        onClick={() => void handleLeaveBoard()}
                                    >
                                        {isOwner
                                            ? t("ownerCannotLeave")
                                            : isLeaving
                                                ? t("leaving")
                                                : t("leaveBoard")}
                                    </Button>
                                )}
                            </>
                        ) : null}

                        <Notifications />
                        <LocaleSwitcher />
                        <IconButton color="inherit" onClick={handleOpenProfileMenu} sx={{ p: 0.25 }}>
                            {session?.user?.name ? (
                                <Avatar sx={{ width: 28, height: 28 }}>
                                    {session.user.name.charAt(0).toUpperCase()}
                                </Avatar>
                            ) : (
                                <AccountCircleIcon />
                            )}
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseProfileMenu}
                            PaperProps={{
                                sx: {
                                    borderRadius: 2,
                                    minWidth: { xs: 180, sm: 220 },
                                    border: "1px solid",
                                    borderColor: "divider",
                                },
                            }}
                        >
                            <MenuItem disabled>
                                {session?.user?.name ?? session?.user?.email ?? t("profileFallback")}
                            </MenuItem>
                            <MenuItem
                                onClick={async () => {
                                    handleCloseProfileMenu();
                                    await signOut({ callbackUrl: "/auth/signin" });
                                }}
                            >
                                {t("signOut")}
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};