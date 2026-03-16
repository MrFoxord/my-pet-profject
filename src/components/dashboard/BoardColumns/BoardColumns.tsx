"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  type CollisionDetection,
  closestCenter,
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
  onColumnsReorder?: (columnIds: string[]) => void | Promise<void>;
  onRenameColumn?: (columnId: string, title: string) => Promise<boolean> | boolean;
  onDeleteColumn?: (columnId: string, ticketIds: string[]) => Promise<boolean> | boolean;
}

export function BoardColumns({
  board,
  onTicketClick,
  onColumnsReorder,
  onRenameColumn,
  onDeleteColumn,
}: BoardColumnsProps) {
  const [columns, setColumns] = useState(board.columns);
  const [tickets, setTickets] = useState(board.tickets ?? []);
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

  const collisionDetection: CollisionDetection = (args) => {
    const activeType = args.active.data.current?.type;

    if (activeType === "column") {
      const columnDroppables = args.droppableContainers.filter(
        (container) => container.data.current?.type === "column"
      );

      return closestCenter({ ...args, droppableContainers: columnDroppables });
    }

    return closestCenter(args);
  };

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
      let reorderedColumnIds: string[] | null = null;

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

        const next = arrayMove(prev, oldIndex, newIndex);
        reorderedColumnIds = next.map((column) => column.id);
        return next;
      });

      if (reorderedColumnIds && onColumnsReorder) {
        void onColumnsReorder(reorderedColumnIds);
      }
    }

    setActiveId(null);
  };

  const handleRenameColumn = async (columnId: string, currentTitle: string) => {
    const nextTitle = window.prompt("Новое название колонки", currentTitle)?.trim();
    if (!nextTitle || nextTitle === currentTitle) return;

    let canUpdate = true;
    if (onRenameColumn) {
      canUpdate = await onRenameColumn(columnId, nextTitle);
    }

    if (!canUpdate) return;

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, title: nextTitle } : column
      )
    );
  };

  const handleDeleteColumn = async (columnId: string, ticketIds: string[]) => {
    if (columns.length <= 1) {
      window.alert("Нужно оставить хотя бы одну колонку.");
      return;
    }

    const confirmed = window.confirm(
      "Удалить колонку и все тикеты внутри неё? Это действие нельзя отменить."
    );
    if (!confirmed) return;

    let canDelete = true;
    if (onDeleteColumn) {
      canDelete = await onDeleteColumn(columnId, ticketIds);
    }

    if (!canDelete) return;

    setColumns((prev) => prev.filter((column) => column.id !== columnId));
    if (ticketIds.length > 0) {
      setTickets((prev) => prev.filter((ticket) => !ticketIds.includes(ticket.id)));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
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
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
        </ColumnsContainer>
      </SortableContext>
    </DndContext>
  );
}