export declare class UpdateTicketDto {
    title?: string;
    description?: string;
    status?: string;
    type?: string;
    priority?: string;
    columnId?: string;
    sortIndex?: number;
    accessPolicy?: {
        view?: string[];
        edit?: string[];
        delete?: string[];
        estimate?: string[];
        comment?: string[];
        manageAccess?: string[];
    };
}
