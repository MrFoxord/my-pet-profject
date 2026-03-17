"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  RolesSelect,
  TicketTypeSelect,
  TicketPrioritySelect,
} from "@/components/ui";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
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
  boardRoleNames?: string[];
  onTicketClick?: (ticket: Ticket) => void;
  onColumnsReorder?: (columnIds: string[]) => void | Promise<void>;
  onRenameColumn?: (columnId: string, title: string) => Promise<boolean> | boolean;
  onDeleteColumn?: (columnId: string, ticketIds: string[]) => Promise<boolean> | boolean;
  onCreateTicket?: (input: {
    columnId: string;
    status: Ticket["status"];
    title: string;
    description?: string;
    type: Ticket["type"];
    priority: Ticket["priority"];
    accessibilityRoles: string[];
    accessibilityIds: string[];
  }) => Promise<Ticket | null>;
  onTicketsReorder?: (
    items: { id: string; status: Ticket["status"]; sortIndex: number; columnId?: string }[]
  ) => void | Promise<void>;
}

export function BoardColumns({
  board,
  boardRoleNames = [],
  onTicketClick,
  onColumnsReorder,
  onRenameColumn,
  onDeleteColumn,
  onCreateTicket,
  onTicketsReorder,
}: BoardColumnsProps) {
  const [columns, setColumns] = useState(board.columns);
  const [tickets, setTickets] = useState(board.tickets ?? []);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<Ticket["status"]>("todo");
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createType, setCreateType] = useState<Ticket["type"]>("task");
  const [createPriority, setCreatePriority] = useState<Ticket["priority"]>("medium");
  const [createRoleAccess, setCreateRoleAccess] = useState<string[]>([]);

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

  const mapColumnToStatus = (title: string): Ticket["status"] => {
    const value = title.toLowerCase();
    if (value.includes("progress") || value.includes("doing") || value.includes("wip")) {
      return "in-progress";
    }
    if (value.includes("done") || value.includes("complete")) {
      return "done";
    }
    return "todo";
  };

  const buildReorderItems = (nextColumns: typeof columns) =>
    nextColumns.flatMap((column) => {
      const status = mapColumnToStatus(column.title);
      return column.ticketIds.map((id, idx) => ({
        id,
        status,
        sortIndex: idx,
        columnId: column.id.startsWith("fallback-") ? undefined : column.id,
      }));
    });

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
      return;
    }

    const activeType = active.data.current?.type;

    if (activeType === "ticket") {
      const activeId = String(active.id);
      const overType = over.data.current?.type;
      const overId = String(over.id);
      const fromColumnId = String(active.data.current?.columnId ?? "");

      let toColumnId = fromColumnId;
      if (overType === "ticket") {
        toColumnId = String(over.data.current?.columnId ?? fromColumnId);
      } else if (overType === "column") {
        toColumnId = overId;
      }

      if (!toColumnId) return;

      let reorderItems: { id: string; status: Ticket["status"]; sortIndex: number; columnId?: string }[] | null = null;

      setColumns((prev) => {
        const next = prev.map((c) => ({ ...c, ticketIds: [...c.ticketIds] }));
        const source = next.find((c) => c.id === fromColumnId);
        const target = next.find((c) => c.id === toColumnId);

        if (!source || !target) return prev;

        const sourceIndex = source.ticketIds.indexOf(activeId);
        if (sourceIndex === -1) return prev;

        if (fromColumnId === toColumnId && overType === "ticket") {
          const overIndex = target.ticketIds.indexOf(overId);
          if (overIndex !== -1 && sourceIndex !== overIndex) {
            target.ticketIds = arrayMove(target.ticketIds, sourceIndex, overIndex);
          }
          reorderItems = buildReorderItems(next);
          return next;
        }

        reorderItems = buildReorderItems(next);
        return next;
      });

      if (onTicketsReorder && reorderItems) {
        void onTicketsReorder(reorderItems);
      }

      return;
    }

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

  const handleCreateTicket = async (columnId: string, columnTitle: string) => {
    if (!onCreateTicket) {
      return;
    }

    setCreateColumnId(columnId);
    setCreateStatus(mapColumnToStatus(columnTitle));
    setCreateTitle("");
    setCreateDescription("");
    setCreateType("task");
    setCreatePriority("medium");
    setCreateRoleAccess([]);
    setCreateOpen(true);
  };

  const submitCreateTicket = async () => {
    if (!onCreateTicket || !createColumnId || !createTitle.trim()) {
      return;
    }

    setCreating(true);
    const created = await onCreateTicket({
      columnId: createColumnId,
      status: createStatus,
      title: createTitle.trim(),
      description: createDescription.trim() || undefined,
      type: createType,
      priority: createPriority,
      accessibilityRoles: createRoleAccess,
      accessibilityIds: [],
    });
    setCreating(false);

    if (!created) return;

    setTickets((prev) => [...prev, created]);
    setColumns((prev) =>
      prev.map((column) =>
        column.id === createColumnId
          ? { ...column, ticketIds: [...column.ticketIds, created.id] }
          : column
      )
    );

    setCreateOpen(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
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
              onCreateTicket={handleCreateTicket}
            />
          ))}
        </ColumnsContainer>
      </SortableContext>

      <Dialog open={createOpen} onClose={() => !creating && setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Создать тикет</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Название"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Описание"
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <TicketTypeSelect value={createType} onChange={setCreateType} />
            <TicketPrioritySelect value={createPriority} onChange={setCreatePriority} />
            <RolesSelect
              value={createRoleAccess}
              onChange={setCreateRoleAccess}
              boardRoleNames={boardRoleNames}
              label="Доступ по ролям"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={creating}>
            Отмена
          </Button>
          <Button
            onClick={submitCreateTicket}
            variant="contained"
            disabled={creating || !createTitle.trim()}
          >
            {creating ? "Создаём..." : "Создать"}
          </Button>
        </DialogActions>
      </Dialog>
    </DndContext>
  );
}