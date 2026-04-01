export const TICKET_STATUS_VALUES = ['todo', 'in-progress', 'done'] as const;
export type TicketStatus = (typeof TICKET_STATUS_VALUES)[number];

export const TICKET_TYPE_VALUES = ['bug', 'feature', 'task'] as const;
export type TicketType = (typeof TICKET_TYPE_VALUES)[number];

export const TICKET_PRIORITY_VALUES = ['low', 'medium', 'high', 'critical'] as const;
export type TicketPriority = (typeof TICKET_PRIORITY_VALUES)[number];