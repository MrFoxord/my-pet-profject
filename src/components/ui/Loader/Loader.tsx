"use client";

import { CircularProgress, Box } from "@mui/material";

export const Loader = () => {
    return (
        <Box display='flex' justifyContent='center' alignItems='center' height='100px'>
            <CircularProgress />
        </Box>
    );
}