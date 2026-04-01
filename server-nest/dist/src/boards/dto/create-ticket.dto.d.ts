import { TicketPriority, TicketStatus, TicketType } from '../../shared/tickets';
export declare class CreateTicketDto {
    title: string;
    description?: string;
    status: TicketStatus;
    type: TicketType;
    priority?: TicketPriority;
    columnId?: string;
    accessPolicy?: {
        view?: string[];
        fill?: string[];
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
