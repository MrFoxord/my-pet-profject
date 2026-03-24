import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardPayload>;
export type AggregateBoard = {
    _count: BoardCountAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
export type BoardMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    logoUrl: string | null;
    themeColor: string | null;
    ownerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    logoUrl: string | null;
    themeColor: string | null;
    ownerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    logoUrl: number;
    themeColor: number;
    ownerId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BoardMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    logoUrl?: true;
    themeColor?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    logoUrl?: true;
    themeColor?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    logoUrl?: true;
    themeColor?: true;
    ownerId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BoardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardCountAggregateInputType;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type GetBoardAggregateType<T extends BoardAggregateArgs> = {
    [P in keyof T & keyof AggregateBoard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoard[P]> : Prisma.GetScalarType<T[P], AggregateBoard[P]>;
};
export type BoardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithAggregationInput | Prisma.BoardOrderByWithAggregationInput[];
    by: Prisma.BoardScalarFieldEnum[] | Prisma.BoardScalarFieldEnum;
    having?: Prisma.BoardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardCountAggregateInputType | true;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type BoardGroupByOutputType = {
    id: string;
    title: string;
    description: string | null;
    logoUrl: string | null;
    themeColor: string | null;
    ownerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BoardCountAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
type GetBoardGroupByPayload<T extends BoardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]>;
}>>;
export type BoardWhereInput = {
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    id?: Prisma.StringFilter<"Board"> | string;
    title?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Board"> | string | null;
    themeColor?: Prisma.StringNullableFilter<"Board"> | string | null;
    ownerId?: Prisma.StringNullableFilter<"Board"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    tickets?: Prisma.TicketListRelationFilter;
    columns?: Prisma.BoardColumnListRelationFilter;
    memberships?: Prisma.BoardMemberListRelationFilter;
    roles?: Prisma.BoardRoleListRelationFilter;
    invitations?: Prisma.BoardInvitationListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
};
export type BoardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    themeColor?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    owner?: Prisma.UserOrderByWithRelationInput;
    tickets?: Prisma.TicketOrderByRelationAggregateInput;
    columns?: Prisma.BoardColumnOrderByRelationAggregateInput;
    memberships?: Prisma.BoardMemberOrderByRelationAggregateInput;
    roles?: Prisma.BoardRoleOrderByRelationAggregateInput;
    invitations?: Prisma.BoardInvitationOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
};
export type BoardWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    title?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Board"> | string | null;
    themeColor?: Prisma.StringNullableFilter<"Board"> | string | null;
    ownerId?: Prisma.StringNullableFilter<"Board"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    owner?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    tickets?: Prisma.TicketListRelationFilter;
    columns?: Prisma.BoardColumnListRelationFilter;
    memberships?: Prisma.BoardMemberListRelationFilter;
    roles?: Prisma.BoardRoleListRelationFilter;
    invitations?: Prisma.BoardInvitationListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
}, "id">;
export type BoardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    themeColor?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BoardCountOrderByAggregateInput;
    _max?: Prisma.BoardMaxOrderByAggregateInput;
    _min?: Prisma.BoardMinOrderByAggregateInput;
};
export type BoardScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Board"> | string | null;
    logoUrl?: Prisma.StringNullableWithAggregatesFilter<"Board"> | string | null;
    themeColor?: Prisma.StringNullableWithAggregatesFilter<"Board"> | string | null;
    ownerId?: Prisma.StringNullableWithAggregatesFilter<"Board"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
};
export type BoardCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateManyInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardListRelationFilter = {
    every?: Prisma.BoardWhereInput;
    some?: Prisma.BoardWhereInput;
    none?: Prisma.BoardWhereInput;
};
export type BoardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    themeColor?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    themeColor?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    themeColor?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardScalarRelationFilter = {
    is?: Prisma.BoardWhereInput;
    isNot?: Prisma.BoardWhereInput;
};
export type BoardCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput> | Prisma.BoardCreateWithoutOwnerInput[] | Prisma.BoardUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutOwnerInput | Prisma.BoardCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.BoardCreateManyOwnerInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput> | Prisma.BoardCreateWithoutOwnerInput[] | Prisma.BoardUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutOwnerInput | Prisma.BoardCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.BoardCreateManyOwnerInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput> | Prisma.BoardCreateWithoutOwnerInput[] | Prisma.BoardUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutOwnerInput | Prisma.BoardCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutOwnerInput | Prisma.BoardUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.BoardCreateManyOwnerInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutOwnerInput | Prisma.BoardUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutOwnerInput | Prisma.BoardUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoardUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput> | Prisma.BoardCreateWithoutOwnerInput[] | Prisma.BoardUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutOwnerInput | Prisma.BoardCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutOwnerInput | Prisma.BoardUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.BoardCreateManyOwnerInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutOwnerInput | Prisma.BoardUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutOwnerInput | Prisma.BoardUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoardCreateNestedOneWithoutMembershipsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutMembershipsInput, Prisma.BoardUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutMembershipsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutMembershipsInput, Prisma.BoardUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutMembershipsInput;
    upsert?: Prisma.BoardUpsertWithoutMembershipsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutMembershipsInput, Prisma.BoardUpdateWithoutMembershipsInput>, Prisma.BoardUncheckedUpdateWithoutMembershipsInput>;
};
export type BoardCreateNestedOneWithoutRolesInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutRolesInput, Prisma.BoardUncheckedCreateWithoutRolesInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutRolesInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutRolesNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutRolesInput, Prisma.BoardUncheckedCreateWithoutRolesInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutRolesInput;
    upsert?: Prisma.BoardUpsertWithoutRolesInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutRolesInput, Prisma.BoardUpdateWithoutRolesInput>, Prisma.BoardUncheckedUpdateWithoutRolesInput>;
};
export type BoardCreateNestedOneWithoutInvitationsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutInvitationsInput, Prisma.BoardUncheckedCreateWithoutInvitationsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutInvitationsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutInvitationsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutInvitationsInput, Prisma.BoardUncheckedCreateWithoutInvitationsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutInvitationsInput;
    upsert?: Prisma.BoardUpsertWithoutInvitationsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutInvitationsInput, Prisma.BoardUpdateWithoutInvitationsInput>, Prisma.BoardUncheckedUpdateWithoutInvitationsInput>;
};
export type BoardCreateNestedOneWithoutColumnsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutColumnsInput, Prisma.BoardUncheckedCreateWithoutColumnsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutColumnsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutColumnsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutColumnsInput, Prisma.BoardUncheckedCreateWithoutColumnsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutColumnsInput;
    upsert?: Prisma.BoardUpsertWithoutColumnsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutColumnsInput, Prisma.BoardUpdateWithoutColumnsInput>, Prisma.BoardUncheckedUpdateWithoutColumnsInput>;
};
export type BoardCreateNestedOneWithoutTicketsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutTicketsInput, Prisma.BoardUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutTicketsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutTicketsInput, Prisma.BoardUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutTicketsInput;
    upsert?: Prisma.BoardUpsertWithoutTicketsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutTicketsInput, Prisma.BoardUpdateWithoutTicketsInput>, Prisma.BoardUncheckedUpdateWithoutTicketsInput>;
};
export type BoardCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutNotificationsInput, Prisma.BoardUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutNotificationsInput, Prisma.BoardUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.BoardUpsertWithoutNotificationsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutNotificationsInput, Prisma.BoardUpdateWithoutNotificationsInput>, Prisma.BoardUncheckedUpdateWithoutNotificationsInput>;
};
export type BoardCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutOwnerInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput>;
};
export type BoardCreateManyOwnerInputEnvelope = {
    data: Prisma.BoardCreateManyOwnerInput | Prisma.BoardCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type BoardUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.BoardWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardUpdateWithoutOwnerInput, Prisma.BoardUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutOwnerInput, Prisma.BoardUncheckedCreateWithoutOwnerInput>;
};
export type BoardUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.BoardWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutOwnerInput, Prisma.BoardUncheckedUpdateWithoutOwnerInput>;
};
export type BoardUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.BoardScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyWithoutOwnerInput>;
};
export type BoardScalarWhereInput = {
    AND?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    OR?: Prisma.BoardScalarWhereInput[];
    NOT?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    id?: Prisma.StringFilter<"Board"> | string;
    title?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Board"> | string | null;
    themeColor?: Prisma.StringNullableFilter<"Board"> | string | null;
    ownerId?: Prisma.StringNullableFilter<"Board"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
};
export type BoardCreateWithoutMembershipsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutMembershipsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutMembershipsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutMembershipsInput, Prisma.BoardUncheckedCreateWithoutMembershipsInput>;
};
export type BoardUpsertWithoutMembershipsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutMembershipsInput, Prisma.BoardUncheckedUpdateWithoutMembershipsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutMembershipsInput, Prisma.BoardUncheckedCreateWithoutMembershipsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutMembershipsInput, Prisma.BoardUncheckedUpdateWithoutMembershipsInput>;
};
export type BoardUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutRolesInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutRolesInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutRolesInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutRolesInput, Prisma.BoardUncheckedCreateWithoutRolesInput>;
};
export type BoardUpsertWithoutRolesInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutRolesInput, Prisma.BoardUncheckedUpdateWithoutRolesInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutRolesInput, Prisma.BoardUncheckedCreateWithoutRolesInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutRolesInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutRolesInput, Prisma.BoardUncheckedUpdateWithoutRolesInput>;
};
export type BoardUpdateWithoutRolesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutRolesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutInvitationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutInvitationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutInvitationsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutInvitationsInput, Prisma.BoardUncheckedCreateWithoutInvitationsInput>;
};
export type BoardUpsertWithoutInvitationsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutInvitationsInput, Prisma.BoardUncheckedUpdateWithoutInvitationsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutInvitationsInput, Prisma.BoardUncheckedCreateWithoutInvitationsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutInvitationsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutInvitationsInput, Prisma.BoardUncheckedUpdateWithoutInvitationsInput>;
};
export type BoardUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutColumnsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutColumnsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutColumnsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutColumnsInput, Prisma.BoardUncheckedCreateWithoutColumnsInput>;
};
export type BoardUpsertWithoutColumnsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutColumnsInput, Prisma.BoardUncheckedUpdateWithoutColumnsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutColumnsInput, Prisma.BoardUncheckedCreateWithoutColumnsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutColumnsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutColumnsInput, Prisma.BoardUncheckedUpdateWithoutColumnsInput>;
};
export type BoardUpdateWithoutColumnsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutColumnsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutTicketsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutTicketsInput, Prisma.BoardUncheckedCreateWithoutTicketsInput>;
};
export type BoardUpsertWithoutTicketsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutTicketsInput, Prisma.BoardUncheckedUpdateWithoutTicketsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutTicketsInput, Prisma.BoardUncheckedCreateWithoutTicketsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutTicketsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutTicketsInput, Prisma.BoardUncheckedUpdateWithoutTicketsInput>;
};
export type BoardUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutNotificationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner?: Prisma.UserCreateNestedOneWithoutOwnedBoardsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutNotificationsInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    ownerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutBoardInput;
    columns?: Prisma.BoardColumnUncheckedCreateNestedManyWithoutBoardInput;
    memberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    roles?: Prisma.BoardRoleUncheckedCreateNestedManyWithoutBoardInput;
    invitations?: Prisma.BoardInvitationUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutNotificationsInput, Prisma.BoardUncheckedCreateWithoutNotificationsInput>;
};
export type BoardUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutNotificationsInput, Prisma.BoardUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutNotificationsInput, Prisma.BoardUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutNotificationsInput, Prisma.BoardUncheckedUpdateWithoutNotificationsInput>;
};
export type BoardUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneWithoutOwnedBoardsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateManyOwnerInput = {
    id?: string;
    title: string;
    description?: string | null;
    logoUrl?: string | null;
    themeColor?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutBoardNestedInput;
    columns?: Prisma.BoardColumnUncheckedUpdateManyWithoutBoardNestedInput;
    memberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    roles?: Prisma.BoardRoleUncheckedUpdateManyWithoutBoardNestedInput;
    invitations?: Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    themeColor?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardCountOutputType = {
    tickets: number;
    columns: number;
    memberships: number;
    roles: number;
    invitations: number;
    notifications: number;
};
export type BoardCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tickets?: boolean | BoardCountOutputTypeCountTicketsArgs;
    columns?: boolean | BoardCountOutputTypeCountColumnsArgs;
    memberships?: boolean | BoardCountOutputTypeCountMembershipsArgs;
    roles?: boolean | BoardCountOutputTypeCountRolesArgs;
    invitations?: boolean | BoardCountOutputTypeCountInvitationsArgs;
    notifications?: boolean | BoardCountOutputTypeCountNotificationsArgs;
};
export type BoardCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardCountOutputTypeSelect<ExtArgs> | null;
};
export type BoardCountOutputTypeCountTicketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
};
export type BoardCountOutputTypeCountColumnsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardColumnWhereInput;
};
export type BoardCountOutputTypeCountMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
};
export type BoardCountOutputTypeCountRolesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardRoleWhereInput;
};
export type BoardCountOutputTypeCountInvitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardInvitationWhereInput;
};
export type BoardCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
export type BoardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    themeColor?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
    tickets?: boolean | Prisma.Board$ticketsArgs<ExtArgs>;
    columns?: boolean | Prisma.Board$columnsArgs<ExtArgs>;
    memberships?: boolean | Prisma.Board$membershipsArgs<ExtArgs>;
    roles?: boolean | Prisma.Board$rolesArgs<ExtArgs>;
    invitations?: boolean | Prisma.Board$invitationsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Board$notificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    themeColor?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    themeColor?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    logoUrl?: boolean;
    themeColor?: boolean;
    ownerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BoardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "description" | "logoUrl" | "themeColor" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["board"]>;
