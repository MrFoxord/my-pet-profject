export declare class UpdateTicketDto {
    title?: string;
    description?: string;
    status?: string;
    type?: string;
    priority?: string;
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
