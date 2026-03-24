"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Box,
  MuiCard as Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@/components/ui";
import { getInvitationByToken, acceptInvitationByToken } from "@/lib/api/client";
import type { BoardInvitationPublic } from "@/lib/api/client";

interface InvitePageContentProps {
  token: string;
}

export default function InvitePageContent({ token }: InvitePageContentProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const t = useTranslations("invite");
  const format = useFormatter();
  const [invitation, setInvitation] = useState<BoardInvitationPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [autoAcceptTriggered, setAutoAcceptTriggered] = useState(false);

  const signInUrl = `/auth/signin?redirectTo=${encodeURIComponent(`/invite/${token}`)}`;

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        setLoading(true);
        setError(null);
        const invite = await getInvitationByToken(token);
        if (!invite) {
          setError(t("loadingError"));
          return;
        }
        setInvitation(invite);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "";
        console.warn("failed to load invitation", error);
        if (msg.includes("503")) {
          setError(t("serverUnavailable"));
        } else if (msg.includes("404")) {
          setError(t("notFound"));
        } else {
          setError(t("loadError"));
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInvitation();
  }, [token, t]);

  const handleAcceptInvitation = useCallback(async () => {
    if (!session?.user?.id) {
      router.push(signInUrl);
      return;
    }

    try {
      setAccepting(true);
      setError(null);
      const result = await acceptInvitationByToken(token);
      if (result?.success && result.boardId) {
        router.push(`/dashboard/${result.boardId}`);
      } else {
        setError(t("acceptError"));
      }
    } catch (err) {
      console.warn("failed to accept invitation", err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email mismatch")) {
        setError(t("emailMismatch"));
      } else if (msg.includes("custom role is missing")) {
        setError(t("roleMissing"));
      } else if (msg.includes("limit reached")) {
        setError(t("limitReachedError"));
      } else if (msg.includes("already accepted")) {
        setError(t("alreadyAccepted"));
      } else if (msg.includes("revoked")) {
        setError(t("revokedError"));
      } else if (msg.includes("expired")) {
        setError(t("expiredError"));
      } else {
        setError(t("acceptError"));
      }
    } finally {
      setAccepting(false);
    }
  }, [session?.user?.id, token, router, signInUrl, t]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      invitation?.state === "pending" &&
      !accepting &&
      !autoAcceptTriggered
    ) {
      setAutoAcceptTriggered(true);
      void handleAcceptInvitation();
    }
  }, [status, session?.user?.id, invitation?.state, accepting, autoAcceptTriggered, handleAcceptInvitation]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invitation) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, width: "100%" }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, color: "error.main" }}>
              {t("invalidTitle")}
            </Typography>
            <Alert severity="error">{error ?? t("notFound")}</Alert>
          </CardContent>
          <CardActions>
            <Button onClick={() => router.push("/")} variant="contained">
              {t("backToHome")}
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
  }

  const isPending = invitation.state === "pending";
  const canAccept = isPending && status === "authenticated";

  const renderStateAlert = () => {
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    switch (invitation.state) {
      case "expired":
        return (
          <Alert severity="warning">
            {t("expiredAlert")}
          </Alert>
        );
      case "revoked":
        return <Alert severity="error">{t("revokedAlert")}</Alert>;
      case "limit_reached":
        return (
          <Alert severity="warning">
            {t("limitReachedAlert")}
          </Alert>
        );
      case "accepted":
        return (
          <Alert severity="info">
            {t("alreadyAcceptedAlert")}
          </Alert>
        );
      default:
        if (status === "unauthenticated") {
          return (
            <Alert severity="info">
              {t("signInPrompt")}
            </Alert>
          );
        }

        if (accepting) {
          return <Alert severity="info">{t("processing")}</Alert>;
        }

        return null;
    }
  };

  const expiresLabel = invitation.expiresAt
    ? t("expiresLabel", {
        date: format.dateTime(new Date(invitation.expiresAt), {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })
    : null;

  const stateLabel =
    invitation.state === "pending"
      ? t("statePending")
      : invitation.state === "limit_reached"
        ? t("stateLimitReached")
        : invitation.state === "revoked"
          ? t("stateRevoked")
          : invitation.state === "expired"
            ? t("stateExpired")
            : t("stateUsed");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            {invitation.board.logoUrl && (
              <Box
                component="img"
                src={invitation.board.logoUrl}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  mb: 2,
                  objectFit: "cover",
                }}
              />
            )}
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t("title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("subtitle")}
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {invitation.board.title}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={t("typeLabel", {
                  type: invitation.type === "PERSONAL" ? t("typePersonal") : t("typeShared"),
                })}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={
                  invitation.customRoleName
                    ? t("customRoleValue", { role: invitation.customRoleName })
                    : t("noCustomRole")
                }
                color="primary"
                variant="outlined"
              />
              {expiresLabel && (
                <Chip
                  label={expiresLabel}
                  color={invitation.state === "expired" ? "error" : "info"}
                  variant="outlined"
                />
              )}
              <Chip
                label={stateLabel}
                color={isPending ? "warning" : "default"}
                variant="filled"
              />
              {invitation.type === "SHARED" ? (
                <Chip
                  label={t("usageLabel", {
                    used: invitation.usedCount,
                    max: invitation.maxUses,
                  })}
                  color="default"
                  variant="outlined"
                />
              ) : null}
            </Box>
          </Stack>

          {renderStateAlert()}
        </CardContent>
        <CardActions>
          <Button
            onClick={() => router.push("/")}
            variant="outlined"
          >
            {t("cancelButton")}
          </Button>
          {canAccept ? (
            <Button
              onClick={() => void handleAcceptInvitation()}
              variant="contained"
              color="primary"
              disabled={accepting}
              sx={{ flex: 1 }}
            >
              {accepting ? <CircularProgress size={20} /> : t("acceptButton")}
            </Button>
          ) : (
            <Button
              onClick={() => router.push(signInUrl)}
              variant="contained"
              color="primary"
              disabled={invitation.state !== "pending"}
              sx={{ flex: 1 }}
            >
              {invitation.state === "pending" ? t("signInButton") : t("newLinkNeeded")}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
