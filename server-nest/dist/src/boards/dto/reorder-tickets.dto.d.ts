export declare class ReorderTicketItemDto {
    id: string;
    status: string;
    columnId?: string;
    sortIndex: number;
}
export declare class ReorderTicketsDto {
    items: ReorderTicketItemDto[];
}
