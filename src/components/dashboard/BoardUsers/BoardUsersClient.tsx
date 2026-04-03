"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  PageIntro,
  Select,
  SectionHeading,
  SectionCard,
  Typography,
} from "@/components/ui";
import {
  BoardMember,
  BoardRole,
  CreateBoardInvitationInput,
  InvitationType,
  SharedInvitationMode,
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
  BoardInvitation,
} from "@/lib/api/client";
import {
  useCreateBoardInvitationMutation,
  useDeleteBoardInvitationMutation,
  useDeleteBoardMemberMutation,
  useGetBoardInvitationsQuery,
  useGetBoardByIdQuery,
  useGetBoardMembersQuery,
  useGetBoardRolesQuery,
  useUpdateBoardMemberCustomRoleMutation,
} from "@/store/api";

interface BoardUsersClientProps {
  boardId: string;
}

export default function BoardUsersClient({ boardId }: BoardUsersClientProps) {
  const t = useTranslations("boardUsers");
  const [error, setError] = useState<string | null>(null);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteType, setInviteType] = useState<InvitationType>("PERSONAL");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCustomRoleId, setInviteCustomRoleId] = useState("");
  const [sharedInvitationMode, setSharedInvitationMode] = useState<SharedInvitationMode>("SINGLE_USE");
  const [inviting, setInviting] = useState(false);
  const [removingInvitationId, setRemovingInvitationId] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const {
    data: membersData = [],
    isLoading: isMembersLoading,
    error: membersError,
  } = useGetBoardMembersQuery(boardId);
  const {
    data: rolesData = [],
    isLoading: isRolesLoading,
    error: rolesError,
  } = useGetBoardRolesQuery(boardId);
  const { data: board } = useGetBoardByIdQuery(boardId);
  const {
    data: invitationsData = [],
    isLoading: isInvitationsLoading,
    error: invitationsError,
  } = useGetBoardInvitationsQuery(boardId, {
    skip: board ? !(board.currentUserRole === "OWNER" || board.currentUserRole === "ADMIN") : true,
  });

  const [updateBoardMemberCustomRoleMutation] = useUpdateBoardMemberCustomRoleMutation();
  const [deleteBoardMemberMutation] = useDeleteBoardMemberMutation();
  const [createBoardInvitationMutation] = useCreateBoardInvitationMutation();
  const [deleteBoardInvitationMutation] = useDeleteBoardInvitationMutation();

  const members: BoardMember[] = membersData;
  const roles: BoardRole[] = rolesData;
  const invitations: BoardInvitation[] = invitationsData;
  const loading = isMembersLoading || isRolesLoading || isInvitationsLoading;
  const hasLoadError = Boolean(membersError || rolesError || invitationsError);
  const canManageBoardUsers = board?.currentUserRole === "OWNER" || board?.currentUserRole === "ADMIN";
  const canCreatePersonalInvite = board?.allowPersonalInvites ?? true;
  const canCreateSharedInvite = board?.allowSharedInvites ?? true;
  const canCreateAnyInvite = canManageBoardUsers && (canCreatePersonalInvite || canCreateSharedInvite);

  useEffect(() => {
    if (board?.defaultSharedInvitationMode) {
      setSharedInvitationMode(board.defaultSharedInvitationMode);
    }
  }, [board?.defaultSharedInvitationMode]);

  useEffect(() => {
    if (inviteType === "PERSONAL" && !canCreatePersonalInvite && canCreateSharedInvite) {
      setInviteType("SHARED");
    }

    if (inviteType === "SHARED" && !canCreateSharedInvite && canCreatePersonalInvite) {
      setInviteType("PERSONAL");
    }
  }, [canCreatePersonalInvite, canCreateSharedInvite, inviteType]);

  const handleRoleChange = async (memberId: string, customRoleId: string) => {
    if (!canManageBoardUsers) {
      setError(t("managementRestricted"));
      return;
    }

    try {
      setSavingMemberId(memberId);
      setError(null);
      await updateBoardMemberCustomRoleMutation({
        boardId,
        memberId,
        customRoleId: customRoleId || null,
      }).unwrap();
    } catch (saveError) {
      console.error("failed to update custom role", saveError);
      setError(t("errorUpdateRole"));
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleCreateInvitation = async () => {
    if (!canManageBoardUsers) {
      setError(t("managementRestricted"));
      return;
    }

    if (inviteType === "PERSONAL" && !canCreatePersonalInvite) {
      setError(t("personalInvitesDisabled"));
      return;
    }

    if (inviteType === "SHARED" && !canCreateSharedInvite) {
      setError(t("sharedInvitesDisabled"));
      return;
    }

    if (inviteType === "PERSONAL" && !inviteEmail.trim()) {
      setError(t("errorEmailRequired"));
      return;
    }

    try {
      setInviting(true);
      setError(null);
      const input: CreateBoardInvitationInput = {
        type: inviteType,
        customRoleId: inviteCustomRoleId || null,
      };

      if (inviteType === "PERSONAL") {
        input.email = inviteEmail.trim();
      } else {
        input.sharedInvitationMode = sharedInvitationMode;
      }

      const invitation = await createBoardInvitationMutation({ boardId, input }).unwrap();

      if (invitation) {
        setInviteType("PERSONAL");
        setInviteEmail("");
        setInviteCustomRoleId("");
        setSharedInvitationMode("SINGLE_USE");
        setShowInviteForm(false);
      }
    } catch (createError) {
      console.error("failed to create invitation", createError);
      setError(t("errorCreateInvitation"));
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (member: BoardMember) => {
    if (!canManageBoardUsers) {
      setError(t("managementRestricted"));
      return;
    }

    const displayName = member.name || member.nickname || member.email || member.userId;
    const confirmed = window.confirm(
      t("removeMemberConfirm", { name: displayName }),
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingMemberId(member.id);
      setError(null);
      await deleteBoardMemberMutation({ boardId, memberId: member.id }).unwrap();
    } catch (removeError) {
      console.error("failed to remove board member", removeError);
      setError(t("errorRemoveMember"));
    } finally {
      setRemovingMemberId(null);
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
      setError(t("errorCopyLink"));
    }
  };

  const handleDeleteInvitation = async (invitation: BoardInvitation) => {
    if (!canManageBoardUsers) {
      setError(t("managementRestricted"));
      return;
    }

    const confirmed = window.confirm(
      t("deleteInvitationConfirm"),
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingInvitationId(invitation.id);
      setError(null);
      await deleteBoardInvitationMutation({
        boardId,
        invitationId: invitation.id,
      }).unwrap();
    } catch (deleteError) {
      console.error("failed to delete invitation", deleteError);
      setError(t("errorDeleteInvitation"));
    } finally {
      setRemovingInvitationId(null);
    }
  };

  const getInvitationTypeLabel = (type: InvitationType) =>
    type === "PERSONAL" ? t("typePersonal") : t("typeShared");

  const getInvitationStateLabel = (invitation: BoardInvitation) => {
    switch (invitation.state) {
      case "expired":
        return t("stateExpired");
      case "revoked":
        return t("stateRevoked");
      case "limit_reached":
        return t("stateLimitReached");
      case "accepted":
        return invitation.type === "PERSONAL" ? t("stateAccepted") : t("stateCompleted");
      default:
        return t("statePending");
    }
  };

  const getInvitationStateColor = (invitation: BoardInvitation) => {
    switch (invitation.state) {
      case "expired":
      case "revoked":
      case "limit_reached":
        return "error" as const;
      case "accepted":
        return "success" as const;
      default:
        return "warning" as const;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <PageIntro
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowInviteForm(true)}
            disabled={!canCreateAnyInvite}
          >
            {t("inviteMember")}
          </Button>
        }
      />

      <Typography variant="h6">{t("membersAndInvitations")}</Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {hasLoadError ? <Alert severity="error">{t("errorLoadData")}</Alert> : null}
      {!canManageBoardUsers ? <Alert severity="info">{t("managementRestricted")}</Alert> : null}
      {canManageBoardUsers && !canCreateAnyInvite ? <Alert severity="info">{t("allInvitesDisabled")}</Alert> : null}
      {loading ? <Typography>{t("loading")}</Typography> : null}

      {!loading && members.length === 0 ? (
        <Alert severity="info">{t("noMembers")}</Alert>
      ) : null}

      {!loading && members.length > 0 ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {members.map((member) => (
            <SectionCard
              key={member.id}
              sx={{
                p: 2,
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
                    {member.email || t("emailNotProvided")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={t("boardRoleChip", { role: t(`role.${member.role.toLowerCase()}`) })} size="small" />
                    {member.customRoleName ? (
                      <Chip
                        label={t("customRoleChip", { role: member.customRoleName })}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ) : (
                      <Chip label={t("customRoleNoneChip")} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>

                <FormControl fullWidth size="small" disabled={!canManageBoardUsers || savingMemberId === member.id}>
                  <InputLabel id={`member-custom-role-${member.id}`}>{t("customRoleLabel")}</InputLabel>
                  <Select
                    labelId={`member-custom-role-${member.id}`}
                    value={member.customRoleId ?? ""}
                    label={t("customRoleLabel")}
                    disabled={!canManageBoardUsers || savingMemberId === member.id}
                    onChange={(event) => void handleRoleChange(member.id, String(event.target.value))}
                  >
                    <MenuItem value="">{t("noCustomRole")}</MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ color: "common.white" }}
                    disabled={!canManageBoardUsers || savingMemberId === member.id || removingMemberId === member.id}
                    onClick={() => void handleRemoveMember(member)}
                  >
                    {removingMemberId === member.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      t("removeAccess")
                    )}
                  </Button>
                </Box>
              </Box>
            </SectionCard>
          ))}
        </Box>
      ) : null}

        {!loading && canManageBoardUsers && invitations.length > 0 ? (
          <SectionCard>
              <SectionHeading title={t("pendingInvitations")} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell>{t("tableType")}</TableCell>
                    <TableCell>{t("tableRecipient")}</TableCell>
                    <TableCell>{t("tableCustomRole")}</TableCell>
                    <TableCell>{t("tableStatus")}</TableCell>
                    <TableCell>{t("tableUsage")}</TableCell>
                    <TableCell>{t("tableLink")}</TableCell>
                    <TableCell>{t("tableExpires")}</TableCell>
                    <TableCell align="right">{t("tableActions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{getInvitationTypeLabel(invitation.type)}</TableCell>
                      <TableCell>
                        {invitation.type === "PERSONAL"
                          ? invitation.email || t("emailNotProvided")
                          : t("noEmail")}
                      </TableCell>
                      <TableCell>{invitation.customRoleName || t("noCustomRole")}</TableCell>
                      <TableCell>
                        <Chip
                          label={getInvitationStateLabel(invitation)}
                          size="small"
                          color={getInvitationStateColor(invitation)}
                          variant={invitation.state === "pending" ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>{`${invitation.usedCount}/${invitation.maxUses}`}</TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                          {invitation.shareUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {invitation.state === "pending" && (
                            <Tooltip
                              title={
                                copiedTokenId === invitation.id
                                  ? t("copied")
                                  : t("copyInviteLink")
                              }
                            >
                              <IconButton
                                size="small"
                                disabled={removingInvitationId === invitation.id}
                                onClick={() =>
                                  void handleCopyToken(invitation.token, invitation.id)
                                }
                              >
                                <span>📋</span>
                              </IconButton>
                            </Tooltip>
                          )}
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={removingInvitationId === invitation.id}
                            onClick={() => void handleDeleteInvitation(invitation)}
                          >
                            {removingInvitationId === invitation.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              t("deleteInvitation")
                            )}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>
        ) : null}

        <Dialog
          open={showInviteForm}
          onClose={() => setShowInviteForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t("inviteDialogTitle")}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Checkbox
                  checked={inviteType === "SHARED"}
                  onChange={(event) => {
                    const nextType = event.target.checked ? "SHARED" : "PERSONAL";
                    if ((nextType === "SHARED" && !canCreateSharedInvite) || (nextType === "PERSONAL" && !canCreatePersonalInvite)) {
                      return;
                    }
                    setInviteType(nextType);
                    setError(null);
                  }}
                  disabled={inviting || !canManageBoardUsers || !canCreatePersonalInvite || !canCreateSharedInvite}
                />
                <Typography variant="body2">{t("sharedLinkCheckbox")}</Typography>
              </Box>

              {inviteType === "PERSONAL" && !canCreatePersonalInvite ? (
                <Alert severity="info">{t("personalInvitesDisabled")}</Alert>
              ) : null}

              {inviteType === "SHARED" && !canCreateSharedInvite ? (
                <Alert severity="info">{t("sharedInvitesDisabled")}</Alert>
              ) : null}

              {inviteType === "PERSONAL" ? (
                <TextField
                  fullWidth
                  label={t("emailAddressLabel")}
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={inviting}
                  placeholder="user@example.com"
                />
              ) : (
                <FormControl fullWidth>
                  <InputLabel>{t("sharedModeLabel")}</InputLabel>
                  <Select
                    value={sharedInvitationMode}
                    label={t("sharedModeLabel")}
                    onChange={(e) =>
                      setSharedInvitationMode(e.target.value as SharedInvitationMode)
                    }
                    disabled={inviting || !canCreateSharedInvite}
                  >
                    <MenuItem value="SINGLE_USE">{t("singleUse")}</MenuItem>
                    <MenuItem value="MULTI_USE">{t("multiUse")}</MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <InputLabel>{t("customRoleLabel")}</InputLabel>
                <Select
                  value={inviteCustomRoleId}
                  label={t("customRoleLabel")}
                  onChange={(e) => setInviteCustomRoleId(String(e.target.value))}
                  disabled={inviting || !canManageBoardUsers}
                >
                  <MenuItem value="">{t("noCustomRole")}</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowInviteForm(false)}
              disabled={inviting}
            >
              {t("cancelButton")}
            </Button>
            <Button
              onClick={() => void handleCreateInvitation()}
              variant="contained"
              disabled={
                inviting ||
                !canCreateAnyInvite ||
                (inviteType === "PERSONAL" && !inviteEmail.trim()) ||
                (inviteType === "PERSONAL" && !canCreatePersonalInvite) ||
                (inviteType === "SHARED" && !canCreateSharedInvite)
              }
            >
              {inviting ? <CircularProgress size={20} /> : t("createInvitation")}
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
