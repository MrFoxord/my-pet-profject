"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
import { Board, Ticket, TicketAccessPolicy, DEFAULT_ACCESS_POLICY } from "@/types";
import { TicketStatus, TicketType, TicketPriority } from "@/shared/tickets";
import { ColumnsContainer } from "./styled";
import { BoardColumnView } from "./BoardColumnView";

interface BoardColumnsProps {
  board: Board;
  boardRoleNames?: string[];
  remoteMovedTicketIds?: string[];
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
    accessPolicy?: TicketAccessPolicy;
  }) => Promise<Ticket | null>;
  onTicketsReorder?: (
    items: { id: string; status: Ticket["status"]; sortIndex: number; columnId?: string }[]
  ) => void | Promise<void>;
}

export function BoardColumns({
  board,
  boardRoleNames = [],
  remoteMovedTicketIds = [],
  onTicketClick,
  onColumnsReorder,
  onRenameColumn,
  onDeleteColumn,
  onCreateTicket,
  onTicketsReorder,
}: BoardColumnsProps) {
  const t = useTranslations("boardColumns");
  const canManageTicketAccess =
    board.currentUserRole === "OWNER" || board.currentUserRole === "ADMIN";

  const [columns, setColumns] = useState(board.columns);
  const [tickets, setTickets] = useState(board.tickets ?? []);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<Ticket["status"]>(TicketStatus.TODO);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createType, setCreateType] = useState<Ticket["type"]>(TicketType.TASK);
  const [createPriority, setCreatePriority] = useState<Ticket["priority"]>(TicketPriority.MEDIUM);
  const [createAccessPolicy, setCreateAccessPolicy] = useState<TicketAccessPolicy>(DEFAULT_ACCESS_POLICY);

  const [movingOutTicketIds, setMovingOutTicketIds] = useState<Record<string, true>>({});
  const [movingInTicketIds, setMovingInTicketIds] = useState<Record<string, true>>({});
  const moveOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveInTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncBoardState = useCallback((nextBoard: Board) => {
    setColumns(nextBoard.columns);
    setTickets(nextBoard.tickets ?? []);
  }, []);

  useEffect(() => {
    const movedIds = remoteMovedTicketIds.filter((ticketId) =>
      board.tickets?.some((ticket) => ticket.id === ticketId)
    );

    if (!movedIds.length) {
      moveOutTimeoutRef.current = setTimeout(() => {
        syncBoardState(board);
      }, 0);
      return () => {
        if (moveOutTimeoutRef.current) {
          clearTimeout(moveOutTimeoutRef.current);
          moveOutTimeoutRef.current = null;
        }
      };
    }

    if (moveOutTimeoutRef.current) {
      clearTimeout(moveOutTimeoutRef.current);
    }
    if (moveInTimeoutRef.current) {
      clearTimeout(moveInTimeoutRef.current);
    }

    moveOutTimeoutRef.current = setTimeout(() => {
      setMovingInTicketIds({});
      setMovingOutTicketIds(
        Object.fromEntries(movedIds.map((id) => [id, true])) as Record<string, true>
      );

      moveOutTimeoutRef.current = setTimeout(() => {
        syncBoardState(board);
        setMovingOutTicketIds({});
        setMovingInTicketIds(
          Object.fromEntries(movedIds.map((id) => [id, true])) as Record<string, true>
        );

        moveInTimeoutRef.current = setTimeout(() => {
          setMovingInTicketIds({});
        }, 220);
      }, 140);
    }, 0);

    return () => {
      if (moveOutTimeoutRef.current) {
        clearTimeout(moveOutTimeoutRef.current);
        moveOutTimeoutRef.current = null;
      }
      if (moveInTimeoutRef.current) {
        clearTimeout(moveInTimeoutRef.current);
        moveInTimeoutRef.current = null;
      }
    };
  }, [board, remoteMovedTicketIds, syncBoardState]);

  useEffect(() => {
    return () => {
      if (moveOutTimeoutRef.current) {
        clearTimeout(moveOutTimeoutRef.current);
      }
      if (moveInTimeoutRef.current) {
        clearTimeout(moveInTimeoutRef.current);
      }
    };
  }, []);

  const ticketsById = useMemo(
    () =>
      tickets.reduce<Record<string, Ticket>>((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {}),
    [tickets]
  );

  const movingOutTicketIdSet = useMemo(
    () => new Set(Object.keys(movingOutTicketIds)),
    [movingOutTicketIds]
  );
  const movingInTicketIdSet = useMemo(
    () => new Set(Object.keys(movingInTicketIds)),
    [movingInTicketIds]
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
    if (
      value.includes("progress") ||
      value.includes("doing") ||
      value.includes("wip") ||
      value.includes("работ") ||
      value.includes("робот")
    ) {
      return TicketStatus.IN_PROGRESS;
    }
    if (
      value.includes("done") ||
      value.includes("complete") ||
      value.includes("готов") ||
      value.includes("заверш") ||
      value.includes("викон")
    ) {
      return TicketStatus.DONE;
    }
    return TicketStatus.TODO;
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
          const insertIndex = toIndex === -1 ? toCol.ticketIds.length : toIndex;
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
      const nextTitle = window.prompt(t("renameColumnPrompt"), currentTitle)?.trim();
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
        window.alert(t("keepAtLeastOneColumn"));
        return;
      }

      const confirmed = window.confirm(t("deleteColumnConfirm"));
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
      setCreateType(TicketType.TASK);
      setCreatePriority(TicketPriority.MEDIUM);
      setCreateAccessPolicy(DEFAULT_ACCESS_POLICY);
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
        accessPolicy: canManageTicketAccess ? createAccessPolicy : undefined,
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
                movingOutTicketIdSet={movingOutTicketIdSet}
                movingInTicketIdSet={movingInTicketIdSet}
                onTicketClick={onTicketClick}
                onRenameColumn={handleRenameColumn}
                onDeleteColumn={handleDeleteColumn}
                onCreateTicket={handleCreateTicket}
              />
            ))}
          </ColumnsContainer>
        </SortableContext>

        <Dialog open={createOpen} onClose={() => !creating && setCreateOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{t("createTicketTitle")}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label={t("ticketNameLabel")}
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={t("ticketDescriptionLabel")}
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TicketTypeSelect value={createType} onChange={setCreateType} />
              <TicketPrioritySelect value={createPriority} onChange={setCreatePriority} />
              {canManageTicketAccess ? (
                <>
                  <RolesSelect
                    value={createAccessPolicy.view}
                    onChange={(roles) => setCreateAccessPolicy({ ...createAccessPolicy, view: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("permissionView")}
                  />
                  <RolesSelect
                    value={createAccessPolicy.fill}
                    onChange={(roles) => setCreateAccessPolicy({ ...createAccessPolicy, fill: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("permissionFill")}
                  />
                  <RolesSelect
                    value={createAccessPolicy.edit}
                    onChange={(roles) => setCreateAccessPolicy({ ...createAccessPolicy, edit: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("permissionEdit")}
                  />
                  <RolesSelect
                    value={createAccessPolicy.delete}
                    onChange={(roles) => setCreateAccessPolicy({ ...createAccessPolicy, delete: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("permissionDelete")}
                  />
                </>
              ) : null}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateOpen(false)} disabled={creating}>
              {t("cancel")}
            </Button>
            <Button
              onClick={submitCreateTicket}
              variant="contained"
              disabled={creating || !createTitle.trim()}
            >
              {creating ? t("creatingTicket") : t("create")}
            </Button>
          </DialogActions>
        </Dialog>
      </DndContext>
    );
  }