import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardInvitationModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardInvitationPayload>;
export type AggregateBoardInvitation = {
    _count: BoardInvitationCountAggregateOutputType | null;
    _min: BoardInvitationMinAggregateOutputType | null;
    _max: BoardInvitationMaxAggregateOutputType | null;
};
export type BoardInvitationMinAggregateOutputType = {
    id: string | null;
    token: string | null;
    email: string | null;
    boardId: string | null;
    role: $Enums.BoardMemberRole | null;
    status: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BoardInvitationMaxAggregateOutputType = {
    id: string | null;
    token: string | null;
    email: string | null;
    boardId: string | null;
    role: $Enums.BoardMemberRole | null;
    status: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BoardInvitationCountAggregateOutputType = {
    id: number;
    token: number;
    email: number;
    boardId: number;
    role: number;
    status: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type BoardInvitationMinAggregateInputType = {
    id?: true;
    token?: true;
    email?: true;
    boardId?: true;
    role?: true;
    status?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BoardInvitationMaxAggregateInputType = {
    id?: true;
    token?: true;
    email?: true;
    boardId?: true;
    role?: true;
    status?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BoardInvitationCountAggregateInputType = {
    id?: true;
    token?: true;
    email?: true;
    boardId?: true;
    role?: true;
    status?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type BoardInvitationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardInvitationWhereInput;
    orderBy?: Prisma.BoardInvitationOrderByWithRelationInput | Prisma.BoardInvitationOrderByWithRelationInput[];
    cursor?: Prisma.BoardInvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardInvitationCountAggregateInputType;
    _min?: BoardInvitationMinAggregateInputType;
    _max?: BoardInvitationMaxAggregateInputType;
};
export type GetBoardInvitationAggregateType<T extends BoardInvitationAggregateArgs> = {
    [P in keyof T & keyof AggregateBoardInvitation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoardInvitation[P]> : Prisma.GetScalarType<T[P], AggregateBoardInvitation[P]>;
};
export type BoardInvitationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardInvitationWhereInput;
    orderBy?: Prisma.BoardInvitationOrderByWithAggregationInput | Prisma.BoardInvitationOrderByWithAggregationInput[];
    by: Prisma.BoardInvitationScalarFieldEnum[] | Prisma.BoardInvitationScalarFieldEnum;
    having?: Prisma.BoardInvitationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardInvitationCountAggregateInputType | true;
    _min?: BoardInvitationMinAggregateInputType;
    _max?: BoardInvitationMaxAggregateInputType;
};
export type BoardInvitationGroupByOutputType = {
    id: string;
    token: string;
    email: string;
    boardId: string;
    role: $Enums.BoardMemberRole;
    status: string;
    expiresAt: Date;
    createdAt: Date;
    _count: BoardInvitationCountAggregateOutputType | null;
    _min: BoardInvitationMinAggregateOutputType | null;
    _max: BoardInvitationMaxAggregateOutputType | null;
};
type GetBoardInvitationGroupByPayload<T extends BoardInvitationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardInvitationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardInvitationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardInvitationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardInvitationGroupByOutputType[P]>;
}>>;
export type BoardInvitationWhereInput = {
    AND?: Prisma.BoardInvitationWhereInput | Prisma.BoardInvitationWhereInput[];
    OR?: Prisma.BoardInvitationWhereInput[];
    NOT?: Prisma.BoardInvitationWhereInput | Prisma.BoardInvitationWhereInput[];
    id?: Prisma.StringFilter<"BoardInvitation"> | string;
    token?: Prisma.StringFilter<"BoardInvitation"> | string;
    email?: Prisma.StringFilter<"BoardInvitation"> | string;
    boardId?: Prisma.StringFilter<"BoardInvitation"> | string;
    role?: Prisma.EnumBoardMemberRoleFilter<"BoardInvitation"> | $Enums.BoardMemberRole;
    status?: Prisma.StringFilter<"BoardInvitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
};
export type BoardInvitationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
};
export type BoardInvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    token?: string;
    boardId_email?: Prisma.BoardInvitationBoardIdEmailCompoundUniqueInput;
    AND?: Prisma.BoardInvitationWhereInput | Prisma.BoardInvitationWhereInput[];
    OR?: Prisma.BoardInvitationWhereInput[];
    NOT?: Prisma.BoardInvitationWhereInput | Prisma.BoardInvitationWhereInput[];
    email?: Prisma.StringFilter<"BoardInvitation"> | string;
    boardId?: Prisma.StringFilter<"BoardInvitation"> | string;
    role?: Prisma.EnumBoardMemberRoleFilter<"BoardInvitation"> | $Enums.BoardMemberRole;
    status?: Prisma.StringFilter<"BoardInvitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
}, "id" | "token" | "boardId_email">;
export type BoardInvitationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BoardInvitationCountOrderByAggregateInput;
    _max?: Prisma.BoardInvitationMaxOrderByAggregateInput;
    _min?: Prisma.BoardInvitationMinOrderByAggregateInput;
};
export type BoardInvitationScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardInvitationScalarWhereWithAggregatesInput | Prisma.BoardInvitationScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardInvitationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardInvitationScalarWhereWithAggregatesInput | Prisma.BoardInvitationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BoardInvitation"> | string;
    token?: Prisma.StringWithAggregatesFilter<"BoardInvitation"> | string;
    email?: Prisma.StringWithAggregatesFilter<"BoardInvitation"> | string;
    boardId?: Prisma.StringWithAggregatesFilter<"BoardInvitation"> | string;
    role?: Prisma.EnumBoardMemberRoleWithAggregatesFilter<"BoardInvitation"> | $Enums.BoardMemberRole;
    status?: Prisma.StringWithAggregatesFilter<"BoardInvitation"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"BoardInvitation"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BoardInvitation"> | Date | string;
};
export type BoardInvitationCreateInput = {
    id?: string;
    token: string;
    email: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutInvitationsInput;
};
export type BoardInvitationUncheckedCreateInput = {
    id?: string;
    token: string;
    email: string;
    boardId: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BoardInvitationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutInvitationsNestedInput;
};
export type BoardInvitationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationCreateManyInput = {
    id?: string;
    token: string;
    email: string;
    boardId: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BoardInvitationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationListRelationFilter = {
    every?: Prisma.BoardInvitationWhereInput;
    some?: Prisma.BoardInvitationWhereInput;
    none?: Prisma.BoardInvitationWhereInput;
};
export type BoardInvitationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardInvitationBoardIdEmailCompoundUniqueInput = {
    boardId: string;
    email: string;
};
export type BoardInvitationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BoardInvitationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BoardInvitationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BoardInvitationCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput> | Prisma.BoardInvitationCreateWithoutBoardInput[] | Prisma.BoardInvitationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardInvitationCreateOrConnectWithoutBoardInput | Prisma.BoardInvitationCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardInvitationCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
};
export type BoardInvitationUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput> | Prisma.BoardInvitationCreateWithoutBoardInput[] | Prisma.BoardInvitationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardInvitationCreateOrConnectWithoutBoardInput | Prisma.BoardInvitationCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardInvitationCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
};
export type BoardInvitationUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput> | Prisma.BoardInvitationCreateWithoutBoardInput[] | Prisma.BoardInvitationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardInvitationCreateOrConnectWithoutBoardInput | Prisma.BoardInvitationCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardInvitationUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardInvitationUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardInvitationCreateManyBoardInputEnvelope;
    set?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    disconnect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    delete?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    connect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    update?: Prisma.BoardInvitationUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardInvitationUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardInvitationUpdateManyWithWhereWithoutBoardInput | Prisma.BoardInvitationUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardInvitationScalarWhereInput | Prisma.BoardInvitationScalarWhereInput[];
};
export type BoardInvitationUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput> | Prisma.BoardInvitationCreateWithoutBoardInput[] | Prisma.BoardInvitationUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardInvitationCreateOrConnectWithoutBoardInput | Prisma.BoardInvitationCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardInvitationUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardInvitationUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardInvitationCreateManyBoardInputEnvelope;
    set?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    disconnect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    delete?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    connect?: Prisma.BoardInvitationWhereUniqueInput | Prisma.BoardInvitationWhereUniqueInput[];
    update?: Prisma.BoardInvitationUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardInvitationUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardInvitationUpdateManyWithWhereWithoutBoardInput | Prisma.BoardInvitationUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardInvitationScalarWhereInput | Prisma.BoardInvitationScalarWhereInput[];
};
export type BoardInvitationCreateWithoutBoardInput = {
    id?: string;
    token: string;
    email: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BoardInvitationUncheckedCreateWithoutBoardInput = {
    id?: string;
    token: string;
    email: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BoardInvitationCreateOrConnectWithoutBoardInput = {
    where: Prisma.BoardInvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput>;
};
export type BoardInvitationCreateManyBoardInputEnvelope = {
    data: Prisma.BoardInvitationCreateManyBoardInput | Prisma.BoardInvitationCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type BoardInvitationUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardInvitationWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardInvitationUpdateWithoutBoardInput, Prisma.BoardInvitationUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.BoardInvitationCreateWithoutBoardInput, Prisma.BoardInvitationUncheckedCreateWithoutBoardInput>;
};
export type BoardInvitationUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardInvitationWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardInvitationUpdateWithoutBoardInput, Prisma.BoardInvitationUncheckedUpdateWithoutBoardInput>;
};
export type BoardInvitationUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.BoardInvitationScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardInvitationUpdateManyMutationInput, Prisma.BoardInvitationUncheckedUpdateManyWithoutBoardInput>;
};
export type BoardInvitationScalarWhereInput = {
    AND?: Prisma.BoardInvitationScalarWhereInput | Prisma.BoardInvitationScalarWhereInput[];
    OR?: Prisma.BoardInvitationScalarWhereInput[];
    NOT?: Prisma.BoardInvitationScalarWhereInput | Prisma.BoardInvitationScalarWhereInput[];
    id?: Prisma.StringFilter<"BoardInvitation"> | string;
    token?: Prisma.StringFilter<"BoardInvitation"> | string;
    email?: Prisma.StringFilter<"BoardInvitation"> | string;
    boardId?: Prisma.StringFilter<"BoardInvitation"> | string;
    role?: Prisma.EnumBoardMemberRoleFilter<"BoardInvitation"> | $Enums.BoardMemberRole;
    status?: Prisma.StringFilter<"BoardInvitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BoardInvitation"> | Date | string;
};
export type BoardInvitationCreateManyBoardInput = {
    id?: string;
    token: string;
    email: string;
    role: $Enums.BoardMemberRole;
    status?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BoardInvitationUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardMemberRoleFieldUpdateOperationsInput | $Enums.BoardMemberRole;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardInvitationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token?: boolean;
    email?: boolean;
    boardId?: boolean;
    role?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardInvitation"]>;
export type BoardInvitationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token?: boolean;
    email?: boolean;
    boardId?: boolean;
    role?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardInvitation"]>;
export type BoardInvitationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    token?: boolean;
    email?: boolean;
    boardId?: boolean;
    role?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardInvitation"]>;
export type BoardInvitationSelectScalar = {
    id?: boolean;
    token?: boolean;
    email?: boolean;
    boardId?: boolean;
    role?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type BoardInvitationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "token" | "email" | "boardId" | "role" | "status" | "expiresAt" | "createdAt", ExtArgs["result"]["boardInvitation"]>;
export type BoardInvitationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type BoardInvitationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type BoardInvitationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type $BoardInvitationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BoardInvitation";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        token: string;
        email: string;
        boardId: string;
        role: $Enums.BoardMemberRole;
        status: string;
        expiresAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["boardInvitation"]>;
    composites: {};
};
export type BoardInvitationGetPayload<S extends boolean | null | undefined | BoardInvitationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload, S>;
export type BoardInvitationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardInvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardInvitationCountAggregateInputType | true;
};
export interface BoardInvitationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BoardInvitation'];
        meta: {
            name: 'BoardInvitation';
        };
    };
    findUnique<T extends BoardInvitationFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardInvitationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardInvitationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardInvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardInvitationFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardInvitationFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardInvitationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardInvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardInvitationFindManyArgs>(args?: Prisma.SelectSubset<T, BoardInvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardInvitationCreateArgs>(args: Prisma.SelectSubset<T, BoardInvitationCreateArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardInvitationCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardInvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardInvitationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardInvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardInvitationDeleteArgs>(args: Prisma.SelectSubset<T, BoardInvitationDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardInvitationUpdateArgs>(args: Prisma.SelectSubset<T, BoardInvitationUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardInvitationDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardInvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardInvitationUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardInvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardInvitationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardInvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardInvitationUpsertArgs>(args: Prisma.SelectSubset<T, BoardInvitationUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardInvitationClient<runtime.Types.Result.GetResult<Prisma.$BoardInvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardInvitationCountArgs>(args?: Prisma.Subset<T, BoardInvitationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardInvitationCountAggregateOutputType> : number>;
    aggregate<T extends BoardInvitationAggregateArgs>(args: Prisma.Subset<T, BoardInvitationAggregateArgs>): Prisma.PrismaPromise<GetBoardInvitationAggregateType<T>>;
    groupBy<T extends BoardInvitationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardInvitationGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardInvitationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardInvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardInvitationFieldRefs;
}
export interface Prisma__BoardInvitationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardInvitationFieldRefs {
    readonly id: Prisma.FieldRef<"BoardInvitation", 'String'>;
    readonly token: Prisma.FieldRef<"BoardInvitation", 'String'>;
    readonly email: Prisma.FieldRef<"BoardInvitation", 'String'>;
    readonly boardId: Prisma.FieldRef<"BoardInvitation", 'String'>;
    readonly role: Prisma.FieldRef<"BoardInvitation", 'BoardMemberRole'>;
    readonly status: Prisma.FieldRef<"BoardInvitation", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"BoardInvitation", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"BoardInvitation", 'DateTime'>;
}
export type BoardInvitationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    where: Prisma.BoardInvitationWhereUniqueInput;
};
export type BoardInvitationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    where: Prisma.BoardInvitationWhereUniqueInput;
};
export type BoardInvitationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardInvitationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardInvitationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardInvitationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardInvitationCreateInput, Prisma.BoardInvitationUncheckedCreateInput>;
};
export type BoardInvitationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardInvitationCreateManyInput | Prisma.BoardInvitationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardInvitationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    data: Prisma.BoardInvitationCreateManyInput | Prisma.BoardInvitationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardInvitationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardInvitationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardInvitationUpdateInput, Prisma.BoardInvitationUncheckedUpdateInput>;
    where: Prisma.BoardInvitationWhereUniqueInput;
};
export type BoardInvitationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardInvitationUpdateManyMutationInput, Prisma.BoardInvitationUncheckedUpdateManyInput>;
    where?: Prisma.BoardInvitationWhereInput;
    limit?: number;
};
export type BoardInvitationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardInvitationUpdateManyMutationInput, Prisma.BoardInvitationUncheckedUpdateManyInput>;
    where?: Prisma.BoardInvitationWhereInput;
    limit?: number;
    include?: Prisma.BoardInvitationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardInvitationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    where: Prisma.BoardInvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardInvitationCreateInput, Prisma.BoardInvitationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardInvitationUpdateInput, Prisma.BoardInvitationUncheckedUpdateInput>;
};
export type BoardInvitationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
    where: Prisma.BoardInvitationWhereUniqueInput;
};
export type BoardInvitationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardInvitationWhereInput;
    limit?: number;
};
export type BoardInvitationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardInvitationSelect<ExtArgs> | null;
    omit?: Prisma.BoardInvitationOmit<ExtArgs> | null;
    include?: Prisma.BoardInvitationInclude<ExtArgs> | null;
};
export {};
