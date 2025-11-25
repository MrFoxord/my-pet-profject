"use client";

import {Card, CardContent, Typography, Box, Button } from "@mui/material";
import { TaskItemProps, Task } from "@/types";
import { useState, useEffect } from "react";

export default function TaskItem({ task, onStatusChange }: TaskItemProps) {
    const [status, setStatus] = useState<Task["status"]>(task.status);

        // useEffect(() => {
        //     setStatus(task.status);
        // }, [task.status]);

    const statusColors: Record<Task["status"], string> = {
        todo: "#f59e0b",
        "in-progress": "#3b82f6",
        done: "#10b981",
    }

    const handleStatusChange = (newStatus: Task["status"]) => {
        setStatus(newStatus);
        if (onStatusChange) {
        onStatusChange(task.id, newStatus);
        }
    };
    return (
        <Card sx={{ mb: 2, borderLeft: `5px solid ${statusColors[task.status]}` }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Assigned to: {task.assignedTo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Due: {task.dueDate}
                </Typography>

                {onStatusChange && (
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                       {(["todo", "in-progress", "done"] as Task["status"][]).map((s) => (
                            <Button 
                                key={s}
                                size="small"
                                variant={status === s ? "contained" : "outlined"} // <-- используем локальный стейт
                                onClick={() => handleStatusChange(s)}
                            >
                                {s} 
                            </Button>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}