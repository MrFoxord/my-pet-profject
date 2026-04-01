"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@/components/ui";
import { BoardRole } from "@/lib/api/client";
import { TicketPermission } from "@/types";
import {
  useCreateBoardRoleMutation,
  useDeleteBoardMutation,
  useDeleteBoardRoleMutation,
  useGetBoardByIdQuery,
  useGetBoardRolesQuery,
  useUpdateBoardMutation,
  useUpdateBoardRoleMutation,
} from "@/store/api";

interface BoardSettingsClientProps {
  boardId: string;
}

type Notice = {
  type: "success" | "error" | "info";
  text: string;
};

type BoardFormState = {
  title: string;
  description: string;
  logoUrl: string;
  themeColor: string;
  allowPersonalInvites: boolean;
  allowSharedInvites: boolean;
  defaultSharedInvitationMode: "SINGLE_USE" | "MULTI_USE";
  inviteExpiresHours: string;
  sharedInviteMaxUses: string;
};

type RoleDraft = {
  name: string;
  permissions: TicketPermission[];
};

const DEFAULT_COLOR = "#173464";
const ALL_PERMISSIONS: TicketPermission[] = ["view", "fill", "edit", "delete", "estimate", "comment", "manageAccess"];

function normalizePermissions(permissions: string[] | undefined): TicketPermission[] {
  return ALL_PERMISSIONS.filter((permission) => permissions?.includes(permission));
}

