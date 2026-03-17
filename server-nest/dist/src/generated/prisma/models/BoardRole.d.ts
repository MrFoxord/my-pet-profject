import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardRoleModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardRolePayload>;
export type AggregateBoardRole = {
    _count: BoardRoleCountAggregateOutputType | null;
    _min: BoardRoleMinAggregateOutputType | null;
    _max: BoardRoleMaxAggregateOutputType | null;
};
export type BoardRoleMinAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardRoleMaxAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardRoleCountAggregateOutputType = {
    id: number;
    boardId: number;
    name: number;
    permissions: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BoardRoleMinAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardRoleMaxAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardRoleCountAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    permissions?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BoardRoleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardRoleWhereInput;
    orderBy?: Prisma.BoardRoleOrderByWithRelationInput | Prisma.BoardRoleOrderByWithRelationInput[];
    cursor?: Prisma.BoardRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardRoleCountAggregateInputType;
    _min?: BoardRoleMinAggregateInputType;
    _max?: BoardRoleMaxAggregateInputType;
};
export type GetBoardRoleAggregateType<T extends BoardRoleAggregateArgs> = {
    [P in keyof T & keyof AggregateBoardRole]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoardRole[P]> : Prisma.GetScalarType<T[P], AggregateBoardRole[P]>;
};
export type BoardRoleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardRoleWhereInput;
    orderBy?: Prisma.BoardRoleOrderByWithAggregationInput | Prisma.BoardRoleOrderByWithAggregationInput[];
    by: Prisma.BoardRoleScalarFieldEnum[] | Prisma.BoardRoleScalarFieldEnum;
    having?: Prisma.BoardRoleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardRoleCountAggregateInputType | true;
    _min?: BoardRoleMinAggregateInputType;
    _max?: BoardRoleMaxAggregateInputType;
};
export type BoardRoleGroupByOutputType = {
    id: string;
    boardId: string;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    _count: BoardRoleCountAggregateOutputType | null;
    _min: BoardRoleMinAggregateOutputType | null;
    _max: BoardRoleMaxAggregateOutputType | null;
};
type GetBoardRoleGroupByPayload<T extends BoardRoleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardRoleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardRoleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardRoleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardRoleGroupByOutputType[P]>;
}>>;
export type BoardRoleWhereInput = {
    AND?: Prisma.BoardRoleWhereInput | Prisma.BoardRoleWhereInput[];
    OR?: Prisma.BoardRoleWhereInput[];
    NOT?: Prisma.BoardRoleWhereInput | Prisma.BoardRoleWhereInput[];
    id?: Prisma.StringFilter<"BoardRole"> | string;
    boardId?: Prisma.StringFilter<"BoardRole"> | string;
    name?: Prisma.StringFilter<"BoardRole"> | string;
    permissions?: Prisma.StringNullableListFilter<"BoardRole">;
    createdAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
};
export type BoardRoleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
};
export type BoardRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    boardId_name?: Prisma.BoardRoleBoardIdNameCompoundUniqueInput;
    AND?: Prisma.BoardRoleWhereInput | Prisma.BoardRoleWhereInput[];
    OR?: Prisma.BoardRoleWhereInput[];
    NOT?: Prisma.BoardRoleWhereInput | Prisma.BoardRoleWhereInput[];
    boardId?: Prisma.StringFilter<"BoardRole"> | string;
    name?: Prisma.StringFilter<"BoardRole"> | string;
    permissions?: Prisma.StringNullableListFilter<"BoardRole">;
    createdAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
}, "id" | "boardId_name">;
export type BoardRoleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BoardRoleCountOrderByAggregateInput;
    _max?: Prisma.BoardRoleMaxOrderByAggregateInput;
    _min?: Prisma.BoardRoleMinOrderByAggregateInput;
};
export type BoardRoleScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardRoleScalarWhereWithAggregatesInput | Prisma.BoardRoleScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardRoleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardRoleScalarWhereWithAggregatesInput | Prisma.BoardRoleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BoardRole"> | string;
    boardId?: Prisma.StringWithAggregatesFilter<"BoardRole"> | string;
    name?: Prisma.StringWithAggregatesFilter<"BoardRole"> | string;
    permissions?: Prisma.StringNullableListFilter<"BoardRole">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BoardRole"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BoardRole"> | Date | string;
};
export type BoardRoleCreateInput = {
    id?: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutRolesInput;
};
export type BoardRoleUncheckedCreateInput = {
    id?: string;
    boardId: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardRoleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutRolesNestedInput;
};
export type BoardRoleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleCreateManyInput = {
    id?: string;
    boardId: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardRoleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleListRelationFilter = {
    every?: Prisma.BoardRoleWhereInput;
    some?: Prisma.BoardRoleWhereInput;
    none?: Prisma.BoardRoleWhereInput;
};
export type BoardRoleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type BoardRoleBoardIdNameCompoundUniqueInput = {
    boardId: string;
    name: string;
};
export type BoardRoleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardRoleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardRoleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardRoleCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput> | Prisma.BoardRoleCreateWithoutBoardInput[] | Prisma.BoardRoleUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardRoleCreateOrConnectWithoutBoardInput | Prisma.BoardRoleCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardRoleCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
};
export type BoardRoleUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput> | Prisma.BoardRoleCreateWithoutBoardInput[] | Prisma.BoardRoleUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardRoleCreateOrConnectWithoutBoardInput | Prisma.BoardRoleCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardRoleCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
};
export type BoardRoleUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput> | Prisma.BoardRoleCreateWithoutBoardInput[] | Prisma.BoardRoleUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardRoleCreateOrConnectWithoutBoardInput | Prisma.BoardRoleCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardRoleUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardRoleUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardRoleCreateManyBoardInputEnvelope;
    set?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    disconnect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    delete?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    connect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    update?: Prisma.BoardRoleUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardRoleUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardRoleUpdateManyWithWhereWithoutBoardInput | Prisma.BoardRoleUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardRoleScalarWhereInput | Prisma.BoardRoleScalarWhereInput[];
};
export type BoardRoleUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput> | Prisma.BoardRoleCreateWithoutBoardInput[] | Prisma.BoardRoleUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardRoleCreateOrConnectWithoutBoardInput | Prisma.BoardRoleCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardRoleUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardRoleUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardRoleCreateManyBoardInputEnvelope;
    set?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    disconnect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    delete?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    connect?: Prisma.BoardRoleWhereUniqueInput | Prisma.BoardRoleWhereUniqueInput[];
    update?: Prisma.BoardRoleUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardRoleUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardRoleUpdateManyWithWhereWithoutBoardInput | Prisma.BoardRoleUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardRoleScalarWhereInput | Prisma.BoardRoleScalarWhereInput[];
};
export type BoardRoleCreatepermissionsInput = {
    set: string[];
};
export type BoardRoleUpdatepermissionsInput = {
    set?: string[];
    push?: string | string[];
};
export type BoardRoleCreateWithoutBoardInput = {
    id?: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardRoleUncheckedCreateWithoutBoardInput = {
    id?: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardRoleCreateOrConnectWithoutBoardInput = {
    where: Prisma.BoardRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput>;
};
export type BoardRoleCreateManyBoardInputEnvelope = {
    data: Prisma.BoardRoleCreateManyBoardInput | Prisma.BoardRoleCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type BoardRoleUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardRoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardRoleUpdateWithoutBoardInput, Prisma.BoardRoleUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.BoardRoleCreateWithoutBoardInput, Prisma.BoardRoleUncheckedCreateWithoutBoardInput>;
};
export type BoardRoleUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardRoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardRoleUpdateWithoutBoardInput, Prisma.BoardRoleUncheckedUpdateWithoutBoardInput>;
};
export type BoardRoleUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.BoardRoleScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardRoleUpdateManyMutationInput, Prisma.BoardRoleUncheckedUpdateManyWithoutBoardInput>;
};
export type BoardRoleScalarWhereInput = {
    AND?: Prisma.BoardRoleScalarWhereInput | Prisma.BoardRoleScalarWhereInput[];
    OR?: Prisma.BoardRoleScalarWhereInput[];
    NOT?: Prisma.BoardRoleScalarWhereInput | Prisma.BoardRoleScalarWhereInput[];
    id?: Prisma.StringFilter<"BoardRole"> | string;
    boardId?: Prisma.StringFilter<"BoardRole"> | string;
    name?: Prisma.StringFilter<"BoardRole"> | string;
    permissions?: Prisma.StringNullableListFilter<"BoardRole">;
    createdAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardRole"> | Date | string;
};
export type BoardRoleCreateManyBoardInput = {
    id?: string;
    name: string;
    permissions?: Prisma.BoardRoleCreatepermissionsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardRoleUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.BoardRoleUpdatepermissionsInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardRoleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardRole"]>;
export type BoardRoleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardRole"]>;
export type BoardRoleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardRole"]>;
export type BoardRoleSelectScalar = {
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BoardRoleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "boardId" | "name" | "permissions" | "createdAt" | "updatedAt", ExtArgs["result"]["boardRole"]>;
export type BoardRoleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type BoardRoleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type BoardRoleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type $BoardRolePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BoardRole";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        boardId: string;
        name: string;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["boardRole"]>;
    composites: {};
};
export type BoardRoleGetPayload<S extends boolean | null | undefined | BoardRoleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardRolePayload, S>;
export type BoardRoleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardRoleCountAggregateInputType | true;
};
export interface BoardRoleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BoardRole'];
        meta: {
            name: 'BoardRole';
        };
    };
    findUnique<T extends BoardRoleFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardRoleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardRoleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardRoleFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardRoleFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardRoleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardRoleFindManyArgs>(args?: Prisma.SelectSubset<T, BoardRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardRoleCreateArgs>(args: Prisma.SelectSubset<T, BoardRoleCreateArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardRoleCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardRoleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardRoleDeleteArgs>(args: Prisma.SelectSubset<T, BoardRoleDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardRoleUpdateArgs>(args: Prisma.SelectSubset<T, BoardRoleUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardRoleDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardRoleUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardRoleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardRoleUpsertArgs>(args: Prisma.SelectSubset<T, BoardRoleUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardRoleClient<runtime.Types.Result.GetResult<Prisma.$BoardRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardRoleCountArgs>(args?: Prisma.Subset<T, BoardRoleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardRoleCountAggregateOutputType> : number>;
    aggregate<T extends BoardRoleAggregateArgs>(args: Prisma.Subset<T, BoardRoleAggregateArgs>): Prisma.PrismaPromise<GetBoardRoleAggregateType<T>>;
    groupBy<T extends BoardRoleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardRoleGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardRoleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardRoleFieldRefs;
}
export interface Prisma__BoardRoleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardRoleFieldRefs {
    readonly id: Prisma.FieldRef<"BoardRole", 'String'>;
    readonly boardId: Prisma.FieldRef<"BoardRole", 'String'>;
    readonly name: Prisma.FieldRef<"BoardRole", 'String'>;
    readonly permissions: Prisma.FieldRef<"BoardRole", 'String[]'>;
    readonly createdAt: Prisma.FieldRef<"BoardRole", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BoardRole", 'DateTime'>;
}
export type BoardRoleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    where: Prisma.BoardRoleWhereUniqueInput;
};
export type BoardRoleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    where: Prisma.BoardRoleWhereUniqueInput;
};
export type BoardRoleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardRoleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardRoleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardRoleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardRoleCreateInput, Prisma.BoardRoleUncheckedCreateInput>;
};
export type BoardRoleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardRoleCreateManyInput | Prisma.BoardRoleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardRoleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    data: Prisma.BoardRoleCreateManyInput | Prisma.BoardRoleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardRoleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardRoleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardRoleUpdateInput, Prisma.BoardRoleUncheckedUpdateInput>;
    where: Prisma.BoardRoleWhereUniqueInput;
};
export type BoardRoleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardRoleUpdateManyMutationInput, Prisma.BoardRoleUncheckedUpdateManyInput>;
    where?: Prisma.BoardRoleWhereInput;
    limit?: number;
};
export type BoardRoleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardRoleUpdateManyMutationInput, Prisma.BoardRoleUncheckedUpdateManyInput>;
    where?: Prisma.BoardRoleWhereInput;
    limit?: number;
    include?: Prisma.BoardRoleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardRoleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    where: Prisma.BoardRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardRoleCreateInput, Prisma.BoardRoleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardRoleUpdateInput, Prisma.BoardRoleUncheckedUpdateInput>;
};
export type BoardRoleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
    where: Prisma.BoardRoleWhereUniqueInput;
};
export type BoardRoleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardRoleWhereInput;
    limit?: number;
};
export type BoardRoleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardRoleSelect<ExtArgs> | null;
    omit?: Prisma.BoardRoleOmit<ExtArgs> | null;
    include?: Prisma.BoardRoleInclude<ExtArgs> | null;
};
export {};
