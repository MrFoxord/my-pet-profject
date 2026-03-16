"use client";

import { useMemo, useState } from "react";
import {
  ClickAwayListener,
  ListSubheader,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  Popper,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

type ActionHandler = () => void | Promise<void>;

interface ActionDialogProps {
  title: string;
  actions: Record<string, ActionHandler>;
  iconButtonLabel?: string;
}

export default function ActionDialog({
  title,
  actions,
  iconButtonLabel = "Открыть действия",
}: ActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const entries = useMemo(() => Object.entries(actions), [actions]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleActionClick = async (action: ActionHandler) => {
    await action();
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label={iconButtonLabel}
        size="small"
        onClick={handleOpen}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <MoreVertRoundedIcon fontSize="small" />
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={8}
            sx={{
              minWidth: 220,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <List
              dense
              sx={{ py: 0 }}
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    lineHeight: 1.2,
                    py: 1.25,
                    px: 2,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.secondary",
                    bgcolor: "background.paper",
                  }}
                >
                  {title}
                </ListSubheader>
              }
            >
              {entries.map(([label, action]) => (
                <ListItemButton
                  key={label}
                  onClick={() => void handleActionClick(action)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
