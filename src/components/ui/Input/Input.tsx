"use client";

import { TextField } from "@mui/material";

interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const Input = ({ label, value, onChange }: InputProps) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            margin="normal"
        />
    );
}