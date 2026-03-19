export declare class CreateTicketDto {
    title: string;
    description?: string;
    status: string;
    type: string;
    priority?: string;
    columnId?: string;
    accessPolicy?: {
        view?: string[];
        edit?: string[];
        delete?: string[];
        estimate?: string[];
        comment?: string[];
        manageAccess?: string[];
    };
}
