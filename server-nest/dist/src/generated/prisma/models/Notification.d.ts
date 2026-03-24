import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type NotificationModel = runtime.Types.Result.DefaultSelection<Prisma.$NotificationPayload>;
export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
};
export type NotificationMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    boardId: string | null;
    ticketId: string | null;
    kind: string | null;
    title: string | null;
    message: string | null;
    isRead: boolean | null;
    readAt: Date | null;
    createdAt: Date | null;
};
export type NotificationMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    boardId: string | null;
    ticketId: string | null;
    kind: string | null;
    title: string | null;
    message: string | null;
    isRead: boolean | null;
    readAt: Date | null;
    createdAt: Date | null;
};
export type NotificationCountAggregateOutputType = {
    id: number;
    userId: number;
    boardId: number;
    ticketId: number;
    kind: number;
    title: number;
    message: number;
    isRead: number;
    readAt: number;
    createdAt: number;
    _all: number;
};
export type NotificationMinAggregateInputType = {
    id?: true;
    userId?: true;
    boardId?: true;
    ticketId?: true;
    kind?: true;
    title?: true;
    message?: true;
    isRead?: true;
    readAt?: true;
    createdAt?: true;
};
export type NotificationMaxAggregateInputType = {
    id?: true;
    userId?: true;
    boardId?: true;
    ticketId?: true;
    kind?: true;
    title?: true;
    message?: true;
    isRead?: true;
    readAt?: true;
    createdAt?: true;
};
export type NotificationCountAggregateInputType = {
    id?: true;
    userId?: true;
    boardId?: true;
    ticketId?: true;
    kind?: true;
    title?: true;
    message?: true;
    isRead?: true;
    readAt?: true;
    createdAt?: true;
    _all?: true;
};
export type NotificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | NotificationCountAggregateInputType;
    _min?: NotificationMinAggregateInputType;
    _max?: NotificationMaxAggregateInputType;
};
export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
    [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateNotification[P]> : Prisma.GetScalarType<T[P], AggregateNotification[P]>;
};
export type NotificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithAggregationInput | Prisma.NotificationOrderByWithAggregationInput[];
    by: Prisma.NotificationScalarFieldEnum[] | Prisma.NotificationScalarFieldEnum;
    having?: Prisma.NotificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NotificationCountAggregateInputType | true;
    _min?: NotificationMinAggregateInputType;
    _max?: NotificationMaxAggregateInputType;
};
export type NotificationGroupByOutputType = {
    id: string;
    userId: string;
    boardId: string;
    ticketId: string | null;
    kind: string;
    title: string;
    message: string;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
};
type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<NotificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], NotificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], NotificationGroupByOutputType[P]>;
}>>;
export type NotificationWhereInput = {
    AND?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    OR?: Prisma.NotificationWhereInput[];
    NOT?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    id?: Prisma.StringFilter<"Notification"> | string;
    userId?: Prisma.StringFilter<"Notification"> | string;
    boardId?: Prisma.StringFilter<"Notification"> | string;
    ticketId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    kind?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringFilter<"Notification"> | string;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    ticket?: Prisma.XOR<Prisma.TicketNullableScalarRelationFilter, Prisma.TicketWhereInput> | null;
};
export type NotificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    board?: Prisma.BoardOrderByWithRelationInput;
    ticket?: Prisma.TicketOrderByWithRelationInput;
};
export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    OR?: Prisma.NotificationWhereInput[];
    NOT?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    userId?: Prisma.StringFilter<"Notification"> | string;
    boardId?: Prisma.StringFilter<"Notification"> | string;
    ticketId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    kind?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringFilter<"Notification"> | string;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    ticket?: Prisma.XOR<Prisma.TicketNullableScalarRelationFilter, Prisma.TicketWhereInput> | null;
}, "id">;
export type NotificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.NotificationCountOrderByAggregateInput;
    _max?: Prisma.NotificationMaxOrderByAggregateInput;
    _min?: Prisma.NotificationMinOrderByAggregateInput;
};
export type NotificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.NotificationScalarWhereWithAggregatesInput | Prisma.NotificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.NotificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.NotificationScalarWhereWithAggregatesInput | Prisma.NotificationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    boardId?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    ticketId?: Prisma.StringNullableWithAggregatesFilter<"Notification"> | string | null;
    kind?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    message?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    isRead?: Prisma.BoolWithAggregatesFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Notification"> | Date | string;
};
export type NotificationCreateInput = {
    id?: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutNotificationsInput;
    board: Prisma.BoardCreateNestedOneWithoutNotificationsInput;
    ticket?: Prisma.TicketCreateNestedOneWithoutNotificationsInput;
};
export type NotificationUncheckedCreateInput = {
    id?: string;
    userId: string;
    boardId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutNotificationsNestedInput;
    board?: Prisma.BoardUpdateOneRequiredWithoutNotificationsNestedInput;
    ticket?: Prisma.TicketUpdateOneWithoutNotificationsNestedInput;
};
export type NotificationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationCreateManyInput = {
    id?: string;
    userId: string;
    boardId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationListRelationFilter = {
    every?: Prisma.NotificationWhereInput;
    some?: Prisma.NotificationWhereInput;
    none?: Prisma.NotificationWhereInput;
};
export type NotificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NotificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput> | Prisma.NotificationCreateWithoutUserInput[] | Prisma.NotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutUserInput | Prisma.NotificationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.NotificationCreateManyUserInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput> | Prisma.NotificationCreateWithoutUserInput[] | Prisma.NotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutUserInput | Prisma.NotificationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.NotificationCreateManyUserInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput> | Prisma.NotificationCreateWithoutUserInput[] | Prisma.NotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutUserInput | Prisma.NotificationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput | Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.NotificationCreateManyUserInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput | Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutUserInput | Prisma.NotificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput> | Prisma.NotificationCreateWithoutUserInput[] | Prisma.NotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutUserInput | Prisma.NotificationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput | Prisma.NotificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.NotificationCreateManyUserInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput | Prisma.NotificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutUserInput | Prisma.NotificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput> | Prisma.NotificationCreateWithoutBoardInput[] | Prisma.NotificationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutBoardInput | Prisma.NotificationCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.NotificationCreateManyBoardInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput> | Prisma.NotificationCreateWithoutBoardInput[] | Prisma.NotificationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutBoardInput | Prisma.NotificationCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.NotificationCreateManyBoardInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput> | Prisma.NotificationCreateWithoutBoardInput[] | Prisma.NotificationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutBoardInput | Prisma.NotificationCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutBoardInput | Prisma.NotificationUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.NotificationCreateManyBoardInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutBoardInput | Prisma.NotificationUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutBoardInput | Prisma.NotificationUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput> | Prisma.NotificationCreateWithoutBoardInput[] | Prisma.NotificationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutBoardInput | Prisma.NotificationCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutBoardInput | Prisma.NotificationUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.NotificationCreateManyBoardInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutBoardInput | Prisma.NotificationUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutBoardInput | Prisma.NotificationUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput> | Prisma.NotificationCreateWithoutTicketInput[] | Prisma.NotificationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutTicketInput | Prisma.NotificationCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.NotificationCreateManyTicketInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUncheckedCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput> | Prisma.NotificationCreateWithoutTicketInput[] | Prisma.NotificationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutTicketInput | Prisma.NotificationCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.NotificationCreateManyTicketInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput> | Prisma.NotificationCreateWithoutTicketInput[] | Prisma.NotificationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutTicketInput | Prisma.NotificationCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutTicketInput | Prisma.NotificationUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.NotificationCreateManyTicketInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutTicketInput | Prisma.NotificationUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutTicketInput | Prisma.NotificationUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput> | Prisma.NotificationCreateWithoutTicketInput[] | Prisma.NotificationUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutTicketInput | Prisma.NotificationCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutTicketInput | Prisma.NotificationUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.NotificationCreateManyTicketInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutTicketInput | Prisma.NotificationUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutTicketInput | Prisma.NotificationUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationCreateWithoutUserInput = {
    id?: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutNotificationsInput;
    ticket?: Prisma.TicketCreateNestedOneWithoutNotificationsInput;
};
export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string;
    boardId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateOrConnectWithoutUserInput = {
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput>;
};
export type NotificationCreateManyUserInputEnvelope = {
    data: Prisma.NotificationCreateManyUserInput | Prisma.NotificationCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.NotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NotificationUpdateWithoutUserInput, Prisma.NotificationUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutUserInput, Prisma.NotificationUncheckedCreateWithoutUserInput>;
};
export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NotificationUpdateWithoutUserInput, Prisma.NotificationUncheckedUpdateWithoutUserInput>;
};
export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.NotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyWithoutUserInput>;
};
export type NotificationScalarWhereInput = {
    AND?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
    OR?: Prisma.NotificationScalarWhereInput[];
    NOT?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
    id?: Prisma.StringFilter<"Notification"> | string;
    userId?: Prisma.StringFilter<"Notification"> | string;
    boardId?: Prisma.StringFilter<"Notification"> | string;
    ticketId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    kind?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringFilter<"Notification"> | string;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
};
export type NotificationCreateWithoutBoardInput = {
    id?: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutNotificationsInput;
    ticket?: Prisma.TicketCreateNestedOneWithoutNotificationsInput;
};
export type NotificationUncheckedCreateWithoutBoardInput = {
    id?: string;
    userId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateOrConnectWithoutBoardInput = {
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput>;
};
export type NotificationCreateManyBoardInputEnvelope = {
    data: Prisma.NotificationCreateManyBoardInput | Prisma.NotificationCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type NotificationUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.NotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NotificationUpdateWithoutBoardInput, Prisma.NotificationUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutBoardInput, Prisma.NotificationUncheckedCreateWithoutBoardInput>;
};
export type NotificationUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NotificationUpdateWithoutBoardInput, Prisma.NotificationUncheckedUpdateWithoutBoardInput>;
};
export type NotificationUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.NotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyWithoutBoardInput>;
};
export type NotificationCreateWithoutTicketInput = {
    id?: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutNotificationsInput;
    board: Prisma.BoardCreateNestedOneWithoutNotificationsInput;
};
export type NotificationUncheckedCreateWithoutTicketInput = {
    id?: string;
    userId: string;
    boardId: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateOrConnectWithoutTicketInput = {
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput>;
};
export type NotificationCreateManyTicketInputEnvelope = {
    data: Prisma.NotificationCreateManyTicketInput | Prisma.NotificationCreateManyTicketInput[];
    skipDuplicates?: boolean;
};
export type NotificationUpsertWithWhereUniqueWithoutTicketInput = {
    where: Prisma.NotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NotificationUpdateWithoutTicketInput, Prisma.NotificationUncheckedUpdateWithoutTicketInput>;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutTicketInput, Prisma.NotificationUncheckedCreateWithoutTicketInput>;
};
export type NotificationUpdateWithWhereUniqueWithoutTicketInput = {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NotificationUpdateWithoutTicketInput, Prisma.NotificationUncheckedUpdateWithoutTicketInput>;
};
export type NotificationUpdateManyWithWhereWithoutTicketInput = {
    where: Prisma.NotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyWithoutTicketInput>;
};
export type NotificationCreateManyUserInput = {
    id?: string;
    boardId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutNotificationsNestedInput;
    ticket?: Prisma.TicketUpdateOneWithoutNotificationsNestedInput;
};
export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationCreateManyBoardInput = {
    id?: string;
    userId: string;
    ticketId?: string | null;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutNotificationsNestedInput;
    ticket?: Prisma.TicketUpdateOneWithoutNotificationsNestedInput;
};
export type NotificationUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    ticketId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationCreateManyTicketInput = {
    id?: string;
    userId: string;
    boardId: string;
    kind: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutNotificationsNestedInput;
    board?: Prisma.BoardUpdateOneRequiredWithoutNotificationsNestedInput;
};
export type NotificationUncheckedUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    boardId?: boolean;
    ticketId?: boolean;
    kind?: boolean;
    title?: boolean;
    message?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    boardId?: boolean;
    ticketId?: boolean;
    kind?: boolean;
    title?: boolean;
    message?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    boardId?: boolean;
    ticketId?: boolean;
    kind?: boolean;
    title?: boolean;
    message?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectScalar = {
    id?: boolean;
    userId?: boolean;
    boardId?: boolean;
    ticketId?: boolean;
    kind?: boolean;
    title?: boolean;
    message?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
};
export type NotificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "boardId" | "ticketId" | "kind" | "title" | "message" | "isRead" | "readAt" | "createdAt", ExtArgs["result"]["notification"]>;
export type NotificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
};
export type NotificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
};
export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    ticket?: boolean | Prisma.Notification$ticketArgs<ExtArgs>;
};
export type $NotificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Notification";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        board: Prisma.$BoardPayload<ExtArgs>;
        ticket: Prisma.$TicketPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        boardId: string;
        ticketId: string | null;
        kind: string;
        title: string;
        message: string;
        isRead: boolean;
        readAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["notification"]>;
    composites: {};
};
export type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$NotificationPayload, S>;
export type NotificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: NotificationCountAggregateInputType | true;
};
export interface NotificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Notification'];
        meta: {
            name: 'Notification';
        };
    };
    findUnique<T extends NotificationFindUniqueArgs>(args: Prisma.SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends NotificationFindFirstArgs>(args?: Prisma.SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends NotificationFindManyArgs>(args?: Prisma.SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends NotificationCreateArgs>(args: Prisma.SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends NotificationCreateManyArgs>(args?: Prisma.SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends NotificationDeleteArgs>(args: Prisma.SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends NotificationUpdateArgs>(args: Prisma.SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends NotificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends NotificationUpdateManyArgs>(args: Prisma.SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends NotificationUpsertArgs>(args: Prisma.SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends NotificationCountArgs>(args?: Prisma.Subset<T, NotificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], NotificationCountAggregateOutputType> : number>;
    aggregate<T extends NotificationAggregateArgs>(args: Prisma.Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>;
    groupBy<T extends NotificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: NotificationGroupByArgs['orderBy'];
    } : {
        orderBy?: NotificationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: NotificationFieldRefs;
}
export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    ticket<T extends Prisma.Notification$ticketArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Notification$ticketArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface NotificationFieldRefs {
    readonly id: Prisma.FieldRef<"Notification", 'String'>;
    readonly userId: Prisma.FieldRef<"Notification", 'String'>;
    readonly boardId: Prisma.FieldRef<"Notification", 'String'>;
    readonly ticketId: Prisma.FieldRef<"Notification", 'String'>;
    readonly kind: Prisma.FieldRef<"Notification", 'String'>;
    readonly title: Prisma.FieldRef<"Notification", 'String'>;
    readonly message: Prisma.FieldRef<"Notification", 'String'>;
    readonly isRead: Prisma.FieldRef<"Notification", 'Boolean'>;
    readonly readAt: Prisma.FieldRef<"Notification", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Notification", 'DateTime'>;
}
export type NotificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationCreateInput, Prisma.NotificationUncheckedCreateInput>;
};
export type NotificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.NotificationCreateManyInput | Prisma.NotificationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NotificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    data: Prisma.NotificationCreateManyInput | Prisma.NotificationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.NotificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type NotificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationUpdateInput, Prisma.NotificationUncheckedUpdateInput>;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyInput>;
    where?: Prisma.NotificationWhereInput;
    limit?: number;
};
export type NotificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyInput>;
    where?: Prisma.NotificationWhereInput;
    limit?: number;
    include?: Prisma.NotificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type NotificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateInput, Prisma.NotificationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.NotificationUpdateInput, Prisma.NotificationUncheckedUpdateInput>;
};
export type NotificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    limit?: number;
};
export type Notification$ticketArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
};
export type NotificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
};
export {};
