"use client";
import { Avatar } from '@mui/material';
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
    ProgressBar
} from './styles';

import { TickerCardProps } from '@/types';
import { useEffect } from 'react';

export default function TickerCard({ ticket, onRender, onClick  }: TickerCardProps ) {
    const total =ticket.subtasks.length;
    const done = ticket.subtasks.filter(st => st.done).length;
    useEffect(() => {
        if (onRender) onRender();
    }, []);
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
                <Avatar src={ticket.assignee.avatar} alt={ticket.assignee.name}/>
            </FooterRow>
        </Card>
    );
}