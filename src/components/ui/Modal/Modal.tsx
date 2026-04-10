"use client";

import { Modal as MuiModal, Box, type BoxProps, type ModalProps as MuiModalProps } from "@mui/material";
import { ReactNode } from "react";

interface ModalProps {
  open: MuiModalProps["open"];
  onClose: MuiModalProps["onClose"];
  children: ReactNode;
  contentSx?: BoxProps["sx"];
  containerSx?: BoxProps["sx"];
    disableAutoFocus?: MuiModalProps["disableAutoFocus"];
    disableEnforceFocus?: MuiModalProps["disableEnforceFocus"];
    disableRestoreFocus?: MuiModalProps["disableRestoreFocus"];
}

export const Modal = ({
    open,
    onClose,
    children,
    contentSx,
    containerSx,
    disableAutoFocus,
    disableEnforceFocus,
    disableRestoreFocus,
}: ModalProps) => {
    return (
                <MuiModal
                        open={open}
                        onClose={onClose}
                        disableAutoFocus={disableAutoFocus}
                        disableEnforceFocus={disableEnforceFocus}
                        disableRestoreFocus={disableRestoreFocus}
                >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    ...containerSx,
                }}
            >
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        width: "max-content",
                        maxWidth: "calc(100vw - 32px)",
                        maxHeight: "calc(100vh - 32px)",
                        overflow: "auto",
                        ...contentSx,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </MuiModal>
    );
};