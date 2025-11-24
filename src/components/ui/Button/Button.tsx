"use client";

import { Button as MUIButton } from "@mui/material";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" ;
}


export const Button = ({ children, onClick, variant = 'contained', color = 'primary' }: ButtonProps) => {

    return (
        <MUIButton variant={variant} color={color} onClick={onClick}>
            {children}
        </MUIButton>
    );
}