"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardColumn, Ticket } from "@/types";
import TickerCard from "../TickerCard/TicketCard";
import ActionDialog from "@/components/ui/ActionDialog/ActionDialog";
import {
  ColumnWrapper,
  ColumnCard,
  ColumnHeader,
  ColumnTitle,
  ColumnTicketList,
  ColumnActions,
  AddTicketButton,
} from "./styled";

interface BoardColumnViewProps {
  column: BoardColumn;
  tickets: Ticket[];
  movingOutTicketIdSet?: Set<string>;
  movingInTicketIdSet?: Set<string>;
  onTicketClick?: (ticket: Ticket) => void;
  onRenameColumn?: (columnId: string, currentTitle: string) => Promise<void> | void;
  onDeleteColumn?: (columnId: string, ticketIds: string[]) => Promise<void> | void;
  onCreateTicket?: (columnId: string, columnTitle: string) => Promise<void> | void;
}

export function BoardColumnView({
  column,
  tickets,
  movingOutTicketIdSet,
  movingInTicketIdSet,
  onTicketClick,
  onRenameColumn,
  onDeleteColumn,
  onCreateTicket,
}: BoardColumnViewProps) {
  const t = useTranslations("boardColumns");
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
  const actions = useMemo(
    () => ({
      [t("renameColumn")]: async () => {
        if (!onRenameColumn) return;
        await onRenameColumn(column.id, column.title);
      },
      [t("deleteColumn")]: async () => {
        if (!onDeleteColumn) return;
        await onDeleteColumn(column.id, ticketIds);
      },
      [t("addTicket")]: async () => {
        if (!onCreateTicket) return;
        await onCreateTicket(column.id, column.title);
      },
    }),
    [column.id, column.title, onCreateTicket, onDeleteColumn, onRenameColumn, t, ticketIds]
  );

  return (
    <ColumnWrapper ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ColumnCard>
        <ColumnHeader>
          <ColumnTitle variant="subtitle2">{column.title}</ColumnTitle>
          <ColumnActions>
            <AddTicketButton
              type="button"
              aria-label={t("addTicket")}
              onClick={() => void onCreateTicket?.(column.id, column.title)}
            >
              +
            </AddTicketButton>
            <ActionDialog
              title={t("actionsDialogTitle", { column: column.title })}
              actions={actions}
              iconButtonLabel={t("openActions")}
            />
          </ColumnActions>
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
                moveTransitionPhase={
                  movingOutTicketIdSet?.has(ticket.id)
                    ? "out"
                    : movingInTicketIdSet?.has(ticket.id)
                      ? "in"
                      : undefined
                }
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
  moveTransitionPhase?: "out" | "in";
  onTicketClick?: (ticket: Ticket) => void;
}

function SortableTicketCard({
  ticket,
  columnId,
  moveTransitionPhase,
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
      <TickerCard ticket={ticket} onClick={onTicketClick} moveTransitionPhase={moveTransitionPhase} />
    </div>
  );
}