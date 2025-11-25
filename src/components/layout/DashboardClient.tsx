"use client";

import { Box, Toolbar, Typography, Avatar } from "@mui/material";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { Board, DashboardClientProps } from "@/types";
import { mockTasks } from "@/mocks/dashboard";



export default function DashboardClient({ board, children }: DashboardClientProps) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: board.themeColor || "inherit" }}>
            <Sidebar boardId={board.id} themeColor={board.themeColor}/>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Topbar boardTitle={board.title} boardLogo={board.logoUrl}/>
                <Toolbar />
                <Box sx={{ p: 3 }}>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        {board.logoUrl && <Avatar src={board.logoUrl} alt={board.title} sx={{ mr: 2}} />}
                    </Box>
                    
                    { board.description && (
                        <Typography variant="body2" color='text.secondary' sx={{ mb: 3 }}>
                            {board.description}
                        </Typography>
                    )}

                    {board.stats && (
                        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                            <Typography>{board.stats.totalTasks}</Typography>
                            <Typography>{board.stats.completedTasks}</Typography>
                            <Typography>{board.stats.activeTasks}</Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Tasks
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {mockTasks.map(task => (
                            <Box
                                key={task.id}
                                sx={{
                                p: 2,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                backgroundColor:
                                    task.status === 'done' ? '#d4edda' :
                                    task.status === 'in-progress' ? '#fff3cd' :
                                    '#f8d7da'
                                }}
                            >
                                <Typography variant="subtitle2">{task.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                Assigned to: {task.assignedTo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Due: {task.dueDate}
                                </Typography>
                            </Box>
                            ))}
                        </Box>
                    </Box>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}