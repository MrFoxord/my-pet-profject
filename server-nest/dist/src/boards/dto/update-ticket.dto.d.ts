import { TicketPriority, TicketStatus, TicketType } from '../../shared/tickets';
export declare class UpdateTicketDto {
    title?: string;
    description?: string;
    status?: TicketStatus;
    type?: TicketType;
    priority?: TicketPriority;
    columnId?: string;
    sortIndex?: number;
    accessPolicy?: {
        fill?: string[];
        view?: string[];
        edit?: string[];
        delete?: string[];
        estimate?: string[];
        comment?: string[];
        manageAccess?: string[];
    };
    estimateOriginalHours?: number | null;
    estimateSpentHours?: number | null;
    estimateRemainingHours?: number | null;
    storyPoints?: number | null;
}
