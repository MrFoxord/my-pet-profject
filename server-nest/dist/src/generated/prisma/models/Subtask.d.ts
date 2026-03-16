import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SubtaskModel = runtime.Types.Result.DefaultSelection<Prisma.$SubtaskPayload>;
export type AggregateSubtask = {
    _count: SubtaskCountAggregateOutputType | null;
    _min: SubtaskMinAggregateOutputType | null;
    _max: SubtaskMaxAggregateOutputType | null;
};
export type SubtaskMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    done: boolean | null;
    ticketId: string | null;
};
export type SubtaskMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    done: boolean | null;
    ticketId: string | null;
};
export type SubtaskCountAggregateOutputType = {
    id: number;
    title: number;
    done: number;
    ticketId: number;
    _all: number;
};
export type SubtaskMinAggregateInputType = {
    id?: true;
    title?: true;
    done?: true;
    ticketId?: true;
};
export type SubtaskMaxAggregateInputType = {
    id?: true;
    title?: true;
    done?: true;
    ticketId?: true;
};
export type SubtaskCountAggregateInputType = {
    id?: true;
    title?: true;
    done?: true;
    ticketId?: true;
    _all?: true;
};
export type SubtaskAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubtaskCountAggregateInputType;
    _min?: SubtaskMinAggregateInputType;
    _max?: SubtaskMaxAggregateInputType;
};
export type GetSubtaskAggregateType<T extends SubtaskAggregateArgs> = {
    [P in keyof T & keyof AggregateSubtask]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubtask[P]> : Prisma.GetScalarType<T[P], AggregateSubtask[P]>;
};
export type SubtaskGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithAggregationInput | Prisma.SubtaskOrderByWithAggregationInput[];
    by: Prisma.SubtaskScalarFieldEnum[] | Prisma.SubtaskScalarFieldEnum;
    having?: Prisma.SubtaskScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubtaskCountAggregateInputType | true;
    _min?: SubtaskMinAggregateInputType;
    _max?: SubtaskMaxAggregateInputType;
};
export type SubtaskGroupByOutputType = {
    id: string;
    title: string;
    done: boolean;
    ticketId: string;
    _count: SubtaskCountAggregateOutputType | null;
    _min: SubtaskMinAggregateOutputType | null;
    _max: SubtaskMaxAggregateOutputType | null;
};
type GetSubtaskGroupByPayload<T extends SubtaskGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubtaskGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubtaskGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubtaskGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubtaskGroupByOutputType[P]>;
}>>;
export type SubtaskWhereInput = {
    AND?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    OR?: Prisma.SubtaskWhereInput[];
    NOT?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    id?: Prisma.StringFilter<"Subtask"> | string;
    title?: Prisma.StringFilter<"Subtask"> | string;
    done?: Prisma.BoolFilter<"Subtask"> | boolean;
    ticketId?: Prisma.StringFilter<"Subtask"> | string;
    ticket?: Prisma.XOR<Prisma.TicketScalarRelationFilter, Prisma.TicketWhereInput>;
};
export type SubtaskOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    ticket?: Prisma.TicketOrderByWithRelationInput;
};
export type SubtaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    OR?: Prisma.SubtaskWhereInput[];
    NOT?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    title?: Prisma.StringFilter<"Subtask"> | string;
    done?: Prisma.BoolFilter<"Subtask"> | boolean;
    ticketId?: Prisma.StringFilter<"Subtask"> | string;
    ticket?: Prisma.XOR<Prisma.TicketScalarRelationFilter, Prisma.TicketWhereInput>;
}, "id">;
export type SubtaskOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
    _count?: Prisma.SubtaskCountOrderByAggregateInput;
    _max?: Prisma.SubtaskMaxOrderByAggregateInput;
    _min?: Prisma.SubtaskMinOrderByAggregateInput;
};
export type SubtaskScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubtaskScalarWhereWithAggregatesInput | Prisma.SubtaskScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubtaskScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubtaskScalarWhereWithAggregatesInput | Prisma.SubtaskScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
    done?: Prisma.BoolWithAggregatesFilter<"Subtask"> | boolean;
    ticketId?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
};
export type SubtaskCreateInput = {
    id?: string;
    title: string;
    done?: boolean;
    ticket: Prisma.TicketCreateNestedOneWithoutSubtasksInput;
};
export type SubtaskUncheckedCreateInput = {
    id?: string;
    title: string;
    done?: boolean;
    ticketId: string;
};
export type SubtaskUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    ticket?: Prisma.TicketUpdateOneRequiredWithoutSubtasksNestedInput;
};
export type SubtaskUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubtaskCreateManyInput = {
    id?: string;
    title: string;
    done?: boolean;
    ticketId: string;
};
export type SubtaskUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type SubtaskUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    ticketId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubtaskListRelationFilter = {
    every?: Prisma.SubtaskWhereInput;
    some?: Prisma.SubtaskWhereInput;
    none?: Prisma.SubtaskWhereInput;
};
export type SubtaskOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubtaskCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
};
export type SubtaskMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
};
export type SubtaskMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    done?: Prisma.SortOrder;
    ticketId?: Prisma.SortOrder;
};
export type SubtaskCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput> | Prisma.SubtaskCreateWithoutTicketInput[] | Prisma.SubtaskUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTicketInput | Prisma.SubtaskCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.SubtaskCreateManyTicketInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUncheckedCreateNestedManyWithoutTicketInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput> | Prisma.SubtaskCreateWithoutTicketInput[] | Prisma.SubtaskUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTicketInput | Prisma.SubtaskCreateOrConnectWithoutTicketInput[];
    createMany?: Prisma.SubtaskCreateManyTicketInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput> | Prisma.SubtaskCreateWithoutTicketInput[] | Prisma.SubtaskUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTicketInput | Prisma.SubtaskCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutTicketInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.SubtaskCreateManyTicketInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutTicketInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutTicketInput | Prisma.SubtaskUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput> | Prisma.SubtaskCreateWithoutTicketInput[] | Prisma.SubtaskUncheckedCreateWithoutTicketInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTicketInput | Prisma.SubtaskCreateOrConnectWithoutTicketInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutTicketInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutTicketInput[];
    createMany?: Prisma.SubtaskCreateManyTicketInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutTicketInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutTicketInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutTicketInput | Prisma.SubtaskUpdateManyWithWhereWithoutTicketInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskCreateWithoutTicketInput = {
    id?: string;
    title: string;
    done?: boolean;
};
export type SubtaskUncheckedCreateWithoutTicketInput = {
    id?: string;
    title: string;
    done?: boolean;
};
export type SubtaskCreateOrConnectWithoutTicketInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput>;
};
export type SubtaskCreateManyTicketInputEnvelope = {
    data: Prisma.SubtaskCreateManyTicketInput | Prisma.SubtaskCreateManyTicketInput[];
    skipDuplicates?: boolean;
};
export type SubtaskUpsertWithWhereUniqueWithoutTicketInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubtaskUpdateWithoutTicketInput, Prisma.SubtaskUncheckedUpdateWithoutTicketInput>;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutTicketInput, Prisma.SubtaskUncheckedCreateWithoutTicketInput>;
};
export type SubtaskUpdateWithWhereUniqueWithoutTicketInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateWithoutTicketInput, Prisma.SubtaskUncheckedUpdateWithoutTicketInput>;
};
export type SubtaskUpdateManyWithWhereWithoutTicketInput = {
    where: Prisma.SubtaskScalarWhereInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyWithoutTicketInput>;
};
export type SubtaskScalarWhereInput = {
    AND?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
    OR?: Prisma.SubtaskScalarWhereInput[];
    NOT?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
    id?: Prisma.StringFilter<"Subtask"> | string;
    title?: Prisma.StringFilter<"Subtask"> | string;
    done?: Prisma.BoolFilter<"Subtask"> | boolean;
    ticketId?: Prisma.StringFilter<"Subtask"> | string;
};
export type SubtaskCreateManyTicketInput = {
    id?: string;
    title: string;
    done?: boolean;
};
export type SubtaskUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type SubtaskUncheckedUpdateWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type SubtaskUncheckedUpdateManyWithoutTicketInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    done?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type SubtaskSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    done?: boolean;
    ticketId?: boolean;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subtask"]>;
