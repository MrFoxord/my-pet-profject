import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    nickname: string | null;
    isDefault: boolean | null;
    image: string | null;
    emailVerified: Date | null;
    monetizationRole: $Enums.MonetizationRole | null;
    workRole: $Enums.WorkRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    nickname: string | null;
    isDefault: boolean | null;
    image: string | null;
    emailVerified: Date | null;
    monetizationRole: $Enums.MonetizationRole | null;
    workRole: $Enums.WorkRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    name: number;
    firstName: number;
    lastName: number;
    nickname: number;
    isDefault: number;
    image: number;
    emailVerified: number;
    monetizationRole: number;
    workRole: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    firstName?: true;
    lastName?: true;
    nickname?: true;
    isDefault?: true;
    image?: true;
    emailVerified?: true;
    monetizationRole?: true;
    workRole?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    firstName?: true;
    lastName?: true;
    nickname?: true;
    isDefault?: true;
    image?: true;
    emailVerified?: true;
    monetizationRole?: true;
    workRole?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    firstName?: true;
    lastName?: true;
    nickname?: true;
    isDefault?: true;
    image?: true;
    emailVerified?: true;
    monetizationRole?: true;
    workRole?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string | null;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    nickname: string | null;
    isDefault: boolean;
    image: string | null;
    emailVerified: Date | null;
    monetizationRole: $Enums.MonetizationRole;
    workRole: $Enums.WorkRole;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringNullableFilter<"User"> | string | null;
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    firstName?: Prisma.StringNullableFilter<"User"> | string | null;
    lastName?: Prisma.StringNullableFilter<"User"> | string | null;
    nickname?: Prisma.StringNullableFilter<"User"> | string | null;
    isDefault?: Prisma.BoolFilter<"User"> | boolean;
    image?: Prisma.StringNullableFilter<"User"> | string | null;
    emailVerified?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFilter<"User"> | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFilter<"User"> | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    ownedBoards?: Prisma.BoardListRelationFilter;
    boardMemberships?: Prisma.BoardMemberListRelationFilter;
    accounts?: Prisma.AccountListRelationFilter;
    comments?: Prisma.CommentListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    firstName?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastName?: Prisma.SortOrderInput | Prisma.SortOrder;
    nickname?: Prisma.SortOrderInput | Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailVerified?: Prisma.SortOrderInput | Prisma.SortOrder;
    monetizationRole?: Prisma.SortOrder;
    workRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    ownedBoards?: Prisma.BoardOrderByRelationAggregateInput;
    boardMemberships?: Prisma.BoardMemberOrderByRelationAggregateInput;
    accounts?: Prisma.AccountOrderByRelationAggregateInput;
    comments?: Prisma.CommentOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    nickname?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    firstName?: Prisma.StringNullableFilter<"User"> | string | null;
    lastName?: Prisma.StringNullableFilter<"User"> | string | null;
    isDefault?: Prisma.BoolFilter<"User"> | boolean;
    image?: Prisma.StringNullableFilter<"User"> | string | null;
    emailVerified?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFilter<"User"> | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFilter<"User"> | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    ownedBoards?: Prisma.BoardListRelationFilter;
    boardMemberships?: Prisma.BoardMemberListRelationFilter;
    accounts?: Prisma.AccountListRelationFilter;
    comments?: Prisma.CommentListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
}, "id" | "email" | "nickname">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    firstName?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastName?: Prisma.SortOrderInput | Prisma.SortOrder;
    nickname?: Prisma.SortOrderInput | Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailVerified?: Prisma.SortOrderInput | Prisma.SortOrder;
    monetizationRole?: Prisma.SortOrder;
    workRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    name?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    firstName?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    lastName?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    nickname?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    isDefault?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    image?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    emailVerified?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleWithAggregatesFilter<"User"> | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleWithAggregatesFilter<"User"> | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardUncheckedCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUncheckedUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    nickname?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    monetizationRole?: Prisma.SortOrder;
    workRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    nickname?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    monetizationRole?: Prisma.SortOrder;
    workRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    nickname?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    monetizationRole?: Prisma.SortOrder;
    workRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type EnumMonetizationRoleFieldUpdateOperationsInput = {
    set?: $Enums.MonetizationRole;
};
export type EnumWorkRoleFieldUpdateOperationsInput = {
    set?: $Enums.WorkRole;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutOwnedBoardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedBoardsInput, Prisma.UserUncheckedCreateWithoutOwnedBoardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedBoardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutOwnedBoardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedBoardsInput, Prisma.UserUncheckedCreateWithoutOwnedBoardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedBoardsInput;
    upsert?: Prisma.UserUpsertWithoutOwnedBoardsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOwnedBoardsInput, Prisma.UserUpdateWithoutOwnedBoardsInput>, Prisma.UserUncheckedUpdateWithoutOwnedBoardsInput>;
};
export type UserCreateNestedOneWithoutBoardMembershipsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBoardMembershipsInput, Prisma.UserUncheckedCreateWithoutBoardMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBoardMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutBoardMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBoardMembershipsInput, Prisma.UserUncheckedCreateWithoutBoardMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBoardMembershipsInput;
    upsert?: Prisma.UserUpsertWithoutBoardMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutBoardMembershipsInput, Prisma.UserUpdateWithoutBoardMembershipsInput>, Prisma.UserUncheckedUpdateWithoutBoardMembershipsInput>;
};
export type UserCreateNestedOneWithoutCommentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCommentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutCommentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCommentsInput;
    upsert?: Prisma.UserUpsertWithoutCommentsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCommentsInput, Prisma.UserUpdateWithoutCommentsInput>, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
};
export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.UserUpsertWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutNotificationsInput, Prisma.UserUpdateWithoutNotificationsInput>, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserCreateNestedOneWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAccountsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAccountsInput;
    upsert?: Prisma.UserUpsertWithoutAccountsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput, Prisma.UserUpdateWithoutAccountsInput>, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
};
export type UserCreateWithoutOwnedBoardsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    boardMemberships?: Prisma.BoardMemberCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOwnedBoardsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    boardMemberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOwnedBoardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedBoardsInput, Prisma.UserUncheckedCreateWithoutOwnedBoardsInput>;
};
export type UserUpsertWithoutOwnedBoardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOwnedBoardsInput, Prisma.UserUncheckedUpdateWithoutOwnedBoardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedBoardsInput, Prisma.UserUncheckedCreateWithoutOwnedBoardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOwnedBoardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOwnedBoardsInput, Prisma.UserUncheckedUpdateWithoutOwnedBoardsInput>;
};
export type UserUpdateWithoutOwnedBoardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    boardMemberships?: Prisma.BoardMemberUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOwnedBoardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    boardMemberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutBoardMembershipsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardCreateNestedManyWithoutOwnerInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutBoardMembershipsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardUncheckedCreateNestedManyWithoutOwnerInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutBoardMembershipsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutBoardMembershipsInput, Prisma.UserUncheckedCreateWithoutBoardMembershipsInput>;
};
export type UserUpsertWithoutBoardMembershipsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutBoardMembershipsInput, Prisma.UserUncheckedUpdateWithoutBoardMembershipsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutBoardMembershipsInput, Prisma.UserUncheckedCreateWithoutBoardMembershipsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutBoardMembershipsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutBoardMembershipsInput, Prisma.UserUncheckedUpdateWithoutBoardMembershipsInput>;
};
export type UserUpdateWithoutBoardMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUpdateManyWithoutOwnerNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutBoardMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUncheckedUpdateManyWithoutOwnerNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCommentsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardUncheckedCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCommentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
};
export type UserUpsertWithoutCommentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCommentsInput, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCommentsInput, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
};
export type UserUpdateWithoutCommentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUncheckedUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutNotificationsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
};
export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardUncheckedCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutAuthorInput;
};
export type UserCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
};
export type UserUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutAuthorNestedInput;
};
export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUncheckedUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutAuthorNestedInput;
};
export type UserCreateWithoutAccountsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    isDefault?: boolean;
    image?: string | null;
    emailVerified?: Date | string | null;
    monetizationRole?: $Enums.MonetizationRole;
    workRole?: $Enums.WorkRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedBoards?: Prisma.BoardUncheckedCreateNestedManyWithoutOwnerInput;
    boardMemberships?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutUserInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutAuthorInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutAccountsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
};
export type UserUpsertWithoutAccountsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAccountsInput, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAccountsInput, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
};
export type UserUpdateWithoutAccountsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lastName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nickname?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerified?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    monetizationRole?: Prisma.EnumMonetizationRoleFieldUpdateOperationsInput | $Enums.MonetizationRole;
    workRole?: Prisma.EnumWorkRoleFieldUpdateOperationsInput | $Enums.WorkRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedBoards?: Prisma.BoardUncheckedUpdateManyWithoutOwnerNestedInput;
    boardMemberships?: Prisma.BoardMemberUncheckedUpdateManyWithoutUserNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCountOutputType = {
    ownedBoards: number;
    boardMemberships: number;
    accounts: number;
    comments: number;
    notifications: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ownedBoards?: boolean | UserCountOutputTypeCountOwnedBoardsArgs;
    boardMemberships?: boolean | UserCountOutputTypeCountBoardMembershipsArgs;
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs;
    comments?: boolean | UserCountOutputTypeCountCommentsArgs;
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountOwnedBoardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
};
export type UserCountOutputTypeCountBoardMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
};
export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
};
export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
};
export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    nickname?: boolean;
    isDefault?: boolean;
    image?: boolean;
    emailVerified?: boolean;
    monetizationRole?: boolean;
    workRole?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ownedBoards?: boolean | Prisma.User$ownedBoardsArgs<ExtArgs>;
    boardMemberships?: boolean | Prisma.User$boardMembershipsArgs<ExtArgs>;
    accounts?: boolean | Prisma.User$accountsArgs<ExtArgs>;
    comments?: boolean | Prisma.User$commentsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    nickname?: boolean;
    isDefault?: boolean;
    image?: boolean;
    emailVerified?: boolean;
    monetizationRole?: boolean;
    workRole?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    nickname?: boolean;
    isDefault?: boolean;
    image?: boolean;
    emailVerified?: boolean;
    monetizationRole?: boolean;
    workRole?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    name?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    nickname?: boolean;
    isDefault?: boolean;
    image?: boolean;
    emailVerified?: boolean;
    monetizationRole?: boolean;
    workRole?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "name" | "firstName" | "lastName" | "nickname" | "isDefault" | "image" | "emailVerified" | "monetizationRole" | "workRole" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ownedBoards?: boolean | Prisma.User$ownedBoardsArgs<ExtArgs>;
    boardMemberships?: boolean | Prisma.User$boardMembershipsArgs<ExtArgs>;
    accounts?: boolean | Prisma.User$accountsArgs<ExtArgs>;
    comments?: boolean | Prisma.User$commentsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        ownedBoards: Prisma.$BoardPayload<ExtArgs>[];
        boardMemberships: Prisma.$BoardMemberPayload<ExtArgs>[];
        accounts: Prisma.$AccountPayload<ExtArgs>[];
        comments: Prisma.$CommentPayload<ExtArgs>[];
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string | null;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        nickname: string | null;
        isDefault: boolean;
        image: string | null;
        emailVerified: Date | null;
        monetizationRole: $Enums.MonetizationRole;
        workRole: $Enums.WorkRole;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ownedBoards<T extends Prisma.User$ownedBoardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$ownedBoardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    boardMemberships<T extends Prisma.User$boardMembershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$boardMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    accounts<T extends Prisma.User$accountsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    comments<T extends Prisma.User$commentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    notifications<T extends Prisma.User$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly firstName: Prisma.FieldRef<"User", 'String'>;
    readonly lastName: Prisma.FieldRef<"User", 'String'>;
    readonly nickname: Prisma.FieldRef<"User", 'String'>;
    readonly isDefault: Prisma.FieldRef<"User", 'Boolean'>;
    readonly image: Prisma.FieldRef<"User", 'String'>;
    readonly emailVerified: Prisma.FieldRef<"User", 'DateTime'>;
    readonly monetizationRole: Prisma.FieldRef<"User", 'MonetizationRole'>;
    readonly workRole: Prisma.FieldRef<"User", 'WorkRole'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$ownedBoardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$boardMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$accountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AccountScalarFieldEnum | Prisma.AccountScalarFieldEnum[];
};
export type User$commentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type User$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
