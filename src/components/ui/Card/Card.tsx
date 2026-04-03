"use client";

import {
  Card as MUICard,
  CardActions,
  CardContent,
  Typography,
  type CardActionsProps,
  type CardContentProps,
  type CardProps as MUICardProps,
} from "@mui/material";
import { ReactNode } from "react";

interface CardProps extends Omit<MUICardProps, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  contentSx?: CardContentProps["sx"];
  actionsSx?: CardActionsProps["sx"];
}

export const Card = ({
  title,
  subtitle,
  children,
  actions,
  sx,
  contentSx,
  actionsSx,
  ...props
}: CardProps) => {
    return (
        <MUICard
            {...props}
            sx={{
                margin: 0,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                ...sx,
            }}
        >
            <CardContent sx={{ p: 2.5, ...contentSx }}>
                {title ? (
                    <Typography variant="h6" sx={{ mb: subtitle ? 0.5 : 1.25 }}>
                        {title}
                    </Typography>
                ) : null}
                {subtitle ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {subtitle}
                    </Typography>
                ) : null}
                {children}
            </CardContent>
            {actions ? <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, ...actionsSx }}>{actions}</CardActions> : null}
        </MUICard>
    );
};