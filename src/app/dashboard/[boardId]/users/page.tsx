import { auth } from "@/auth";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/layout/DashboardClient";
import BoardUsersClient from "@/components/dashboard/BoardUsers/BoardUsersClient";
import { BoardPageProps } from "@/types";
import { getDashboardBoard } from "../boardPageData";

export default async function BoardUsersPage({ params }: BoardPageProps) {
  const session = await auth();
  const { boardId } = await params;
  const board = await getDashboardBoard(boardId, session?.user?.id);

  if (!board) {
    notFound();
  }

  return (
    <DashboardClient board={board}>
      <BoardUsersClient boardId={boardId} />
    </DashboardClient>
  );
}
