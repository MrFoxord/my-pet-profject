"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
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
import { createBoard, getBoards } from "@/lib/api/client";

export default function BoardsPage() {
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState<BoardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const userId = session?.user?.id;

  const loadBoards = async (currentUserId: string) => {
    try {
      setLoading(true);
      const data = await getBoards(currentUserId);
      setBoards(data);
    } catch (error) {
      console.error("load boards error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    void loadBoards(userId);
  }, [status, userId]);

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
        ownerId: userId,
        dashboardRole: "owner",
      });

      setCreateModalOpen(false);
      await loadBoards(userId);
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
            {session?.user?.name ?? session?.user?.email ?? "Пользователь"} · {session?.user?.workRole ?? "CLIENT"} · {session?.user?.monetizationRole ?? "FREE"}
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
      </PageMain>
    </PageRoot>
  );
}
