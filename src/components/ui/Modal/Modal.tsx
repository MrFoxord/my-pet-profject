"use client";

import { Modal as MuiModal, Box } from "@mui/material";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
    return (
        <MuiModal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    width: 'maxContent',
                }}
            >
                {children}
            </Box>
        </MuiModal>
    );
};