export default function BoardSettingsClient({ boardId }: BoardSettingsClientProps) {
  const router = useRouter();
  const t = useTranslations("boardSettings");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [boardForm, setBoardForm] = useState<BoardFormState>({
    title: "",
    description: "",
    logoUrl: "",
    themeColor: "",
    allowPersonalInvites: true,
    allowSharedInvites: true,
    defaultSharedInvitationMode: "SINGLE_USE",
    inviteExpiresHours: "168",
    sharedInviteMaxUses: "10",
  });
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, RoleDraft>>({});
  const [isSavingBoard, setIsSavingBoard] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null);
  const [isDeletingBoard, setIsDeletingBoard] = useState(false);

  const { data: board, isLoading: isBoardLoading, error: boardError } = useGetBoardByIdQuery(boardId);
  const { data: roles = [], isLoading: isRolesLoading, error: rolesError } = useGetBoardRolesQuery(boardId);

  const [updateBoardMutation] = useUpdateBoardMutation();
  const [createBoardRoleMutation] = useCreateBoardRoleMutation();
  const [updateBoardRoleMutation] = useUpdateBoardRoleMutation();
  const [deleteBoardRoleMutation] = useDeleteBoardRoleMutation();
  const [deleteBoardMutation] = useDeleteBoardMutation();

  useEffect(() => {
    if (!board) {
      return;
    }

    setBoardForm({
      title: board.title ?? "",
      description: board.description ?? "",
      logoUrl: board.logoUrl ?? "",
      themeColor: board.themeColor ?? "",
      allowPersonalInvites: board.allowPersonalInvites ?? true,
      allowSharedInvites: board.allowSharedInvites ?? true,
      defaultSharedInvitationMode: board.defaultSharedInvitationMode ?? "SINGLE_USE",
      inviteExpiresHours: String(board.inviteExpiresHours ?? 168),
      sharedInviteMaxUses: String(board.sharedInviteMaxUses ?? 10),
    });
  }, [board]);

  useEffect(() => {
    if (roles.length === 0) {
      return;
    }

    setRoleDrafts((current) => {
      const next = { ...current };
      for (const role of roles) {
        if (next[role.id] === undefined) {
          next[role.id] = {
            name: role.name,
            permissions: normalizePermissions(role.permissions),
          };
        }
      }
      return next;
    });
  }, [roles]);

  const isLoading = isBoardLoading || isRolesLoading;
  const hasLoadError = Boolean(boardError || rolesError);
  const canManageSettings = board?.currentUserRole === "OWNER" || board?.currentUserRole === "ADMIN";
  const previewColor = (boardForm.themeColor.trim() || board?.themeColor || DEFAULT_COLOR).trim();
  const roleCountText = useMemo(() => t("rolesCount", { count: roles.length }), [roles.length, t]);

  const setField = <K extends keyof BoardFormState>(field: K, value: BoardFormState[K]) => {
    setBoardForm((current) => ({ ...current, [field]: value }));
  };

  const getPermissionLabel = (permission: TicketPermission) => {
    switch (permission) {
      case "view":
        return t("permissionView");
      case "fill":
        return t("permissionFill");
      case "edit":
        return t("permissionEdit");
      case "delete":
        return t("permissionDelete");
      case "estimate":
        return t("permissionEstimate");
      case "comment":
        return t("permissionComment");
      case "manageAccess":
        return t("permissionManageAccess");
      default:
        return permission;
    }
  };

  const setRoleDraft = (roleId: string, patch: Partial<RoleDraft>) => {
    setRoleDrafts((current) => ({
      ...current,
      [roleId]: {
        name: current[roleId]?.name ?? "",
        permissions: current[roleId]?.permissions ?? [...ALL_PERMISSIONS],
        ...patch,
      },
    }));
  };

  const handleSaveBoard = async () => {
    if (!canManageSettings) {
      setNotice({ type: "info", text: t("restrictedAlert") });
      return;
    }

    if (!boardForm.title.trim()) {
      setNotice({ type: "error", text: t("titleRequired") });
      return;
    }

    const inviteExpiresHours = Number(boardForm.inviteExpiresHours);
    const sharedInviteMaxUses = Number(boardForm.sharedInviteMaxUses);

    if (!Number.isInteger(inviteExpiresHours) || inviteExpiresHours < 1) {
      setNotice({ type: "error", text: t("inviteExpiresHoursError") });
      return;
    }

    if (!Number.isInteger(sharedInviteMaxUses) || sharedInviteMaxUses < 1) {
      setNotice({ type: "error", text: t("sharedInviteMaxUsesError") });
      return;
    }

    try {
      setIsSavingBoard(true);
      setNotice(null);
      await updateBoardMutation({
        boardId,
        input: {
          title: boardForm.title.trim(),
          description: boardForm.description.trim() || null,
          logoUrl: boardForm.logoUrl.trim() || null,
          themeColor: boardForm.themeColor.trim() || null,
          allowPersonalInvites: boardForm.allowPersonalInvites,
          allowSharedInvites: boardForm.allowSharedInvites,
          defaultSharedInvitationMode: boardForm.defaultSharedInvitationMode,
          inviteExpiresHours,
          sharedInviteMaxUses,
        },
      }).unwrap();
      setNotice({ type: "success", text: t("saveSuccess") });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : t("saveError"),
      });
    } finally {
      setIsSavingBoard(false);
    }
  };

  const handleCreateRole = async () => {
    if (!canManageSettings) {
      setNotice({ type: "info", text: t("restrictedAlert") });
      return;
    }

    const roleName = newRoleName.trim();
    if (!roleName) {
      setNotice({ type: "error", text: t("roleNameRequired") });
      return;
    }

    try {
      setIsCreatingRole(true);
      setNotice(null);
      await createBoardRoleMutation({
        boardId,
        input: { name: roleName },
      }).unwrap();
      setNewRoleName("");
      setNotice({ type: "success", text: t("roleCreateSuccess") });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : t("roleCreateError"),
      });
    } finally {
      setIsCreatingRole(false);
    }
  };

  const startEditingRole = (role: BoardRole) => {
    setEditingRoleId(role.id);
    setRoleDraft(role.id, {
      name: role.name,
      permissions: normalizePermissions(role.permissions),
    });
    setNotice(null);
  };

  const cancelEditingRole = (role: BoardRole) => {
    setEditingRoleId(null);
    setRoleDraft(role.id, {
      name: role.name,
      permissions: normalizePermissions(role.permissions),
    });
  };

  const handleSaveRole = async (role: BoardRole) => {
    if (!canManageSettings) {
      setNotice({ type: "info", text: t("restrictedAlert") });
      return;
    }

    const roleDraft = roleDrafts[role.id] ?? {
      name: role.name,
      permissions: normalizePermissions(role.permissions),
    };
    const roleName = roleDraft.name.trim();
    if (!roleName) {
      setNotice({ type: "error", text: t("roleNameRequired") });
      return;
    }

    if (roleDraft.permissions.length === 0) {
      setNotice({ type: "error", text: t("rolePermissionsRequired") });
      return;
    }

    try {
      setPendingRoleId(role.id);
      setNotice(null);
      await updateBoardRoleMutation({
        boardId,
        roleId: role.id,
        input: { name: roleName, permissions: roleDraft.permissions },
      }).unwrap();
      setEditingRoleId(null);
      setNotice({ type: "success", text: t("roleUpdateSuccess") });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : t("roleUpdateError"),
      });
    } finally {
      setPendingRoleId(null);
    }
  };

  const handleDeleteRole = async (role: BoardRole) => {
    if (!canManageSettings) {
      setNotice({ type: "info", text: t("restrictedAlert") });
      return;
    }

    const confirmed = window.confirm(t("deleteRoleConfirm", { name: role.name }));
    if (!confirmed) {
      return;
    }

    try {
      setPendingRoleId(role.id);
      setNotice(null);
      await deleteBoardRoleMutation({ boardId, roleId: role.id }).unwrap();
      setEditingRoleId((current) => (current === role.id ? null : current));
      setRoleDrafts((current) => {
        const next = { ...current };
        delete next[role.id];
        return next;
      });
      setNotice({ type: "success", text: t("roleDeleteSuccess") });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : t("roleDeleteError"),
      });
    } finally {
      setPendingRoleId(null);
    }
  };

  const toggleRolePermission = (roleId: string, permission: TicketPermission) => {
    const draft = roleDrafts[roleId];
    if (!draft) {
      return;
    }

    const hasPermission = draft.permissions.includes(permission);
    setRoleDraft(roleId, {
      permissions: hasPermission
        ? draft.permissions.filter((item) => item !== permission)
        : [...draft.permissions, permission],
    });
  };

  const handleDeleteBoard = async () => {
    if (!canManageSettings) {
      setNotice({ type: "info", text: t("restrictedAlert") });
      return;
    }

    const confirmed = window.confirm(t("deleteBoardConfirm", { name: board?.title ?? "" }));
    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingBoard(true);
      setNotice(null);
      await deleteBoardMutation({ boardId }).unwrap();
      router.push("/boards");
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : t("deleteBoardError"),
      });
      setIsDeletingBoard(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("subtitle")}
        </Typography>
      </Box>

      {notice ? <Alert severity={notice.type}>{notice.text}</Alert> : null}
      {hasLoadError ? <Alert severity="error">{t("loadError")}</Alert> : null}
      {!canManageSettings ? <Alert severity="info">{t("restrictedAlert")}</Alert> : null}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6">{t("generalSection")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("generalSectionHint")}
            </Typography>
          </Box>

          <TextField
            label={t("titleLabel")}
            value={boardForm.title}
            onChange={(event) => setField("title", event.target.value)}
            disabled={!canManageSettings || isSavingBoard}
            fullWidth
          />

          <TextField
            label={t("descriptionLabel")}
            value={boardForm.description}
            onChange={(event) => setField("description", event.target.value)}
            disabled={!canManageSettings || isSavingBoard}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label={t("logoUrlLabel")}
            value={boardForm.logoUrl}
            onChange={(event) => setField("logoUrl", event.target.value)}
            disabled={!canManageSettings || isSavingBoard}
            fullWidth
          />

          <Stack spacing={1.5}>
            <Typography variant="subtitle1">{t("themeColorLabel")}</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
              <TextField
                label={t("themeColorHexLabel")}
                value={boardForm.themeColor}
                onChange={(event) => setField("themeColor", event.target.value)}
                disabled={!canManageSettings || isSavingBoard}
                fullWidth
              />
              <Box
                component="input"
                type="color"
                aria-label={t("themeColorPickerLabel")}
                value={previewColor}
                disabled={!canManageSettings || isSavingBoard}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setField("themeColor", event.target.value)}
                sx={{
                  width: { xs: "100%", md: 64 },
                  height: 48,
                  p: 0,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor: "transparent",
                  cursor: canManageSettings ? "pointer" : "default",
                }}
              />
              <Button
                variant="outlined"
                onClick={() => setField("themeColor", "")}
                disabled={!canManageSettings || isSavingBoard}
              >
                {t("resetColor")}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t("themeColorHint")}
            </Typography>
            <Box
              sx={{
                minHeight: 88,
                borderRadius: 3,
                px: 2.5,
                py: 2,
                color: "common.white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                background: `linear-gradient(135deg, ${previewColor} 0%, #0f2244 100%)`,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.78 }}>
                {t("previewLabel")}
              </Typography>
              <Typography variant="h6">{boardForm.title || board?.title || t("previewFallback")}</Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle1">{t("invitesSection")}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t("invitesSectionHint")}
              </Typography>
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Checkbox
                  checked={boardForm.allowPersonalInvites}
                  onChange={(event) => setField("allowPersonalInvites", event.target.checked)}
                  disabled={!canManageSettings || isSavingBoard}
                />
                <Box>
                  <Typography variant="body1">{t("allowPersonalInvitesLabel")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("allowPersonalInvitesHint")}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Checkbox
                  checked={boardForm.allowSharedInvites}
                  onChange={(event) => setField("allowSharedInvites", event.target.checked)}
                  disabled={!canManageSettings || isSavingBoard}
                />
                <Box>
                  <Typography variant="body1">{t("allowSharedInvitesLabel")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("allowSharedInvitesHint")}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                  {t("defaultSharedInvitationModeLabel")}
                </Typography>
                <Select
                  value={boardForm.defaultSharedInvitationMode}
                  onChange={(event) =>
                    setField("defaultSharedInvitationMode", event.target.value as "SINGLE_USE" | "MULTI_USE")
                  }
                  disabled={!canManageSettings || isSavingBoard || !boardForm.allowSharedInvites}
                  fullWidth
                >
                  <MenuItem value="SINGLE_USE">{t("singleUse")}</MenuItem>
                  <MenuItem value="MULTI_USE">{t("multiUse")}</MenuItem>
                </Select>
              </Box>

              <TextField
                label={t("inviteExpiresHoursLabel")}
                type="number"
                value={boardForm.inviteExpiresHours}
                onChange={(event) => setField("inviteExpiresHours", event.target.value)}
                disabled={!canManageSettings || isSavingBoard}
                fullWidth
              />

              <TextField
                label={t("sharedInviteMaxUsesLabel")}
                type="number"
                value={boardForm.sharedInviteMaxUses}
                onChange={(event) => setField("sharedInviteMaxUses", event.target.value)}
                disabled={!canManageSettings || isSavingBoard || !boardForm.allowSharedInvites}
                fullWidth
              />
            </Stack>
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={() => void handleSaveBoard()} disabled={!canManageSettings || isSavingBoard}>
              {isSavingBoard ? t("saving") : t("save")}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6">{t("rolesSection")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("rolesSectionHint")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {roleCountText}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label={t("newRoleLabel")}
              value={newRoleName}
              onChange={(event) => setNewRoleName(event.target.value)}
              disabled={!canManageSettings || isCreatingRole}
              fullWidth
            />
            <Button variant="contained" onClick={() => void handleCreateRole()} disabled={!canManageSettings || isCreatingRole}>
              {isCreatingRole ? t("addingRole") : t("addRole")}
            </Button>
          </Stack>

          {roles.length === 0 ? <Alert severity="info">{t("noRoles")}</Alert> : null}

          <Stack spacing={1.5}>
            {roles.map((role, index) => {
              const isEditing = editingRoleId === role.id;
              const isBusy = pendingRoleId === role.id;

              return (
                <Box key={role.id}>
                  {index > 0 ? <Divider sx={{ mb: 1.5 }} /> : null}
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
                    {isEditing ? (
                      <Stack spacing={1.25} sx={{ flex: 1 }}>
                        <TextField
                          value={roleDrafts[role.id]?.name ?? role.name}
                          onChange={(event) => setRoleDraft(role.id, { name: event.target.value })}
                          disabled={!canManageSettings || isBusy}
                          fullWidth
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {t("rolePermissionsLabel")}
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                            {ALL_PERMISSIONS.map((permission) => {
                              const checked = roleDrafts[role.id]?.permissions?.includes(permission) ?? false;

                              return (
                                <Box
                                  key={permission}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    border: "1px solid",
                                    borderColor: checked ? "primary.main" : "divider",
                                    borderRadius: 999,
                                    pr: 1.25,
                                    pl: 0.5,
                                    py: 0.25,
                                  }}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onChange={() => toggleRolePermission(role.id, permission)}
                                    disabled={!canManageSettings || isBusy}
                                    size="small"
                                  />
                                  <Typography variant="body2">{getPermissionLabel(permission)}</Typography>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      </Stack>
                    ) : (
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">{role.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("roleMeta")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                          {normalizePermissions(role.permissions)
                            .map((permission) => getPermissionLabel(permission))
                            .join(", ") || t("noPermissions")}
                        </Typography>
                      </Box>
                    )}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      {isEditing ? (
                        <>
                          <Button variant="contained" onClick={() => void handleSaveRole(role)} disabled={!canManageSettings || isBusy}>
                            {t("saveRole")}
                          </Button>
                          <Button variant="outlined" onClick={() => cancelEditingRole(role)} disabled={isBusy}>
                            {t("cancelEdit")}
                          </Button>
                        </>
                      ) : (
                        <Button variant="outlined" onClick={() => startEditingRole(role)} disabled={!canManageSettings || isBusy}>
                          {t("editRole")}
                        </Button>
                      )}

                      <Button color="error" variant="contained" onClick={() => void handleDeleteRole(role)} disabled={!canManageSettings || isBusy}>
                        {t("deleteRole")}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "error.light" }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" color="error.main">
              {t("dangerZone")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dangerZoneHint")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <Box>
              <Typography variant="subtitle1">{t("deleteBoardTitle")}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t("deleteBoardHint")}
              </Typography>
            </Box>
            <Button
              color="error"
              variant="contained"
              onClick={() => void handleDeleteBoard()}
              disabled={!canManageSettings || isDeletingBoard}
            >
              {isDeletingBoard ? t("deletingBoard") : t("deleteBoard")}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}