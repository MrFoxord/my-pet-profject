import { auth } from "@/auth";
import DashboardClient from "@/components/layout/DashboardClient";
import { ApiBoardColumn, ApiBoardResponse, getBoardById } from "@/lib/api/client";
import { Board, BoardColumn, BoardPageProps, Ticket } from "@/types";

function buildColumnsFromApi(
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
    if (!fallbackColumn) return [];

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
        const targetColumn = findColumnByStatus(ticket.status) ?? fallbackColumn;
        targetColumn.ticketIds.push(ticket.id);
    }

    return columns;
}

async function getBoard(boardId: string, userId?: string): Promise<Board | null> {
    try {
        const board = await getBoardById(boardId, userId);

        if (!board) {
            return null;
        }
        const tickets = board.tickets ?? [];
        const apiColumns = board.columns ?? [];

        return {
            ...board,
            tickets,
            columns: buildColumnsFromApi(apiColumns, tickets),
        };
    } catch {
        return null;
    }
}

export default async function BoardPage({ params }: BoardPageProps) {
    const session = await auth();
    const { boardId } = await params;
    const board = await getBoard(boardId, session?.user?.id);

    if (!board) {
        return <div>Board not found</div>;
    }

    return (
    <>
            <DashboardClient board={board}>
                <div> Board content</div>
            </DashboardClient>
        </>
    );
}