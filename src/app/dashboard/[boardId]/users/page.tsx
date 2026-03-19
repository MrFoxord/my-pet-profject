import BoardUsersClient from "@/components/dashboard/BoardUsers/BoardUsersClient";
import { BoardPageProps } from "@/types";

export default async function BoardUsersPage({ params }: BoardPageProps) {
  const { boardId } = await params;

  return <BoardUsersClient boardId={boardId} />;
}
