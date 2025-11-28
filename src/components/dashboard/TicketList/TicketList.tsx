"use client";

import { Ticket,TicketListProps } from "@/types";
import TickerCard from "../TickerCard/TicketCard";

export default function TicketList({ tickets, onTicketRendered, onTicketClick  }: TicketListProps) {
    console.log('tickets in TicketList:', tickets);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((ticket: Ticket) => (
                <TickerCard
                    key={ticket.id} 
                    ticket={ticket} 
                    onRender={onTicketRendered}
                    onClick={onTicketClick}
                />
            ))}
        </div>
    );
}