import { ReactNode } from "react";
import type { Metadata } from "next";

interface Props {
    children: ReactNode;
}

export async function generateMetadata ({params} : {params: {boardId: string}}): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `Dashboard - Board ${resolvedParams.boardId}`,
        description: `Dashboard layout for board ${resolvedParams.boardId}`,
    }
}

export default function BoardLayout({children,} : Props) {
    return (
        <>
            {children}
        </>
    );
}