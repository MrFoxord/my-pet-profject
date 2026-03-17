import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardColumnModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardColumnPayload>;
export type AggregateBoardColumn = {
    _count: BoardColumnCountAggregateOutputType | null;
    _avg: BoardColumnAvgAggregateOutputType | null;
    _sum: BoardColumnSumAggregateOutputType | null;
    _min: BoardColumnMinAggregateOutputType | null;
    _max: BoardColumnMaxAggregateOutputType | null;
};
export type BoardColumnAvgAggregateOutputType = {
    position: number | null;
};
export type BoardColumnSumAggregateOutputType = {
    position: number | null;
};
export type BoardColumnMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    position: number | null;
    boardId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardColumnMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    position: number | null;
    boardId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardColumnCountAggregateOutputType = {
    id: number;
    title: number;
    position: number;
    boardId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BoardColumnAvgAggregateInputType = {
    position?: true;
};
export type BoardColumnSumAggregateInputType = {
    position?: true;
};
export type BoardColumnMinAggregateInputType = {
    id?: true;
    title?: true;
    position?: true;
    boardId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardColumnMaxAggregateInputType = {
    id?: true;
    title?: true;
    position?: true;
    boardId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardColumnCountAggregateInputType = {
    id?: true;
    title?: true;
    position?: true;
    boardId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BoardColumnAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardColumnWhereInput;
    orderBy?: Prisma.BoardColumnOrderByWithRelationInput | Prisma.BoardColumnOrderByWithRelationInput[];
    cursor?: Prisma.BoardColumnWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardColumnCountAggregateInputType;
    _avg?: BoardColumnAvgAggregateInputType;
    _sum?: BoardColumnSumAggregateInputType;
    _min?: BoardColumnMinAggregateInputType;
    _max?: BoardColumnMaxAggregateInputType;
};
export type GetBoardColumnAggregateType<T extends BoardColumnAggregateArgs> = {
    [P in keyof T & keyof AggregateBoardColumn]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoardColumn[P]> : Prisma.GetScalarType<T[P], AggregateBoardColumn[P]>;
};
export type BoardColumnGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardColumnWhereInput;
    orderBy?: Prisma.BoardColumnOrderByWithAggregationInput | Prisma.BoardColumnOrderByWithAggregationInput[];
    by: Prisma.BoardColumnScalarFieldEnum[] | Prisma.BoardColumnScalarFieldEnum;
    having?: Prisma.BoardColumnScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardColumnCountAggregateInputType | true;
    _avg?: BoardColumnAvgAggregateInputType;
    _sum?: BoardColumnSumAggregateInputType;
    _min?: BoardColumnMinAggregateInputType;
    _max?: BoardColumnMaxAggregateInputType;
};
export type BoardColumnGroupByOutputType = {
    id: string;
    title: string;
    position: number;
    boardId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: BoardColumnCountAggregateOutputType | null;
    _avg: BoardColumnAvgAggregateOutputType | null;
    _sum: BoardColumnSumAggregateOutputType | null;
    _min: BoardColumnMinAggregateOutputType | null;
    _max: BoardColumnMaxAggregateOutputType | null;
};
type GetBoardColumnGroupByPayload<T extends BoardColumnGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardColumnGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardColumnGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardColumnGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardColumnGroupByOutputType[P]>;
}>>;
export type BoardColumnWhereInput = {
    AND?: Prisma.BoardColumnWhereInput | Prisma.BoardColumnWhereInput[];
    OR?: Prisma.BoardColumnWhereInput[];
    NOT?: Prisma.BoardColumnWhereInput | Prisma.BoardColumnWhereInput[];
    id?: Prisma.StringFilter<"BoardColumn"> | string;
    title?: Prisma.StringFilter<"BoardColumn"> | string;
    position?: Prisma.IntFilter<"BoardColumn"> | number;
    boardId?: Prisma.StringFilter<"BoardColumn"> | string;
    createdAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    tickets?: Prisma.TicketListRelationFilter;
};
export type BoardColumnOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
    tickets?: Prisma.TicketOrderByRelationAggregateInput;
};
export type BoardColumnWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BoardColumnWhereInput | Prisma.BoardColumnWhereInput[];
    OR?: Prisma.BoardColumnWhereInput[];
    NOT?: Prisma.BoardColumnWhereInput | Prisma.BoardColumnWhereInput[];
    title?: Prisma.StringFilter<"BoardColumn"> | string;
    position?: Prisma.IntFilter<"BoardColumn"> | number;
    boardId?: Prisma.StringFilter<"BoardColumn"> | string;
    createdAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    tickets?: Prisma.TicketListRelationFilter;
}, "id">;
export type BoardColumnOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BoardColumnCountOrderByAggregateInput;
    _avg?: Prisma.BoardColumnAvgOrderByAggregateInput;
    _max?: Prisma.BoardColumnMaxOrderByAggregateInput;
    _min?: Prisma.BoardColumnMinOrderByAggregateInput;
    _sum?: Prisma.BoardColumnSumOrderByAggregateInput;
};
export type BoardColumnScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardColumnScalarWhereWithAggregatesInput | Prisma.BoardColumnScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardColumnScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardColumnScalarWhereWithAggregatesInput | Prisma.BoardColumnScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BoardColumn"> | string;
    title?: Prisma.StringWithAggregatesFilter<"BoardColumn"> | string;
    position?: Prisma.IntWithAggregatesFilter<"BoardColumn"> | number;
    boardId?: Prisma.StringWithAggregatesFilter<"BoardColumn"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BoardColumn"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BoardColumn"> | Date | string;
};
export type BoardColumnCreateInput = {
    id?: string;
    title: string;
    position: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutColumnsInput;
    tickets?: Prisma.TicketCreateNestedManyWithoutColumnInput;
};
export type BoardColumnUncheckedCreateInput = {
    id?: string;
    title: string;
    position: number;
    boardId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutColumnInput;
};
export type BoardColumnUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutColumnsNestedInput;
    tickets?: Prisma.TicketUpdateManyWithoutColumnNestedInput;
};
export type BoardColumnUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutColumnNestedInput;
};
export type BoardColumnCreateManyInput = {
    id?: string;
    title: string;
    position: number;
    boardId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardColumnUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardColumnUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardColumnListRelationFilter = {
    every?: Prisma.BoardColumnWhereInput;
    some?: Prisma.BoardColumnWhereInput;
    none?: Prisma.BoardColumnWhereInput;
};
export type BoardColumnOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardColumnCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardColumnAvgOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type BoardColumnMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardColumnMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardColumnSumOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type BoardColumnNullableScalarRelationFilter = {
    is?: Prisma.BoardColumnWhereInput | null;
    isNot?: Prisma.BoardColumnWhereInput | null;
};
export type BoardColumnCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput> | Prisma.BoardColumnCreateWithoutBoardInput[] | Prisma.BoardColumnUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutBoardInput | Prisma.BoardColumnCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardColumnCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
};
export type BoardColumnUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput> | Prisma.BoardColumnCreateWithoutBoardInput[] | Prisma.BoardColumnUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutBoardInput | Prisma.BoardColumnCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardColumnCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
};
export type BoardColumnUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput> | Prisma.BoardColumnCreateWithoutBoardInput[] | Prisma.BoardColumnUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutBoardInput | Prisma.BoardColumnCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardColumnUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardColumnUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardColumnCreateManyBoardInputEnvelope;
    set?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    disconnect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    delete?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    connect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    update?: Prisma.BoardColumnUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardColumnUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardColumnUpdateManyWithWhereWithoutBoardInput | Prisma.BoardColumnUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardColumnScalarWhereInput | Prisma.BoardColumnScalarWhereInput[];
};
export type BoardColumnUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput> | Prisma.BoardColumnCreateWithoutBoardInput[] | Prisma.BoardColumnUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutBoardInput | Prisma.BoardColumnCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardColumnUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardColumnUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardColumnCreateManyBoardInputEnvelope;
    set?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    disconnect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    delete?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    connect?: Prisma.BoardColumnWhereUniqueInput | Prisma.BoardColumnWhereUniqueInput[];
    update?: Prisma.BoardColumnUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardColumnUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardColumnUpdateManyWithWhereWithoutBoardInput | Prisma.BoardColumnUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardColumnScalarWhereInput | Prisma.BoardColumnScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BoardColumnCreateNestedOneWithoutTicketsInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutTicketsInput, Prisma.BoardColumnUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutTicketsInput;
    connect?: Prisma.BoardColumnWhereUniqueInput;
};
export type BoardColumnUpdateOneWithoutTicketsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardColumnCreateWithoutTicketsInput, Prisma.BoardColumnUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.BoardColumnCreateOrConnectWithoutTicketsInput;
    upsert?: Prisma.BoardColumnUpsertWithoutTicketsInput;
    disconnect?: Prisma.BoardColumnWhereInput | boolean;
    delete?: Prisma.BoardColumnWhereInput | boolean;
    connect?: Prisma.BoardColumnWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardColumnUpdateToOneWithWhereWithoutTicketsInput, Prisma.BoardColumnUpdateWithoutTicketsInput>, Prisma.BoardColumnUncheckedUpdateWithoutTicketsInput>;
};
export type BoardColumnCreateWithoutBoardInput = {
    id?: string;
    title: string;
    position: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketCreateNestedManyWithoutColumnInput;
};
export type BoardColumnUncheckedCreateWithoutBoardInput = {
    id?: string;
    title: string;
    position: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutColumnInput;
};
export type BoardColumnCreateOrConnectWithoutBoardInput = {
    where: Prisma.BoardColumnWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput>;
};
export type BoardColumnCreateManyBoardInputEnvelope = {
    data: Prisma.BoardColumnCreateManyBoardInput | Prisma.BoardColumnCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type BoardColumnUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardColumnWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardColumnUpdateWithoutBoardInput, Prisma.BoardColumnUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.BoardColumnCreateWithoutBoardInput, Prisma.BoardColumnUncheckedCreateWithoutBoardInput>;
};
export type BoardColumnUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardColumnWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardColumnUpdateWithoutBoardInput, Prisma.BoardColumnUncheckedUpdateWithoutBoardInput>;
};
export type BoardColumnUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.BoardColumnScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardColumnUpdateManyMutationInput, Prisma.BoardColumnUncheckedUpdateManyWithoutBoardInput>;
};
export type BoardColumnScalarWhereInput = {
    AND?: Prisma.BoardColumnScalarWhereInput | Prisma.BoardColumnScalarWhereInput[];
    OR?: Prisma.BoardColumnScalarWhereInput[];
    NOT?: Prisma.BoardColumnScalarWhereInput | Prisma.BoardColumnScalarWhereInput[];
    id?: Prisma.StringFilter<"BoardColumn"> | string;
    title?: Prisma.StringFilter<"BoardColumn"> | string;
    position?: Prisma.IntFilter<"BoardColumn"> | number;
    boardId?: Prisma.StringFilter<"BoardColumn"> | string;
    createdAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BoardColumn"> | Date | string;
};
export type BoardColumnCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    position: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutColumnsInput;
};
export type BoardColumnUncheckedCreateWithoutTicketsInput = {
    id?: string;
    title: string;
    position: number;
    boardId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardColumnCreateOrConnectWithoutTicketsInput = {
    where: Prisma.BoardColumnWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardColumnCreateWithoutTicketsInput, Prisma.BoardColumnUncheckedCreateWithoutTicketsInput>;
};
export type BoardColumnUpsertWithoutTicketsInput = {
    update: Prisma.XOR<Prisma.BoardColumnUpdateWithoutTicketsInput, Prisma.BoardColumnUncheckedUpdateWithoutTicketsInput>;
    create: Prisma.XOR<Prisma.BoardColumnCreateWithoutTicketsInput, Prisma.BoardColumnUncheckedCreateWithoutTicketsInput>;
    where?: Prisma.BoardColumnWhereInput;
};
export type BoardColumnUpdateToOneWithWhereWithoutTicketsInput = {
    where?: Prisma.BoardColumnWhereInput;
    data: Prisma.XOR<Prisma.BoardColumnUpdateWithoutTicketsInput, Prisma.BoardColumnUncheckedUpdateWithoutTicketsInput>;
};
export type BoardColumnUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutColumnsNestedInput;
};
export type BoardColumnUncheckedUpdateWithoutTicketsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardColumnCreateManyBoardInput = {
    id?: string;
    title: string;
    position: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardColumnUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUpdateManyWithoutColumnNestedInput;
};
export type BoardColumnUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutColumnNestedInput;
};
export type BoardColumnUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardColumnCountOutputType = {
    tickets: number;
};
export type BoardColumnCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tickets?: boolean | BoardColumnCountOutputTypeCountTicketsArgs;
};
export type BoardColumnCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnCountOutputTypeSelect<ExtArgs> | null;
};
export type BoardColumnCountOutputTypeCountTicketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
};
export type BoardColumnSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    position?: boolean;
    boardId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    tickets?: boolean | Prisma.BoardColumn$ticketsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardColumnCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardColumn"]>;
