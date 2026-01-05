"use client";

import { useMemo } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardColumn, Ticket } from "@/types";
import TickerCard from "../TickerCard/TicketCard";
import {
  ColumnWrapper,
  ColumnCard,
  ColumnHeader,
  ColumnTitle,
  ColumnTicketList,
} from "./styled";

interface BoardColumnViewProps {
  column: BoardColumn;
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

export function BoardColumnView({
  column,
  tickets,
  onTicketClick,
}: BoardColumnViewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          ...transform,
          scaleY: 1, 
        })
      : undefined,
    transition,
  };

  const ticketIds = useMemo(() => tickets.map((t) => t.id), [tickets]);

  return (
    <ColumnWrapper ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ColumnCard>
        <ColumnHeader>
          <ColumnTitle variant="subtitle2">{column.title}</ColumnTitle>
        </ColumnHeader>

        <SortableContext
          items={ticketIds}
          strategy={verticalListSortingStrategy}
        >
          <ColumnTicketList>
            {tickets.map((ticket) => (
              <SortableTicketCard
                key={ticket.id}
                ticket={ticket}
                columnId={column.id}
                onTicketClick={onTicketClick}
              />
            ))}
          </ColumnTicketList>
        </SortableContext>
      </ColumnCard>
    </ColumnWrapper>
  );
}

interface SortableTicketCardProps {
  ticket: Ticket;
  columnId: string;
  onTicketClick?: (ticket: Ticket) => void;
}

function SortableTicketCard({
  ticket,
  columnId,
  onTicketClick,
}: SortableTicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: ticket.id,
    data: { type: "ticket", columnId },
  });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          ...transform,
          scaleY: 1,
        })
      : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TickerCard ticket={ticket} onClick={onTicketClick} />
    </div>
  );
}