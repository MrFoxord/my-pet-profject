"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Board, Ticket } from "@/types";
import { ColumnsContainer } from "./styled";
import { BoardColumnView } from "./BoardColumnView";

interface BoardColumnsProps {
  board: Board;
  onTicketClick?: (ticket: Ticket) => void;
}

export function BoardColumns({ board, onTicketClick }: BoardColumnsProps) {
  const [columns, setColumns] = useState(board.columns);
  const [tickets] = useState(board.tickets ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const ticketsById = useMemo(
    () =>
      tickets.reduce<Record<string, Ticket>>((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {}),
    [tickets]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    if (activeType !== "ticket") return;

    const activeId = String(active.id);
    const fromColumnId = String(active.data.current?.columnId);

    const toColumnId =
      overType === "ticket"
        ? String(over.data.current?.columnId)
        : String(over.id);

    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, ticketIds: [...c.ticketIds] }));

      const fromCol = next.find((c) => c.id === fromColumnId);
      const toCol = next.find((c) => c.id === toColumnId);
      if (!fromCol || !toCol) return prev;

      const fromIndex = fromCol.ticketIds.indexOf(activeId);
      if (fromIndex === -1) return prev;
      fromCol.ticketIds.splice(fromIndex, 1);

      if (overType === "ticket") {
        const overTicketId = String(over.id);
        const toIndex = toCol.ticketIds.indexOf(overTicketId);
        const insertIndex =
          toIndex === -1 ? toCol.ticketIds.length : toIndex;
        toCol.ticketIds.splice(insertIndex, 0, activeId);
      } else {
        toCol.ticketIds.push(activeId);
      }

      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeType = active.data.current?.type;
    if (activeType === "column") {
      const fromId = String(active.id);

      const overType = over.data.current?.type;
      const overIdRaw = String(over.id);

      setColumns((prev) => {
        let toId: string | null = null;

        if (overType === "column") {
          toId = overIdRaw;
        } else if (overType === "ticket") {
          const ticketId = overIdRaw;
          const col = prev.find((c) => c.ticketIds.includes(ticketId));
          toId = col?.id ?? null;
        }

        if (!toId) return prev;

        const oldIndex = prev.findIndex((c) => c.id === fromId);
        const newIndex = prev.findIndex((c) => c.id === toId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return prev;
        }

        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <ColumnsContainer>
          {columns.map((column) => (
            <BoardColumnView
              key={column.id}
              column={column}
              tickets={column.ticketIds
                .map((id) => ticketsById[id])
                .filter(Boolean)}
              onTicketClick={onTicketClick}
            />
          ))}
        </ColumnsContainer>
      </SortableContext>
    </DndContext>
  );
}