export type BoardColumnSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    position?: boolean;
    boardId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardColumn"]>;
export type BoardColumnSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    position?: boolean;
    boardId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardColumn"]>;
export type BoardColumnSelectScalar = {
    id?: boolean;
    title?: boolean;
    position?: boolean;
    boardId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BoardColumnOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "position" | "boardId" | "createdAt" | "updatedAt", ExtArgs["result"]["boardColumn"]>;
export type BoardColumnInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    tickets?: boolean | Prisma.BoardColumn$ticketsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardColumnCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BoardColumnIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type BoardColumnIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type $BoardColumnPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BoardColumn";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
        tickets: Prisma.$TicketPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        position: number;
        boardId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["boardColumn"]>;
    composites: {};
};
export type BoardColumnGetPayload<S extends boolean | null | undefined | BoardColumnDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload, S>;
export type BoardColumnCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardColumnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardColumnCountAggregateInputType | true;
};
export interface BoardColumnDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BoardColumn'];
        meta: {
            name: 'BoardColumn';
        };
    };
    findUnique<T extends BoardColumnFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardColumnFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardColumnFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardColumnFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardColumnFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardColumnFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardColumnFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardColumnFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardColumnFindManyArgs>(args?: Prisma.SelectSubset<T, BoardColumnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardColumnCreateArgs>(args: Prisma.SelectSubset<T, BoardColumnCreateArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardColumnCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardColumnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardColumnCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardColumnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardColumnDeleteArgs>(args: Prisma.SelectSubset<T, BoardColumnDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardColumnUpdateArgs>(args: Prisma.SelectSubset<T, BoardColumnUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardColumnDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardColumnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardColumnUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardColumnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardColumnUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardColumnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardColumnUpsertArgs>(args: Prisma.SelectSubset<T, BoardColumnUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardColumnClient<runtime.Types.Result.GetResult<Prisma.$BoardColumnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardColumnCountArgs>(args?: Prisma.Subset<T, BoardColumnCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardColumnCountAggregateOutputType> : number>;
    aggregate<T extends BoardColumnAggregateArgs>(args: Prisma.Subset<T, BoardColumnAggregateArgs>): Prisma.PrismaPromise<GetBoardColumnAggregateType<T>>;
    groupBy<T extends BoardColumnGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardColumnGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardColumnGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardColumnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardColumnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardColumnFieldRefs;
}
export interface Prisma__BoardColumnClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tickets<T extends Prisma.BoardColumn$ticketsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardColumn$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardColumnFieldRefs {
    readonly id: Prisma.FieldRef<"BoardColumn", 'String'>;
    readonly title: Prisma.FieldRef<"BoardColumn", 'String'>;
    readonly position: Prisma.FieldRef<"BoardColumn", 'Int'>;
    readonly boardId: Prisma.FieldRef<"BoardColumn", 'String'>;
    readonly createdAt: Prisma.FieldRef<"BoardColumn", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BoardColumn", 'DateTime'>;
}
export type BoardColumnFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    where: Prisma.BoardColumnWhereUniqueInput;
};
export type BoardColumnFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    where: Prisma.BoardColumnWhereUniqueInput;
};
export type BoardColumnFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardColumnFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardColumnFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardColumnCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardColumnCreateInput, Prisma.BoardColumnUncheckedCreateInput>;
};
export type BoardColumnCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardColumnCreateManyInput | Prisma.BoardColumnCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardColumnCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    data: Prisma.BoardColumnCreateManyInput | Prisma.BoardColumnCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardColumnIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardColumnUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardColumnUpdateInput, Prisma.BoardColumnUncheckedUpdateInput>;
    where: Prisma.BoardColumnWhereUniqueInput;
};
export type BoardColumnUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardColumnUpdateManyMutationInput, Prisma.BoardColumnUncheckedUpdateManyInput>;
    where?: Prisma.BoardColumnWhereInput;
    limit?: number;
};
export type BoardColumnUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardColumnUpdateManyMutationInput, Prisma.BoardColumnUncheckedUpdateManyInput>;
    where?: Prisma.BoardColumnWhereInput;
    limit?: number;
    include?: Prisma.BoardColumnIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardColumnUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    where: Prisma.BoardColumnWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardColumnCreateInput, Prisma.BoardColumnUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardColumnUpdateInput, Prisma.BoardColumnUncheckedUpdateInput>;
};
export type BoardColumnDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
    where: Prisma.BoardColumnWhereUniqueInput;
};
export type BoardColumnDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardColumnWhereInput;
    limit?: number;
};
export type BoardColumn$ticketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardColumnDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardColumnSelect<ExtArgs> | null;
    omit?: Prisma.BoardColumnOmit<ExtArgs> | null;
    include?: Prisma.BoardColumnInclude<ExtArgs> | null;
};
export {};
