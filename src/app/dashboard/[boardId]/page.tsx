import { auth } from "@/auth";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/layout/DashboardClient";
import { buildColumnsFromApi } from "@/lib/boards";
import { getServerBoardById } from "@/lib/api/serverClient";
import { Board, BoardPageProps } from "@/types";

async function getBoard(boardId: string, userId?: string | null): Promise<Board | null> {
    try {
        const board = await getServerBoardById(boardId, userId);

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
        notFound();
    }

    return (
    <>
            <DashboardClient board={board}>
                <div> Board content</div>
            </DashboardClient>
        </>
    );
}