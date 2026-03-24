"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardClientProps, Ticket } from "@/types";
import { Loader } from "../ui/Loader/Loader";
import { TicketModal } from "../dashboard/TicketModal/TicketModal";
import { BoardColumns } from "@/components/dashboard/BoardColumns/BoardColumns";
import {
  appApi,
  useCreateBoardColumnMutation,
  useCreateTicketCommentMutation,
  useCreateTicketMutation,
  useDeleteBoardColumnMutation,
  useDeleteTicketMutation,
  useGetBoardByIdQuery,
  useGetBoardRolesQuery,
  useGetBoardTicketByIdQuery,
  useRenameBoardColumnMutation,
  useReorderBoardColumnsMutation,
  useReorderBoardTicketsMutation,
  useUpdateTicketMutation,
} from "@/store/api";
import {
  Root,
  Main,
  Content,
  BoardHeader,
  BoardAvatar,
  BoardTitle,
  BoardDescription,
  TicketsWrapper,
  EmptyBoardText,
} from "./styled";
import { Button } from "@/components/ui";
import { useSocket } from "@/contexts/SocketContext";
import { useSession } from "next-auth/react";
import { closeTicketModal, openTicketModal, selectBoardUiState } from "@/store/slices/dashboardUiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type BoardRealtimeEvent = {
  boardId: string;
  actorUserId?: string;
  reason?: string;
};

type TicketRealtimeEvent = {
  boardId: string;
  ticketId: string;
  actorUserId?: string;
  action: "created" | "updated" | "deleted" | "reordered";
  source?: "ticket" | "comment";
};

