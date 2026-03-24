import { ApiBoardColumn } from "@/lib/api/client";
import { BoardColumn, Ticket } from "@/types";

export function buildColumnsFromApi(
  apiColumns: ApiBoardColumn[],
  tickets: Ticket[]
): BoardColumn[] {
  const fallbackApiColumns: ApiBoardColumn[] = [
    { id: "fallback-todo", title: "To Do", position: 0 },
    { id: "fallback-in-progress", title: "In Progress", position: 1 },
    { id: "fallback-done", title: "Done", position: 2 },
  ];

  const sortedColumns = [...(apiColumns.length ? apiColumns : fallbackApiColumns)].sort(
    (a, b) => a.position - b.position
  );

  const columns = sortedColumns.map((column) => ({
    id: column.id,
    title: column.title,
    ticketIds: [] as string[],
  }));

  const fallbackColumn = columns[0];
  if (!fallbackColumn) {
    return [];
  }

  const findColumnByStatus = (status: Ticket["status"]): BoardColumn | undefined => {
    const normalized = columns.map((column) => ({
      raw: column,
      title: column.title.toLowerCase(),
    }));

    if (status === "todo") {
      return normalized.find((c) => c.title.includes("todo") || c.title.includes("to do") || c.title.includes("backlog"))?.raw;
    }

    if (status === "in-progress") {
      return normalized.find((c) => c.title.includes("progress") || c.title.includes("doing") || c.title.includes("wip"))?.raw;
    }

    return normalized.find((c) => c.title.includes("done") || c.title.includes("complete"))?.raw;
  };

  for (const ticket of tickets) {
    const byId = ticket.columnId
      ? columns.find((column) => column.id === ticket.columnId)
      : undefined;
    const targetColumn = byId ?? findColumnByStatus(ticket.status) ?? fallbackColumn;
    targetColumn.ticketIds.push(ticket.id);
  }

  return columns;
}
