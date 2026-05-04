"use client";

import { useTranslations } from "next-intl";
import { MenuItem, TextField } from "@mui/material";
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES, TICKET_TYPE_VALUES, TicketPriority, TicketStatus, TicketType } from "@/shared/tickets";
import type { Ticket } from "@/types";

const TICKET_TYPE_LABEL_KEYS: Record<Ticket["type"], string> = {
  [TicketType.BUG]: "typeBug",
  [TicketType.FEATURE]: "typeFeature",
  [TicketType.TASK]: "typeTask",
};

const TICKET_PRIORITY_LABEL_KEYS: Record<Ticket["priority"], string> = {
  [TicketPriority.LOW]: "priorityLow",
  [TicketPriority.MEDIUM]: "priorityMedium",
  [TicketPriority.HIGH]: "priorityHigh",
  [TicketPriority.CRITICAL]: "priorityCritical",
};

const TICKET_STATUS_LABEL_KEYS: Record<Ticket["status"], string> = {
  [TicketStatus.TODO]: "statusTodo",
  [TicketStatus.IN_PROGRESS]: "statusInProgress",
  [TicketStatus.DONE]: "statusDone",
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
  label,
  fullWidth = true,
  size,
  disabled,
}: TicketTypeSelectProps) {
  const t = useTranslations("ticketFields");
  const resolvedLabel = label ?? t("typeLabel");

  return (
    <TextField
      select
      label={resolvedLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["type"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      {TICKET_TYPE_VALUES.map((type) => (
        <MenuItem key={type} value={type}>
          {t(TICKET_TYPE_LABEL_KEYS[type])}
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
  label,
  fullWidth = true,
  size,
  disabled,
}: TicketPrioritySelectProps) {
  const t = useTranslations("ticketFields");
  const resolvedLabel = label ?? t("priorityLabel");

  return (
    <TextField
      select
      label={resolvedLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["priority"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      {TICKET_PRIORITY_VALUES.map((priority) => (
        <MenuItem key={priority} value={priority}>
          {t(TICKET_PRIORITY_LABEL_KEYS[priority])}
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
  label,
  fullWidth = true,
  size,
  disabled,
}: TicketStatusSelectProps) {
  const t = useTranslations("ticketFields");
  const resolvedLabel = label ?? t("statusLabel");

  return (
    <TextField
      select
      label={resolvedLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket["status"])}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      {TICKET_STATUS_VALUES.map((status) => (
        <MenuItem key={status} value={status}>
          {t(TICKET_STATUS_LABEL_KEYS[status])}
        </MenuItem>
      ))}
    </TextField>
  );
}