export type SubtaskSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    done?: boolean;
    ticketId?: boolean;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subtask"]>;
export type SubtaskSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    done?: boolean;
    ticketId?: boolean;
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subtask"]>;
export type SubtaskSelectScalar = {
    id?: boolean;
    title?: boolean;
    done?: boolean;
    ticketId?: boolean;
};
export type SubtaskOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "done" | "ticketId", ExtArgs["result"]["subtask"]>;
export type SubtaskInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
};
export type SubtaskIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
};
export type SubtaskIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ticket?: boolean | Prisma.TicketDefaultArgs<ExtArgs>;
};
export type $SubtaskPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Subtask";
    objects: {
        ticket: Prisma.$TicketPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        done: boolean;
        ticketId: string;
    }, ExtArgs["result"]["subtask"]>;
    composites: {};
};
export type SubtaskGetPayload<S extends boolean | null | undefined | SubtaskDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubtaskPayload, S>;
export type SubtaskCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubtaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubtaskCountAggregateInputType | true;
};
export interface SubtaskDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Subtask'];
        meta: {
            name: 'Subtask';
        };
    };
    findUnique<T extends SubtaskFindUniqueArgs>(args: Prisma.SelectSubset<T, SubtaskFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubtaskFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubtaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubtaskFindFirstArgs>(args?: Prisma.SelectSubset<T, SubtaskFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubtaskFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubtaskFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubtaskFindManyArgs>(args?: Prisma.SelectSubset<T, SubtaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubtaskCreateArgs>(args: Prisma.SelectSubset<T, SubtaskCreateArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubtaskCreateManyArgs>(args?: Prisma.SelectSubset<T, SubtaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubtaskCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubtaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubtaskDeleteArgs>(args: Prisma.SelectSubset<T, SubtaskDeleteArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubtaskUpdateArgs>(args: Prisma.SelectSubset<T, SubtaskUpdateArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubtaskDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubtaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubtaskUpdateManyArgs>(args: Prisma.SelectSubset<T, SubtaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubtaskUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubtaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubtaskUpsertArgs>(args: Prisma.SelectSubset<T, SubtaskUpsertArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubtaskCountArgs>(args?: Prisma.Subset<T, SubtaskCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubtaskCountAggregateOutputType> : number>;
    aggregate<T extends SubtaskAggregateArgs>(args: Prisma.Subset<T, SubtaskAggregateArgs>): Prisma.PrismaPromise<GetSubtaskAggregateType<T>>;
    groupBy<T extends SubtaskGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubtaskGroupByArgs['orderBy'];
    } : {
        orderBy?: SubtaskGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubtaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubtaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubtaskFieldRefs;
}
export interface Prisma__SubtaskClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ticket<T extends Prisma.TicketDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TicketDefaultArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubtaskFieldRefs {
    readonly id: Prisma.FieldRef<"Subtask", 'String'>;
    readonly title: Prisma.FieldRef<"Subtask", 'String'>;
    readonly done: Prisma.FieldRef<"Subtask", 'Boolean'>;
    readonly ticketId: Prisma.FieldRef<"Subtask", 'String'>;
}
export type SubtaskFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubtaskCreateInput, Prisma.SubtaskUncheckedCreateInput>;
};
export type SubtaskCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubtaskCreateManyInput | Prisma.SubtaskCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubtaskCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    data: Prisma.SubtaskCreateManyInput | Prisma.SubtaskCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubtaskIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubtaskUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubtaskUpdateInput, Prisma.SubtaskUncheckedUpdateInput>;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyInput>;
    where?: Prisma.SubtaskWhereInput;
    limit?: number;
};
export type SubtaskUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyInput>;
    where?: Prisma.SubtaskWhereInput;
    limit?: number;
    include?: Prisma.SubtaskIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubtaskUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubtaskCreateInput, Prisma.SubtaskUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubtaskUpdateInput, Prisma.SubtaskUncheckedUpdateInput>;
};
export type SubtaskDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    limit?: number;
};
export type SubtaskDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
};
export {};
