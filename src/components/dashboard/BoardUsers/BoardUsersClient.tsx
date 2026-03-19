"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@/components/ui";
import {
  BoardMember,
  BoardRole,
  getBoardMembers,
  getBoardRoles,
  updateBoardMemberCustomRole,
} from "@/lib/api/client";
import {
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
} from "@/components/ui";
import {
  createBoardInvitation,
  getBoardInvitations,
  BoardInvitation,
} from "@/lib/api/client";

interface BoardUsersClientProps {
  boardId: string;
}

export default function BoardUsersClient({ boardId }: BoardUsersClientProps) {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [roles, setRoles] = useState<BoardRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<BoardInvitation[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER">("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [nextMembers, nextRoles] = await Promise.all([
          getBoardMembers(boardId),
          getBoardRoles(boardId),
        ]);
        if (!active) return;
        setMembers(nextMembers);
        setRoles(nextRoles);
      } catch (loadError) {
        console.error("failed to load board users", loadError);
        if (!active) return;
        setError("Не удалось загрузить участников доски.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [boardId]);

  useEffect(() => {
    let active = true;

    const loadInvitations = async () => {
      try {
        const nextInvitations = await getBoardInvitations(boardId);
        if (!active) return;
        setInvitations(nextInvitations);
      } catch (loadError) {
        console.error("failed to load board invitations", loadError);
      }
    };

    void loadInvitations();

    return () => {
      active = false;
    };
  }, [boardId]);

  const handleRoleChange = async (memberId: string, customRoleId: string) => {
    try {
      setSavingMemberId(memberId);
      setError(null);
      const updated = await updateBoardMemberCustomRole(
        boardId,
        memberId,
        customRoleId || null,
      );
      if (!updated) return;
      setMembers((prev) =>
        prev.map((member) => (member.id === memberId ? updated : member)),
      );
    } catch (saveError) {
      console.error("failed to update custom role", saveError);
      setError("Не удалось обновить кастомную роль участника.");
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleCreateInvitation = async () => {
    if (!inviteEmail.trim()) {
      setError("Пожалуйста, введите email адрес.");
      return;
    }

    try {
      setInviting(true);
      setError(null);
      const invitation = await createBoardInvitation(boardId, {
        email: inviteEmail,
        role: inviteRole,
      });

      if (invitation) {
        setInvitations((prev) => [...prev, invitation]);
        setInviteEmail("");
        setInviteRole("MEMBER");
        setShowInviteForm(false);
      }
    } catch (createError) {
      console.error("failed to create invitation", createError);
      setError("Не удалось отправить приглашение.");
    } finally {
      setInviting(false);
    }
  };

  const handleCopyToken = async (token: string, invitationId: string) => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const shareUrl = `${baseUrl}/invite/${token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedTokenId(invitationId);
      setTimeout(() => setCopiedTokenId(null), 2000);
    } catch (copyError) {
      console.error("failed to copy invite link", copyError);
      setError("Не удалось скопировать ссылку.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Участники доски
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Здесь можно назначать кастомные роли участникам. Базовая роль в доске
          остается отдельной: OWNER / ADMIN / MEMBER / VIEWER.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Участники и приглашения</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowInviteForm(true)}
        >
          Пригласить участника
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? <Typography>Загрузка...</Typography> : null}

      {!loading && members.length === 0 ? (
        <Alert severity="info">Участники доски пока не найдены.</Alert>
      ) : null}

      {!loading && members.length > 0 ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {members.map((member) => (
            <Box
              key={member.id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2,
                backgroundColor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
                  alignItems: "start",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="subtitle1">
                    {member.name || member.nickname || member.email || member.userId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email || "Email не указан"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={`Board role: ${member.role}`} size="small" />
                    {member.customRoleName ? (
                      <Chip
                        label={`Custom role: ${member.customRoleName}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ) : (
                      <Chip label="Custom role: none" size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>

                <FormControl fullWidth size="small" disabled={savingMemberId === member.id}>
                  <InputLabel id={`member-custom-role-${member.id}`}>Кастомная роль</InputLabel>
                  <Select
                    labelId={`member-custom-role-${member.id}`}
                    value={member.customRoleId ?? ""}
                    label="Кастомная роль"
                    onChange={(event) => void handleRoleChange(member.id, String(event.target.value))}
                  >
                    <MenuItem value="">Без кастомной роли</MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}

        {!loading && invitations.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
              Ожидающие приглашения
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Email</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Истекает</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>{invitation.role}</TableCell>
                      <TableCell>
                        <Chip
                          label={invitation.status === "pending" ? "Ожидает" : invitation.status}
                          size="small"
                          color={invitation.status === "pending" ? "warning" : "default"}
                          variant={invitation.status === "pending" ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {invitation.status === "pending" && (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip
                              title={
                                copiedTokenId === invitation.id
                                  ? "Скопировано!"
                                  : "Скопировать ссылку приглашения"
                              }
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  void handleCopyToken(invitation.token, invitation.id)
                                }
                              >
                                <span>📋</span>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}

        <Dialog
          open={showInviteForm}
          onClose={() => setShowInviteForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Пригласить участника</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                label="Email адрес"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviting}
                placeholder="user@example.com"
              />
              <FormControl fullWidth>
                <InputLabel>Роль в доске</InputLabel>
                <Select
                  value={inviteRole}
                  label="Роль в доске"
                  onChange={(e) => setInviteRole(e.target.value as "MEMBER")}
                  disabled={inviting}
                >
                  <MenuItem value="MEMBER">Участник</MenuItem>
                  <MenuItem value="ADMIN">Администратор</MenuItem>
                  <MenuItem value="VIEWER">Зритель</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowInviteForm(false)}
              disabled={inviting}
            >
              Отмена
            </Button>
            <Button
              onClick={() => void handleCreateInvitation()}
              variant="contained"
              disabled={inviting || !inviteEmail.trim()}
            >
              {inviting ? <CircularProgress size={20} /> : "Отправить приглашение"}
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
