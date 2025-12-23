"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mockBoards } from "@/store/mockBoards";
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

export default function Home() {
  const boards = mockBoards;
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

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