"use client";

import { Card as MUICard, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export const Card = ({ title, children }: CardProps) => {
    return (
        <MUICard sx={{ margin: 2, padding: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    {title}
                </Typography>
                {children}
            </CardContent>
        </MUICard>
    );
};