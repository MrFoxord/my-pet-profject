"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
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
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
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
import { BoardDto } from "@/types/dashboard";
import {
  createBoard,
  getBoards,
  getUserDefaultState,
  updateDefaultProfile,
} from "@/lib/api/client";
import { WorkRole } from "@/types/user";

const WORK_ROLE_OPTIONS: { value: WorkRole; label: string }[] = [
  { value: "CLIENT", label: "Клиент" },
  { value: "EXECUTOR", label: "Исполнитель" },
  { value: "ORGANIZER", label: "Организатор" },
  { value: "CEO", label: "CEO" },
];

export default function BoardsPage() {
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState<BoardDto[]>([]);
  const [loading, setLoading] = useState(true);
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

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error("load boards error", error);
    } finally {
      setLoading(false);
    }
  };

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

    void loadBoards();
    void loadDefaultProfileState();
  }, [status, userId]);

  const handleSaveDefaultProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setDefaultError("Имя и фамилия обязательны");
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
      setDefaultError("Не удалось сохранить профиль. Проверь никнейм и попробуй снова.");
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

      await createBoard({
        title: payload.title,
        description: payload.description || null,
        themeColor: payload.themeColor,
        logoUrl: null,
        columns: payload.columns,
        customRoles: payload.customRoles,
        ownerId: userId,
      });

      setCreateModalOpen(false);
      await loadBoards();
    } catch (error) {
      console.error("create board error", error);
    } finally {
      setCreating(false);
    }
  };

  if (status === "loading" || (loading && status === "authenticated")) {
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
              Добавить доску
            </AddBoardButton>
            <Title>Ваши доски</Title>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              Выйти
            </Button>
          </HeaderTop>
          <Subtitle>
            {displayNameOverride ?? session?.user?.name ?? session?.user?.email ?? "Пользователь"} · {displayRoleOverride ?? session?.user?.workRole ?? "CLIENT"} · {session?.user?.monetizationRole ?? "FREE"}
          </Subtitle>
        </Header>

        {boards.length === 0 ? (
          <Subtitle>У вас пока нет привязанных дашбордов.</Subtitle>
        ) : (
          <BoardsGrid>
            {boards.map((board) => (
              <Link key={board.id} href={`/dashboard/${board.id}`}>
                <BoardCard>
                  <BoardId>Board #{board.id}</BoardId>
                  <BoardName>{board.title}</BoardName>
                  {board.description && (
                    <BoardDescription>{board.description}</BoardDescription>
                  )}
                  <BoardMeta>
                    Роль: {board.dashboardRole ?? "member"} · {board.tickets?.length ?? 0} тикетов
                  </BoardMeta>
                </BoardCard>
              </Link>
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
          <DialogTitle>Заполните профиль</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: 360 }}>
              <TextField
                label="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextField
                label="Никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                helperText="Уникальный псевдоним"
              />
              <TextField
                select
                label="Роль"
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
              {defaultSaving ? "Сохраняем..." : "Сохранить"}
            </Button>
          </DialogActions>
        </Dialog>
      </PageMain>
    </PageRoot>
  );
}
