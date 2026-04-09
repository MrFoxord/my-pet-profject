import { type SxProps, type Theme } from "@mui/material";

export const TOPBAR_ACTION_BUTTON_SX: SxProps<Theme> = {
  borderColor: "rgba(255, 255, 255, 0.44)",
  px: { xs: 1, sm: 1.5 },
  minWidth: 0,
  whiteSpace: "nowrap",
};

export const TOPBAR_DANGER_BUTTON_SX: SxProps<Theme> = {
  boxShadow: "none",
  px: { xs: 1, sm: 1.5 },
  minWidth: 0,
  whiteSpace: "nowrap",
  color: "#ffffff",
  "&.Mui-disabled": {
    color: "#ffffff",
    backgroundColor: "rgba(211, 47, 47, 0.78)",
  },
};

export const TOPBAR_WARNING_TEXT_SX: SxProps<Theme> = {
  color: "#ffe3b2",
  fontWeight: 600,
  mr: { xs: "auto", md: 0 },
  maxWidth: { xs: "100%", md: 220 },
};

export const TOPBAR_COMPACT_ICON_BUTTON_SX: SxProps<Theme> = {
  p: 0.25,
};

export const TOPBAR_TITLE_AVATAR_SX: SxProps<Theme> = {
  width: 34,
  height: 34,
};

export const TOPBAR_PROFILE_AVATAR_SX: SxProps<Theme> = {
  width: 28,
  height: 28,
};

export const TOPBAR_MENU_PAPER_SX: SxProps<Theme> = {
  borderRadius: 2,
  minWidth: { xs: 180, sm: 220 },
  border: "1px solid",
  borderColor: "divider",
};

export const TOPBAR_OVERLAY_PAPER_SX: SxProps<Theme> = {
  width: { xs: "calc(100vw - 16px)", sm: 360 },
  maxWidth: 360,
  maxHeight: 420,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.14)",
};

export const TOPBAR_SEARCH_INPUT_SX: SxProps<Theme> = {
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  color: "#f5f9ff",
  borderRadius: 999,
  px: 1.8,
  py: 0.45,
  width: { xs: 140, sm: 220, md: 260 },
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all .2s ease",
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(245, 249, 255, 0.72)",
    opacity: 1,
  },
  "&:focus-within": {
    borderColor: "rgba(255, 255, 255, 0.55)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
};

export const TOPBAR_SELECT_SX: SxProps<Theme> = {
  minWidth: { xs: 72, sm: 108 },
  color: "#f5f9ff",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  "& .MuiSelect-select": {
    py: 0.5,
    px: { xs: 1, sm: 1.2 },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.38)",
  },
  "& .MuiSvgIcon-root": {
    color: "#f5f9ff",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
};