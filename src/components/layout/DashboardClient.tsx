"use client";

import { useEffect, useState } from "react";
import { Toolbar } from "@mui/material";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardClientProps, Ticket } from "@/types";
import { Loader } from "../ui/Loader/Loader";
import { TicketModal } from "../dashboard/TicketModal/TicketModal";
import { BoardColumns } from "@/components/dashboard/BoardColumns/BoardColumns";
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
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTicket(null);
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
                <BoardColumns board={board} onTicketClick={handleTicketClick} />
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
            />
          )}

          {children}
        </Content>
      </Main>
    </Root>
  );
}