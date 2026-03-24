"use client";

import { Card as MUICard, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export const Card = ({ title, children }: CardProps) => {
    return (
        <MUICard
            sx={{
                margin: 0,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1.25 }}>
                    {title}
                </Typography>
                {children}
            </CardContent>
        </MUICard>
    );
};