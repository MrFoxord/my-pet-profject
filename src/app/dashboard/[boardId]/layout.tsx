import { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface Props {
    children: ReactNode;
}

interface MetadataProps {
    params: Promise<{ boardId: string }>;
}

export async function generateMetadata ({ params }: MetadataProps): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `Dashboard - Board ${resolvedParams.boardId}`,
        description: `Dashboard layout for board ${resolvedParams.boardId}`,
    }
}

export default async function BoardLayout({children,} : Props) {
    const session = await auth();

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <>
            {children}
        </>
    );
}