export type BoardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
    tickets?: boolean | Prisma.Board$ticketsArgs<ExtArgs>;
    columns?: boolean | Prisma.Board$columnsArgs<ExtArgs>;
    memberships?: boolean | Prisma.Board$membershipsArgs<ExtArgs>;
    roles?: boolean | Prisma.Board$rolesArgs<ExtArgs>;
    invitations?: boolean | Prisma.Board$invitationsArgs<ExtArgs>;
    notifications?: boolean | Prisma.Board$notificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BoardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
};
export type BoardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.Board$ownerArgs<ExtArgs>;
};
export type $BoardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Board";
    objects: {
        owner: Prisma.$UserPayload<ExtArgs> | null;
        tickets: Prisma.$TicketPayload<ExtArgs>[];
        columns: Prisma.$BoardColumnPayload<ExtArgs>[];
        memberships: Prisma.$BoardMemberPayload<ExtArgs>[];
        roles: Prisma.$BoardRolePayload<ExtArgs>[];
        invitations: Prisma.$BoardInvitationPayload<ExtArgs>[];
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        description: string | null;
        logoUrl: string | null;
        themeColor: string | null;
        ownerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["board"]>;
    composites: {};
};
export type BoardGetPayload<S extends boolean | null | undefined | BoardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardPayload, S>;
export type BoardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardCountAggregateInputType | true;
};
export interface BoardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Board'];
        meta: {
            name: 'Board';
        };
    };
    findUnique<T extends BoardFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardFindManyArgs>(args?: Prisma.SelectSubset<T, BoardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardCreateArgs>(args: Prisma.SelectSubset<T, BoardCreateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardDeleteArgs>(args: Prisma.SelectSubset<T, BoardDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardUpdateArgs>(args: Prisma.SelectSubset<T, BoardUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardUpsertArgs>(args: Prisma.SelectSubset<T, BoardUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardCountArgs>(args?: Prisma.Subset<T, BoardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardCountAggregateOutputType> : number>;
    aggregate<T extends BoardAggregateArgs>(args: Prisma.Subset<T, BoardAggregateArgs>): Prisma.PrismaPromise<GetBoardAggregateType<T>>;
    groupBy<T extends BoardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardFieldRefs;
}
export interface Prisma__BoardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.Board$ownerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$ownerArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tickets<T extends Prisma.Board$ticketsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    columns<T extends Prisma.Board$columnsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$columnsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    memberships<T extends Prisma.Board$membershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    roles<T extends Prisma.Board$rolesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    invitations<T extends Prisma.Board$invitationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$invitationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    notifications<T extends Prisma.Board$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardFieldRefs {
    readonly id: Prisma.FieldRef<"Board", 'String'>;
    readonly title: Prisma.FieldRef<"Board", 'String'>;
    readonly description: Prisma.FieldRef<"Board", 'String'>;
    readonly logoUrl: Prisma.FieldRef<"Board", 'String'>;
    readonly themeColor: Prisma.FieldRef<"Board", 'String'>;
    readonly ownerId: Prisma.FieldRef<"Board", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Board", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Board", 'DateTime'>;
}
export type BoardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
};
export type BoardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type BoardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
    include?: Prisma.BoardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
};
export type BoardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type Board$ownerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Board$ticketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
export type Board$columnsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    where?: Prisma.BoardColumnWhereInput;
    orderBy?: Prisma.BoardColumnOrderByWithRelationInput | Prisma.BoardColumnOrderByWithRelationInput[];
    cursor?: Prisma.BoardColumnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardColumnScalarFieldEnum | Prisma.BoardColumnScalarFieldEnum[];
};
export type Board$membershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where?: Prisma.BoardMemberWhereInput;
    orderBy?: Prisma.BoardMemberOrderByWithRelationInput | Prisma.BoardMemberOrderByWithRelationInput[];
    cursor?: Prisma.BoardMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardMemberScalarFieldEnum | Prisma.BoardMemberScalarFieldEnum[];
};
export type Board$rolesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    where?: Prisma.BoardRoleWhereInput;
    orderBy?: Prisma.BoardRoleOrderByWithRelationInput | Prisma.BoardRoleOrderByWithRelationInput[];
    cursor?: Prisma.BoardRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardRoleScalarFieldEnum | Prisma.BoardRoleScalarFieldEnum[];
};
export type Board$invitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    where?: Prisma.BoardInvitationWhereInput;
    orderBy?: Prisma.BoardInvitationOrderByWithRelationInput | Prisma.BoardInvitationOrderByWithRelationInput[];
    cursor?: Prisma.BoardInvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardInvitationScalarFieldEnum | Prisma.BoardInvitationScalarFieldEnum[];
};
export type Board$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
};
export {};
