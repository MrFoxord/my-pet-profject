"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { mockBoards } from "@/store/mockBoards";
import { Loader } from "@/components/ui/Loader/Loader";
import {
  PageRoot,
  PageMain,
  Header,
  Title,
  Subtitle,
  BoardsGrid,
  BoardCard,
  BoardId,
  BoardName,
  BoardDescription,
  BoardMeta,
} from "@/components/home/styled";
import { BoardDto } from "@/types/dashboard";

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [boards, setBoards] = useState<BoardDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/health");
        if( !res.ok) throw new Error ('Failed to load boards');

         const text = await res.text();
         console.log("health:", text);
        // const data: BoardDto[] = await res.json();
        // setBoards(data);
      } catch (e) {
        console.error('load boards error', e);
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, [isHydrated])

  if (!isHydrated) {
    return (
      <PageRoot>
        <PageMain>
          <Loader />
        </PageMain>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <PageMain>
        <Header>
          <Title>Ваши доски</Title>
          <Subtitle>
            Выберите доску, чтобы открыть дашборд с тикетами.
          </Subtitle>
        </Header>

        {boards.length === 0 ? (
          <Subtitle>Пока нет ни одной доски.</Subtitle>
        ) : (
          <BoardsGrid>
            {boards.map((board) => (
              <Link key={board.id} href={`/dashboard/${board.id}`}>
                <BoardCard>
                  <BoardId>Board #{board.id}</BoardId>
                  <BoardName>{board.title}</BoardName>
                  {board.description && (
                    <BoardDescription>{board.description}</BoardDescription>
                  )}
                  <BoardMeta>
                    {board.tickets?.length ?? 0} тикетов
                  </BoardMeta>
                </BoardCard>
              </Link>
            ))}
          </BoardsGrid>
        )}
      </PageMain>
    </PageRoot>
  );
}