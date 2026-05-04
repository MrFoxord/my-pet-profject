export enum TicketStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TicketType {
  BUG = 'bug',
  FEATURE = 'feature',
  TASK = 'task',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export const TICKET_STATUS_VALUES = Object.values(TicketStatus);
export const TICKET_TYPE_VALUES = Object.values(TicketType);
export const TICKET_PRIORITY_VALUES = Object.values(TicketPriority);