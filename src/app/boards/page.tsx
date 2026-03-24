"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslations } from "next-intl";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/Loader/Loader";
import CreateBoardModal, {
  CreateBoardPayload,
} from "@/components/home/CreateBoardModal";
import {
  PageRoot,
  PageMain,
  Header,
  HeaderTop,
  Title,
  Subtitle,
  BoardsGrid,
  BoardCard,
  BoardId,
  BoardName,
  BoardDescription,
  BoardMeta,
  AddBoardButton,
} from "@/components/home/styled";
import {
  getUserDefaultState,
  updateDefaultProfile,
} from "@/lib/api/client";
import { WorkRole } from "@/types/user";
import { useCreateBoardMutation, useDeleteBoardMutation, useGetBoardsQuery } from "@/store/api";

export default function BoardsPage() {
  const t = useTranslations("boards");
  const router = useRouter();
  const { data: session, status } = useSession();
    const WORK_ROLE_OPTIONS: { value: WorkRole; label: string }[] = [
      { value: "CLIENT", label: "CLIENT" },
      { value: "EXECUTOR", label: "EXECUTOR" },
      { value: "ORGANIZER", label: "ORGANIZER" },
      { value: "CEO", label: "CEO" },
    ];

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [defaultModalOpen, setDefaultModalOpen] = useState(false);
  const [defaultSaving, setDefaultSaving] = useState(false);
  const [defaultError, setDefaultError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [workRole, setWorkRole] = useState<WorkRole>("CLIENT");
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(null);
  const [displayRoleOverride, setDisplayRoleOverride] = useState<WorkRole | null>(null);

  const userId = session?.user?.id;
  const [createBoardMutation] = useCreateBoardMutation();
  const [deleteBoardMutation] = useDeleteBoardMutation();
  const {
    data: boards = [],
    isLoading: isBoardsLoading,
  } = useGetBoardsQuery(undefined, {
    skip: status !== "authenticated" || !userId,
  });

  const loadDefaultProfileState = async () => {
    try {
      const state = await getUserDefaultState();
      if (state.isDefault) {
        setFirstName(state.firstName ?? "");
        setLastName(state.lastName ?? "");
        setNickname(state.nickname ?? "");
        setWorkRole(state.workRole ?? "CLIENT");
        setDefaultModalOpen(true);
      } else {
        setDefaultModalOpen(false);
      }
    } catch (error) {
      console.error("load default profile state error", error);
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    void loadDefaultProfileState();
  }, [status, userId]);

  const handleSaveDefaultProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setDefaultError(t("profileNameRequired"));
      return;
    }

    try {
      setDefaultSaving(true);
      setDefaultError(null);

      const updated = await updateDefaultProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickname: nickname.trim() || undefined,
        workRole,
      });

      setDisplayNameOverride(updated.name ?? `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim());
      setDisplayRoleOverride(updated.workRole as WorkRole);
      setDefaultModalOpen(updated.isDefault);
    } catch (error) {
      console.error("save default profile error", error);
      setDefaultError(t("profileSaveError"));
    } finally {
      setDefaultSaving(false);
    }
  };

  const handleCreateBoard = async (payload: CreateBoardPayload) => {
    if (!userId) {
      return;
    }

    try {
      setCreating(true);

      await createBoardMutation({
        title: payload.title,
        description: payload.description || null,
        themeColor: payload.themeColor,
        logoUrl: null,
        columns: payload.columns,
        customRoles: payload.customRoles,
        ownerId: userId,
      }).unwrap();

      setCreateModalOpen(false);
    } catch (error) {
      console.error("create board error", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm(t("deleteBoardConfirm"))) {
      return;
    }

    try {
      await deleteBoardMutation({ boardId }).unwrap();
    } catch (error) {
      console.error("delete board error", error);
      window.alert(t("deleteBoardError"));
    }
  };

  if (status === "loading" || (isBoardsLoading && status === "authenticated")) {
    return (
      <PageRoot>
        <PageMain>
          <Loader />
        </PageMain>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <PageMain>
        <Header>
          <HeaderTop>
            <AddBoardButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              {t("addBoard")}
            </AddBoardButton>
            <Title>{t("title")}</Title>
          </HeaderTop>
          <Subtitle>
            {displayNameOverride ?? session?.user?.name ?? session?.user?.email ?? t("userFallback")} · {displayRoleOverride ?? session?.user?.workRole ?? "CLIENT"} · {session?.user?.monetizationRole ?? "FREE"}
          </Subtitle>
        </Header>

        {boards.length === 0 ? (
          <Subtitle>{t("noBoards")}</Subtitle>
        ) : (
          <BoardsGrid>
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/dashboard/${board.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/dashboard/${board.id}`);
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <BoardId>{t("boardLabel")} #{board.id}</BoardId>
                  <Tooltip title={t("deleteBoard")}>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={t("deleteBoard")}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void handleDeleteBoard(board.id);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <BoardName>{board.title}</BoardName>
                {board.description && (
                  <BoardDescription>{board.description}</BoardDescription>
                )}
                <BoardMeta>
                  {t("role")}: {board.dashboardRole ?? "member"} · {board.tickets?.length ?? 0} {t("tickets")}
                </BoardMeta>
              </BoardCard>
            ))}
          </BoardsGrid>
        )}

        <CreateBoardModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateBoard}
          creating={creating}
        />

        <Dialog open={defaultModalOpen} disableEscapeKeyDown>
          <DialogTitle>{t("profileRequiredTitle")}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: 360 }}>
              <TextField
                label={t("firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label={t("lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextField
                label={t("nickname")}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                helperText={t("nicknameHelper")}
              />
              <TextField
                select
                label={t("customRole")}
                value={workRole}
                onChange={(e) => setWorkRole(e.target.value as WorkRole)}
              >
                {WORK_ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {defaultError ? <Typography color="error">{defaultError}</Typography> : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveDefaultProfile} variant="contained" disabled={defaultSaving}>
              {defaultSaving ? t("savingProfile") : t("saveProfile")}
            </Button>
          </DialogActions>
        </Dialog>
      </PageMain>
    </PageRoot>
  );
}
