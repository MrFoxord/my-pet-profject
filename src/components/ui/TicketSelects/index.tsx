"use client";

import { MenuItem, TextField } from "@mui/material";
import type { Ticket } from "@/types";

interface BaseSelectProps {
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
}

// ── Type ──────────────────────────────────────────────────────────────────────

interface TicketTypeSelectProps extends BaseSelectProps {
  value: Ticket["type"];
  onChange: (value: Ticket["type"]) => void;
  label?: string;
}

export function TicketTypeSelect({
  value,
  onChange,
  label = "Тип",
  fullWidth = true,
  size,
  disabled,
}: TicketTypeSelectProps) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["type"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      <MenuItem value="task">Task</MenuItem>
      <MenuItem value="feature">Feature</MenuItem>
      <MenuItem value="bug">Bug</MenuItem>
    </TextField>
  );
}

// ── Priority ──────────────────────────────────────────────────────────────────

interface TicketPrioritySelectProps extends BaseSelectProps {
  value: Ticket["priority"];
  onChange: (value: Ticket["priority"]) => void;
  label?: string;
}

export function TicketPrioritySelect({
  value,
  onChange,
  label = "Приоритет",
  fullWidth = true,
  size,
  disabled,
}: TicketPrioritySelectProps) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["priority"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      <MenuItem value="low">Low</MenuItem>
      <MenuItem value="medium">Medium</MenuItem>
      <MenuItem value="high">High</MenuItem>
      <MenuItem value="critical">Critical</MenuItem>
    </TextField>
  );
}

// ── Status ────────────────────────────────────────────────────────────────────

interface TicketStatusSelectProps extends BaseSelectProps {
  value: Ticket["status"];
  onChange: (value: Ticket["status"]) => void;
  label?: string;
}

export function TicketStatusSelect({
  value,
  onChange,
  label = "Статус",
  fullWidth = true,
  size,
  disabled,
}: TicketStatusSelectProps) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["status"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      <MenuItem value="todo">To Do</MenuItem>
      <MenuItem value="in-progress">In Progress</MenuItem>
      <MenuItem value="done">Done</MenuItem>
    </TextField>
  );
}
