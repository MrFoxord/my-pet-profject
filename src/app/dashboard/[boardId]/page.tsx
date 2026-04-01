import { auth } from "@/auth";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/layout/DashboardClient";
import { BoardPageProps } from "@/types";
import { getDashboardBoard } from "./boardPageData";

export default async function BoardPage({ params }: BoardPageProps) {
    const session = await auth();
    const { boardId } = await params;
    const board = await getDashboardBoard(boardId, session?.user?.id);

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