export default function DashboardClient({
  board,
  children,
}: DashboardClientProps) {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [remoteBoardPulse, setRemoteBoardPulse] = useState(0);
  const [remoteModalPulse, setRemoteModalPulse] = useState(0);
  const [remoteMovedTicketIds, setRemoteMovedTicketIds] = useState<Record<string, number>>({});
  const remoteMovedTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const boardId = board.id;

  const { data: liveBoardData } = useGetBoardByIdQuery(boardId);
  const liveBoard = liveBoardData ?? board;
  const remoteMovedTicketIdList = useMemo(
    () => Object.keys(remoteMovedTicketIds),
    [remoteMovedTicketIds]
  );

  const { data: rolesData } = useGetBoardRolesQuery(boardId);
  const boardRoleNames = useMemo(
    () => (rolesData ?? []).map((role) => role.name),
    [rolesData]
  );

  const boardUi = useAppSelector((state) => selectBoardUiState(state, boardId));
  const selectedTicketId = boardUi.selectedTicketId;
  const modalOpen = boardUi.isTicketModalOpen;

  const { data: selectedTicketFromApi } = useGetBoardTicketByIdQuery(
    { boardId, ticketId: selectedTicketId ?? "" },
    { skip: !selectedTicketId || !modalOpen }
  );

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) {
      return null;
    }

    const fromBoard = (liveBoard.tickets ?? []).find((ticket) => ticket.id === selectedTicketId);
    return selectedTicketFromApi ?? fromBoard ?? null;
  }, [liveBoard.tickets, selectedTicketFromApi, selectedTicketId]);

  const [updateTicketMutation] = useUpdateTicketMutation();
  const [createTicketCommentMutation] = useCreateTicketCommentMutation();
  const [deleteTicketMutation] = useDeleteTicketMutation();
  const [reorderBoardColumnsMutation] = useReorderBoardColumnsMutation();
  const [renameBoardColumnMutation] = useRenameBoardColumnMutation();
  const [deleteBoardColumnMutation] = useDeleteBoardColumnMutation();
  const [createTicketMutation] = useCreateTicketMutation();
  const [reorderBoardTicketsMutation] = useReorderBoardTicketsMutation();
  const [createBoardColumnMutation] = useCreateBoardColumnMutation();

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit("subscribe-board", { boardId });

    const handleBoardStateChanged = (event: BoardRealtimeEvent) => {
      if (event.boardId !== boardId) {
        return;
      }

      if (event.actorUserId && event.actorUserId === session?.user?.id) {
        return;
      }

      setRemoteBoardPulse((prev) => prev + 1);

      dispatch(appApi.util.invalidateTags([{ type: "Board", id: boardId }]));
    };

    const handleTicketStateChanged = (event: TicketRealtimeEvent) => {
      if (event.boardId !== boardId) {
        return;
      }

      if (event.actorUserId && event.actorUserId === session?.user?.id) {
        return;
      }

      if (event.action === "reordered") {
        setRemoteMovedTicketIds((prev) => ({
          ...prev,
          [event.ticketId]: Date.now(),
        }));

        const existingTimeout = remoteMovedTimeoutsRef.current[event.ticketId];
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        remoteMovedTimeoutsRef.current[event.ticketId] = setTimeout(() => {
          setRemoteMovedTicketIds((prev) => {
            const next = { ...prev };
            delete next[event.ticketId];
            return next;
          });
          delete remoteMovedTimeoutsRef.current[event.ticketId];
        }, 1400);
      }

      if (selectedTicketId && selectedTicketId === event.ticketId) {
        setRemoteModalPulse((prev) => prev + 1);
      }

      dispatch(
        appApi.util.invalidateTags([{ type: "BoardTicket", id: `${boardId}:${event.ticketId}` }])
      );

      if (event.source === "comment") {
        return;
      }

      dispatch(appApi.util.invalidateTags([{ type: "Board", id: boardId }]));
    };

    socket.on("board-state-changed", handleBoardStateChanged);
    socket.on("ticket-state-changed", handleTicketStateChanged);

    return () => {
      socket.emit("unsubscribe-board", { boardId });
      socket.off("board-state-changed", handleBoardStateChanged);
      socket.off("ticket-state-changed", handleTicketStateChanged);
      Object.values(remoteMovedTimeoutsRef.current).forEach((timeoutId) => clearTimeout(timeoutId));
      remoteMovedTimeoutsRef.current = {};
    };
  }, [boardId, dispatch, selectedTicketId, session?.user?.id, socket]);

  useEffect(() => {
    if (!modalOpen || !selectedTicketId) {
      return;
    }

    if (selectedTicketFromApi === null) {
      dispatch(closeTicketModal({ boardId }));
    }
  }, [boardId, dispatch, modalOpen, selectedTicketFromApi, selectedTicketId]);

  const handleTicketClick = (ticket: Ticket) => {
    dispatch(openTicketModal({ boardId, ticketId: ticket.id }));
  };

  const handleModalClose = () => {
    dispatch(closeTicketModal({ boardId }));
  };

  const handleSaveTicket = async (
    ticketId: string,
    payload: {
      description?: string;
      status?: Ticket["status"];
      priority?: Ticket["priority"];
      type?: Ticket["type"];
      estimate?: NonNullable<Ticket["estimate"]>;
      accessPolicy?: Ticket["accessPolicy"];
    }
  ) => {
    try {
      const updated = await updateTicketMutation({
        boardId,
        ticketId,
        input: {
          ...(payload.description !== undefined ? { description: payload.description } : {}),
          ...(payload.status !== undefined ? { status: payload.status } : {}),
          ...(payload.priority !== undefined ? { priority: payload.priority } : {}),
          ...(payload.type !== undefined ? { type: payload.type } : {}),
          ...(payload.estimate ? { estimate: payload.estimate } : {}),
          ...(payload.accessPolicy !== undefined ? { accessPolicy: payload.accessPolicy } : {}),
        },
      }).unwrap();

      return updated;
    } catch (error) {
      console.error("failed to update ticket", error);
      return null;
    }
  };

  const handleCreateComment = async (ticketId: string, body: string) => {
    try {
      return await createTicketCommentMutation({ boardId, ticketId, body }).unwrap();
    } catch (error) {
      console.error("failed to create comment", error);
      return null;
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteTicketMutation({ boardId, ticketId }).unwrap();
      dispatch(closeTicketModal({ boardId }));
      return true;
    } catch (error) {
      console.error("failed to delete ticket", error);
      return false;
    }
  };

  const handleColumnsReorder = async (columnIds: string[]) => {
    if (columnIds.some((columnId) => columnId.startsWith("fallback-"))) {
      return;
    }

    try {
      await reorderBoardColumnsMutation({ boardId, columnIds }).unwrap();
    } catch (error) {
      console.error("failed to persist columns order", error);
    }
  };

  const handleRenameColumn = async (columnId: string, title: string) => {
    if (columnId.startsWith("fallback-")) {
      return true;
    }

    try {
      await renameBoardColumnMutation({ boardId, columnId, title }).unwrap();
      return true;
    } catch (error) {
      console.error("failed to rename column", error);
      return false;
    }
  };

  const handleDeleteColumn = async (columnId: string, ticketIds: string[]) => {
    if (columnId.startsWith("fallback-")) {
      return true;
    }

    try {
      await deleteBoardColumnMutation({ boardId, columnId, ticketIds }).unwrap();
      return true;
    } catch (error) {
      console.error("failed to delete column", error);
      return false;
    }
  };

  const handleCreateTicket = async (input: {
    columnId: string;
    status: Ticket["status"];
    title: string;
    description?: string;
    type: Ticket["type"];
    priority: Ticket["priority"];
    accessPolicy?: Ticket["accessPolicy"];
  }) => {
    if (input.columnId.startsWith("fallback-")) {
      window.alert("Сначала создайте реальные колонки в базе данных для этой доски.");
      return null;
    }

    try {
      return await createTicketMutation({
        boardId,
        title: input.title,
        description: input.description,
        status: input.status,
        type: input.type,
        priority: input.priority,
        columnId: input.columnId,
        accessPolicy: input.accessPolicy,
      }).unwrap();
    } catch (error) {
      console.error("failed to create ticket", error);
      return null;
    }
  };

  const handleTicketsReorder = async (
    items: { id: string; status: Ticket["status"]; sortIndex: number; columnId?: string }[]
  ) => {
    try {
      await reorderBoardTicketsMutation({ boardId, payload: { items } }).unwrap();
    } catch (error) {
      console.error("failed to persist tickets order", error);
    }
  };

  const handleCreateColumn = async () => {
    const title = window.prompt("Название новой колонки", "Новая колонка");
    if (!title?.trim()) {
      return;
    }

    try {
      setIsCreatingColumn(true);
      const created = await createBoardColumnMutation({ boardId, title: title.trim() }).unwrap();
      if (!created) {
        window.alert("Не удалось создать колонку");
        return;
      }
    } catch (error) {
      console.error("failed to create column", error);
      window.alert("Не удалось создать колонку. Попробуйте снова.");
    } finally {
      setIsCreatingColumn(false);
    }
  };

  return (
    <Root $bg={liveBoard.themeColor}>
      <Sidebar boardId={liveBoard.id} themeColor={liveBoard.themeColor} />

      <Main>
        <Content>
          <BoardHeader $remotePulseToken={remoteBoardPulse}>
            {liveBoard.logoUrl && (
              <BoardAvatar src={liveBoard.logoUrl} alt={liveBoard.title} />
            )}
            <BoardTitle variant="h6">{liveBoard.title}</BoardTitle>
          </BoardHeader>

          {liveBoard.description && (
            <BoardDescription variant="body2" color="text.secondary">
              {liveBoard.description}
            </BoardDescription>
          )}

          <Button
            size="small"
            variant="contained"
            onClick={() => void handleCreateColumn()}
            disabled={isCreatingColumn}
            sx={{ mb: 2 }}
          >
            {isCreatingColumn ? "Добавление..." : "Добавить колонку"}
          </Button>

          {!isHydrated && <Loader />}

          {liveBoard.tickets && liveBoard.columns ? (
            isHydrated ? (
              <TicketsWrapper>
                <BoardColumns
                  board={liveBoard}
                  boardRoleNames={boardRoleNames}
                  remoteMovedTicketIds={remoteMovedTicketIdList}
                  onTicketClick={handleTicketClick}
                  onColumnsReorder={handleColumnsReorder}
                  onRenameColumn={handleRenameColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onCreateTicket={handleCreateTicket}
                  onTicketsReorder={handleTicketsReorder}
                />
              </TicketsWrapper>
            ) : null
          ) : (
            <EmptyBoardText>No tickets in this board yet</EmptyBoardText>
          )}

          {selectedTicket && modalOpen && (
            <TicketModal
              key={selectedTicket.id}
              ticket={selectedTicket}
              open={modalOpen}
              onClose={handleModalClose}
              boardRoleNames={boardRoleNames}
              currentUserRole={liveBoard.currentUserRole}
              currentUserCustomRoleName={liveBoard.currentUserCustomRoleName}
              remoteUpdateVersion={remoteModalPulse}
              onSaveTicket={handleSaveTicket}
              onCreateComment={handleCreateComment}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {children}
        </Content>
      </Main>
    </Root>
  );
}