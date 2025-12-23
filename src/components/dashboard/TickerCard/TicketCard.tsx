"use client";

import { TickerCardProps } from "@/types";
import {
  Card,
  HeaderRow,
  TicketId,
  TypeBadge,
  Title,
  FooterRow,
  Left,
  TaskSummary,
  Progress,
  ProgressBar,
  Avatar,
} from "./styles";

export default function TickerCard({
  ticket,
  onRender, // можно оставить в пропсах, даже если не используешь
  onClick,
}: TickerCardProps) {
  const total = ticket.subtasks.length;
  const done = ticket.subtasks.filter((st) => st.done).length;

  return (
    <Card onClick={() => onClick?.(ticket)}>
      <HeaderRow>
        <TicketId>{ticket.id}</TicketId>
        <TypeBadge $type={ticket.type}>{ticket.type}</TypeBadge>
      </HeaderRow>

      <Title>{ticket.title}</Title>

      <FooterRow>
        <Left>
          {total > 0 && (
            <>
              <TaskSummary>
                {done} / {total} tasks
              </TaskSummary>
              <Progress>
                <ProgressBar style={{ width: `${(done / total) * 100}%` }} />
              </Progress>
            </>
          )}
        </Left>
        <Avatar src={ticket.assignee.avatar} alt={ticket.assignee.name} />
      </FooterRow>
    </Card>
  );
}