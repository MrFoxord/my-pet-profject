"use client";

import { MenuItem, TextField } from "@mui/material";
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES, TICKET_TYPE_VALUES } from "@/shared/tickets";
import type { Ticket } from "@/types";

const TICKET_TYPE_LABELS: Record<Ticket["type"], string> = {
  bug: "Bug",
  feature: "Feature",
  task: "Task",
};

const TICKET_PRIORITY_LABELS: Record<Ticket["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const TICKET_STATUS_LABELS: Record<Ticket["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

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
      {TICKET_TYPE_VALUES.map((type) => (
        <MenuItem key={type} value={type}>
          {TICKET_TYPE_LABELS[type]}
        </MenuItem>
      ))}
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
      {TICKET_PRIORITY_VALUES.map((priority) => (
        <MenuItem key={priority} value={priority}>
          {TICKET_PRIORITY_LABELS[priority]}
        </MenuItem>
      ))}
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
      {TICKET_STATUS_VALUES.map((status) => (
        <MenuItem key={status} value={status}>
          {TICKET_STATUS_LABELS[status]}
        </MenuItem>
      ))}
    </TextField>
  );
}
