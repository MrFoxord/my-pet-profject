"use client";

import { InputBase } from "@mui/material";

export function SearchInput() {
    return (
        <InputBase
            placeholder="Search…"
            sx={{backgroundColor: "#F3F4F6",
        borderRadius: 1,
        px: 2,
        width: 260,}}
        />
    );
}