"use client";

import { Box, Toolbar, Typography, Avatar } from "@mui/material";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardClientProps, Ticket } from "@/types";
import { useState } from "react";

import TicketList from "@/components/dashboard/TicketList/TicketList";
import { Loader } from "../ui/Loader/Loader";
import { TicketModal } from "../dashboard/TicketModal/TicketModal";

export default function DashboardClient({ board, children }: DashboardClientProps) {
    const [loadedCount, setLoadedCount] = useState(0);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const totalTickets = board.tickets?.length || 0;

    const handleTicketRendered = () => {
        setLoadedCount(prev => prev + 1);
    };
    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setModalOpen(true);
    };
    const allLoaded = loadedCount === totalTickets;
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedTicket(null);
    };
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: board.themeColor || "inherit" }}>
            <Sidebar boardId={board.id} themeColor={board.themeColor}/>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Topbar boardTitle={board.title} boardLogo={board.logoUrl}/>
                <Toolbar />
                <Box sx={{ p: 3 }}>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        {board.logoUrl && <Avatar src={board.logoUrl} alt={board.title} sx={{ mr: 2}} />}
                        <Typography variant="h6">{board.title}</Typography>
                    </Box>

                    {board.description && (
                        <Typography variant="body2" color='text.secondary' sx={{ mb: 3 }}>
                            {board.description}
                        </Typography>
                    )}
                    {!allLoaded && <Loader />}
                    {board.tickets ? (
                        <div style={{ display: allLoaded ? 'flex' : 'none', flexDirection: 'column', gap: '12px' }}>
                            <TicketList
                                tickets={board.tickets} 
                                onTicketRendered={handleTicketRendered}
                                onTicketClick={handleTicketClick}
                            />
                        </div>
                        ) : (
                            <div>No tickets in this board yet</div>
                        )}
                    {selectedTicket && (
                    <TicketModal
                        key={selectedTicket.id}
                        ticket={selectedTicket}
                        open={modalOpen}
                        onClose={handleModalClose}
                    />)}
                    {children}
                </Box>
            </Box>
        </Box>
    );
}