export declare const TICKET_STATUS_VALUES: readonly ["todo", "in-progress", "done"];
export type TicketStatus = (typeof TICKET_STATUS_VALUES)[number];
export declare const TICKET_TYPE_VALUES: readonly ["bug", "feature", "task"];
export type TicketType = (typeof TICKET_TYPE_VALUES)[number];
export declare const TICKET_PRIORITY_VALUES: readonly ["low", "medium", "high", "critical"];
export type TicketPriority = (typeof TICKET_PRIORITY_VALUES)[number];
