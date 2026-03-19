"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toolbar } from "@mui/material";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardClientProps, Ticket } from "@/types";
import { Loader } from "../ui/Loader/Loader";
import { TicketModal } from "../dashboard/TicketModal/TicketModal";
import { BoardColumns } from "@/components/dashboard/BoardColumns/BoardColumns";
import {
  createTicket,
  deleteTicket,
  deleteBoardColumn,
  getBoardRoles,
  renameBoardColumn,
  reorderBoardColumns,
  reorderBoardTickets,
  updateTicket,
} from "@/lib/api/client";
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

export default function DashboardClient({
  board,
  children,
}: DashboardClientProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [boardRoleNames, setBoardRoleNames] = useState<string[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        const roles = await getBoardRoles(board.id);
        if (!active) return;
        setBoardRoleNames(roles.map((role) => role.name));
      } catch (error) {
        console.error("failed to load board roles", error);
      }
    };

    void loadRoles();

    return () => {
      active = false;
    };
  }, [board.id]);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTicket(null);
  };

  const handleSaveTicket = async (
    ticketId: string,
    payload: {
      description: string;
      status: Ticket["status"];
      priority: Ticket["priority"];
      type: Ticket["type"];
      accessPolicy: Ticket["accessPolicy"];
    }
  ) => {
    try {
      const updated = await updateTicket(board.id, ticketId, {
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        type: payload.type,
        accessPolicy: payload.accessPolicy,
      });

      if (updated) {
        setSelectedTicket(updated);
        router.refresh();
      }

      return updated;
    } catch (error) {
      console.error("failed to update ticket", error);
      return null;
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteTicket(board.id, ticketId);
      setSelectedTicket(null);
      setModalOpen(false);
      router.refresh();
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
      await reorderBoardColumns(board.id, columnIds);
    } catch (error) {
      console.error("failed to persist columns order", error);
    }
  };

  const handleRenameColumn = async (columnId: string, title: string) => {
    if (columnId.startsWith("fallback-")) {
      return true;
    }

    try {
      await renameBoardColumn(board.id, columnId, title);
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
      await deleteBoardColumn(board.id, columnId, ticketIds);
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
      return await createTicket({
        boardId: board.id,
        title: input.title,
        description: input.description,
        status: input.status,
        type: input.type,
        priority: input.priority,
        columnId: input.columnId,
        accessPolicy: input.accessPolicy,
      });
    } catch (error) {
      console.error("failed to create ticket", error);
      return null;
    }
  };

  const handleTicketsReorder = async (
    items: { id: string; status: Ticket["status"]; sortIndex: number; columnId?: string }[]
  ) => {
    try {
      await reorderBoardTickets(board.id, { items });
    } catch (error) {
      console.error("failed to persist tickets order", error);
    }
  };

  return (
    <Root $bg={board.themeColor}>
      <Sidebar boardId={board.id} themeColor={board.themeColor} />

      <Main>
        <Topbar boardTitle={board.title} boardLogo={board.logoUrl} />
        <Toolbar />
        <Content>
          <BoardHeader>
            {board.logoUrl && (
              <BoardAvatar src={board.logoUrl} alt={board.title} />
            )}
            <BoardTitle variant="h6">{board.title}</BoardTitle>
          </BoardHeader>

          {board.description && (
            <BoardDescription variant="body2" color="text.secondary">
              {board.description}
            </BoardDescription>
          )}

          {!isHydrated && <Loader />}

          {board.tickets && board.columns ? (
            isHydrated ? (
              <TicketsWrapper>
                <BoardColumns
                  board={board}
                  boardRoleNames={boardRoleNames}
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

          {selectedTicket && (
            <TicketModal
              key={selectedTicket.id}
              ticket={selectedTicket}
              open={modalOpen}
              onClose={handleModalClose}
              boardRoleNames={boardRoleNames}
              onSaveTicket={handleSaveTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {children}
        </Content>
      </Main>
    </Root>
  );
}