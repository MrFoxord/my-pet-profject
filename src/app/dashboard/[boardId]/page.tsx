import DashboardClient from "@/components/layout/DashboardClient";
import { mockBoards } from "@/mocks/dashboard";
import { BoardPageProps } from "@/types";

export default async function BoardPage({ params }: BoardPageProps) {
    const { boardId } = await params;
    const board = mockBoards.find((b) => b.id === boardId) || {
        id: boardId,
        title: "Unknown Board",
        logoUrl: "",
        themeColor: "#111827"
    };
    return (
    <>
        <DashboardClient 
            board={board}
        >
            <div> Board content</div>
        </DashboardClient>
    </>    
    );
}