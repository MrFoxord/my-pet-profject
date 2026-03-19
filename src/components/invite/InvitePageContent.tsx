"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
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
  const [invitation, setInvitation] = useState<BoardInvitationPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        setLoading(true);
        setError(null);
        const invite = await getInvitationByToken(token);
        if (!invite) {
          setError("Приглашение не найдено или истекло.");
          return;
        }
        setInvitation(invite);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "";
        console.warn("failed to load invitation", error);
        if (msg.includes("503")) {
          setError("Сервер временно недоступен. Попробуйте позже.");
        } else {
          setError("Не удалось загрузить данные приглашения.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!session?.user?.id) {
      await signIn();
      return;
    }

    try {
      setAccepting(true);
      setError(null);
      const result = await acceptInvitationByToken(token, session.user.id);
      if (result?.success && result.boardId) {
        router.push(`/dashboard/${result.boardId}`);
      } else {
        setError("Не удалось принять приглашение.");
      }
    } catch (err) {
      console.warn("failed to accept invitation", err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email mismatch")) {
        setError("Это приглашение предназначено для другого email-адреса. Войдите в нужный аккаунт.");
      } else if (msg.includes("not pending")) {
        setError("Это приглашение уже было принято или отозвано.");
      } else if (msg.includes("expired")) {
        setError("Срок действия приглашения истёк. Запросите новое у владельца доски.");
      } else {
        setError("Ошибка при принятии приглашения.");
      }
    } finally {
      setAccepting(false);
    }
  };

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
              Приглашение недействительно
            </Typography>
            <Alert severity="error">{error || "Приглашение не найдено."}</Alert>
          </CardContent>
          <CardActions>
            <Button onClick={() => router.push("/")} variant="contained">
              Вернуться на главную
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
  }

  const isExpired =
    new Date(invitation.expiresAt).getTime() < Date.now();
  const isPending = invitation.status === "pending";
  const canAccept = isPending && !isExpired && status === "authenticated";

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
              Приглашение на доску
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Вы приглашены присоединиться к доске:
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
                label={`Роль: ${invitation.role}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={
                  isExpired
                    ? "Истекло"
                    : `Истекает: ${new Date(invitation.expiresAt).toLocaleDateString()}`
                }
                color={isExpired ? "error" : "info"}
                variant="outlined"
              />
              <Chip
                label={isPending ? "Ожидает ответа" : invitation.status}
                color={isPending ? "warning" : "default"}
                variant="filled"
              />
            </Box>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {isExpired && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Это приглашение истекло. Пожалуйста, запросите новое приглашение у владельца доски.
            </Alert>
          )}

          {isPending && !isExpired && status === "unauthenticated" && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Пожалуйста, войдите в систему или создайте аккаунт для принятия приглашения.
            </Alert>
          )}
        </CardContent>
        <CardActions>
          <Button
            onClick={() => router.push("/")}
            variant="outlined"
          >
            Отмена
          </Button>
          {canAccept ? (
            <Button
              onClick={() => void handleAcceptInvitation()}
              variant="contained"
              color="primary"
              disabled={accepting}
              sx={{ flex: 1 }}
            >
              {accepting ? <CircularProgress size={20} /> : "Принять приглашение"}
            </Button>
          ) : (
            <Button
              onClick={async () => {
                if (status === "unauthenticated") {
                  await signIn();
                }
              }}
              variant="contained"
              color="primary"
              disabled={isExpired}
              sx={{ flex: 1 }}
            >
              {isExpired ? "Приглашение истекло" : "Войти / Зарегистрироваться"}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
