"use client";

import { Ticket, TicketListProps } from "@/types";
import TickerCard from "../TickerCard/TicketCard";
import { ListContainer, EmptyState } from "./styled";

export default function TicketList({
  tickets,
  onTicketRendered,
  onTicketClick,
}: TicketListProps) {
  if (!tickets || tickets.length === 0) {
    return <EmptyState>No tickets yet</EmptyState>;
  }

  return (
    <ListContainer>
      {tickets.map((ticket: Ticket) => (
        <TickerCard
          key={ticket.id}
          ticket={ticket}
          onRender={onTicketRendered}
          onClick={onTicketClick}
        />
      ))}
    </ListContainer>
  );
}