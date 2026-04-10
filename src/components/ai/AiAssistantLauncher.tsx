"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Fab, Box } from "@mui/material";

type AiAssistantLauncherProps = {
  open: boolean;
  label: string;
  onClick: () => void;
};

export function AiAssistantLauncher({ open, label, onClick }: AiAssistantLauncherProps) {
  return (
    <Fab
      color="primary"
      variant="extended"
      aria-label={label}
      onClick={onClick}
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 20 },
        bottom: { xs: 16, sm: 20 },
        zIndex: (theme) => theme.zIndex.modal + 3,
        minHeight: 58,
        px: 2,
        boxShadow: "0 14px 34px rgba(11, 99, 206, 0.28)",
        background: "linear-gradient(135deg, #0b63ce 0%, #0ea5a4 100%)",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        "&:hover": {
          background: "linear-gradient(135deg, #084fa8 0%, #0c8e8c 100%)",
        },
      }}
    >
      {open ? <CloseRoundedIcon sx={{ mr: { xs: 0, sm: 1 } }} /> : <AutoAwesomeRoundedIcon sx={{ mr: { xs: 0, sm: 1 } }} />}
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, fontWeight: 700 }}>
        {label}
      </Box>
    </Fab>
  );
}
