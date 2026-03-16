import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type VerificationTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$VerificationTokenPayload>;
export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null;
    _min: VerificationTokenMinAggregateOutputType | null;
    _max: VerificationTokenMaxAggregateOutputType | null;
};
export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null;
    token: string | null;
    expires: Date | null;
};
export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null;
    token: string | null;
    expires: Date | null;
};
export type VerificationTokenCountAggregateOutputType = {
    identifier: number;
    token: number;
    expires: number;
    _all: number;
};
export type VerificationTokenMinAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
};
export type VerificationTokenMaxAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
};
export type VerificationTokenCountAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
    _all?: true;
};
export type VerificationTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VerificationTokenWhereInput;
    orderBy?: Prisma.VerificationTokenOrderByWithRelationInput | Prisma.VerificationTokenOrderByWithRelationInput[];
    cursor?: Prisma.VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VerificationTokenCountAggregateInputType;
    _min?: VerificationTokenMinAggregateInputType;
    _max?: VerificationTokenMaxAggregateInputType;
};
export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVerificationToken[P]> : Prisma.GetScalarType<T[P], AggregateVerificationToken[P]>;
};
export type VerificationTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VerificationTokenWhereInput;
    orderBy?: Prisma.VerificationTokenOrderByWithAggregationInput | Prisma.VerificationTokenOrderByWithAggregationInput[];
    by: Prisma.VerificationTokenScalarFieldEnum[] | Prisma.VerificationTokenScalarFieldEnum;
    having?: Prisma.VerificationTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VerificationTokenCountAggregateInputType | true;
    _min?: VerificationTokenMinAggregateInputType;
    _max?: VerificationTokenMaxAggregateInputType;
};
export type VerificationTokenGroupByOutputType = {
    identifier: string;
    token: string;
    expires: Date;
    _count: VerificationTokenCountAggregateOutputType | null;
    _min: VerificationTokenMinAggregateOutputType | null;
    _max: VerificationTokenMaxAggregateOutputType | null;
};
type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VerificationTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VerificationTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>;
}>>;
export type VerificationTokenWhereInput = {
    AND?: Prisma.VerificationTokenWhereInput | Prisma.VerificationTokenWhereInput[];
    OR?: Prisma.VerificationTokenWhereInput[];
    NOT?: Prisma.VerificationTokenWhereInput | Prisma.VerificationTokenWhereInput[];
    identifier?: Prisma.StringFilter<"VerificationToken"> | string;
    token?: Prisma.StringFilter<"VerificationToken"> | string;
    expires?: Prisma.DateTimeFilter<"VerificationToken"> | Date | string;
};
export type VerificationTokenOrderByWithRelationInput = {
    identifier?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
};
export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string;
    identifier_token?: Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput;
    AND?: Prisma.VerificationTokenWhereInput | Prisma.VerificationTokenWhereInput[];
    OR?: Prisma.VerificationTokenWhereInput[];
    NOT?: Prisma.VerificationTokenWhereInput | Prisma.VerificationTokenWhereInput[];
    identifier?: Prisma.StringFilter<"VerificationToken"> | string;
    expires?: Prisma.DateTimeFilter<"VerificationToken"> | Date | string;
}, "token" | "identifier_token">;
export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
    _count?: Prisma.VerificationTokenCountOrderByAggregateInput;
    _max?: Prisma.VerificationTokenMaxOrderByAggregateInput;
    _min?: Prisma.VerificationTokenMinOrderByAggregateInput;
};
export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.VerificationTokenScalarWhereWithAggregatesInput | Prisma.VerificationTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.VerificationTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VerificationTokenScalarWhereWithAggregatesInput | Prisma.VerificationTokenScalarWhereWithAggregatesInput[];
    identifier?: Prisma.StringWithAggregatesFilter<"VerificationToken"> | string;
    token?: Prisma.StringWithAggregatesFilter<"VerificationToken"> | string;
    expires?: Prisma.DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string;
};
export type VerificationTokenCreateInput = {
    identifier: string;
    token: string;
    expires: Date | string;
};
export type VerificationTokenUncheckedCreateInput = {
    identifier: string;
    token: string;
    expires: Date | string;
};
export type VerificationTokenUpdateInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VerificationTokenUncheckedUpdateInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VerificationTokenCreateManyInput = {
    identifier: string;
    token: string;
    expires: Date | string;
};
export type VerificationTokenUpdateManyMutationInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expires?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string;
    token: string;
};
export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
};
export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
};
export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expires?: Prisma.SortOrder;
};
export type VerificationTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    token?: boolean;
    expires?: boolean;
}, ExtArgs["result"]["verificationToken"]>;
export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    token?: boolean;
    expires?: boolean;
}, ExtArgs["result"]["verificationToken"]>;
export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    token?: boolean;
    expires?: boolean;
}, ExtArgs["result"]["verificationToken"]>;
export type VerificationTokenSelectScalar = {
    identifier?: boolean;
    token?: boolean;
    expires?: boolean;
};
export type VerificationTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>;
export type $VerificationTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VerificationToken";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        identifier: string;
        token: string;
        expires: Date;
    }, ExtArgs["result"]["verificationToken"]>;
    composites: {};
};
export type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload, S>;
export type VerificationTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VerificationTokenCountAggregateInputType | true;
};
export interface VerificationTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'];
        meta: {
            name: 'VerificationToken';
        };
    };
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VerificationTokenFindManyArgs>(args?: Prisma.SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VerificationTokenCreateArgs>(args: Prisma.SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VerificationTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VerificationTokenDeleteArgs>(args: Prisma.SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VerificationTokenUpdateArgs>(args: Prisma.SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VerificationTokenUpsertArgs>(args: Prisma.SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__VerificationTokenClient<runtime.Types.Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VerificationTokenCountArgs>(args?: Prisma.Subset<T, VerificationTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VerificationTokenCountAggregateOutputType> : number>;
    aggregate<T extends VerificationTokenAggregateArgs>(args: Prisma.Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>;
    groupBy<T extends VerificationTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VerificationTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: VerificationTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VerificationTokenFieldRefs;
}
export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VerificationTokenFieldRefs {
    readonly identifier: Prisma.FieldRef<"VerificationToken", 'String'>;
    readonly token: Prisma.FieldRef<"VerificationToken", 'String'>;
    readonly expires: Prisma.FieldRef<"VerificationToken", 'DateTime'>;
}
export type VerificationTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where: Prisma.VerificationTokenWhereUniqueInput;
};
export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where: Prisma.VerificationTokenWhereUniqueInput;
};
export type VerificationTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where?: Prisma.VerificationTokenWhereInput;
    orderBy?: Prisma.VerificationTokenOrderByWithRelationInput | Prisma.VerificationTokenOrderByWithRelationInput[];
    cursor?: Prisma.VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VerificationTokenScalarFieldEnum | Prisma.VerificationTokenScalarFieldEnum[];
};
export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where?: Prisma.VerificationTokenWhereInput;
    orderBy?: Prisma.VerificationTokenOrderByWithRelationInput | Prisma.VerificationTokenOrderByWithRelationInput[];
    cursor?: Prisma.VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VerificationTokenScalarFieldEnum | Prisma.VerificationTokenScalarFieldEnum[];
};
export type VerificationTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where?: Prisma.VerificationTokenWhereInput;
    orderBy?: Prisma.VerificationTokenOrderByWithRelationInput | Prisma.VerificationTokenOrderByWithRelationInput[];
    cursor?: Prisma.VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VerificationTokenScalarFieldEnum | Prisma.VerificationTokenScalarFieldEnum[];
};
export type VerificationTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VerificationTokenCreateInput, Prisma.VerificationTokenUncheckedCreateInput>;
};
export type VerificationTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VerificationTokenCreateManyInput | Prisma.VerificationTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    data: Prisma.VerificationTokenCreateManyInput | Prisma.VerificationTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VerificationTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VerificationTokenUpdateInput, Prisma.VerificationTokenUncheckedUpdateInput>;
    where: Prisma.VerificationTokenWhereUniqueInput;
};
export type VerificationTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VerificationTokenUpdateManyMutationInput, Prisma.VerificationTokenUncheckedUpdateManyInput>;
    where?: Prisma.VerificationTokenWhereInput;
    limit?: number;
};
export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VerificationTokenUpdateManyMutationInput, Prisma.VerificationTokenUncheckedUpdateManyInput>;
    where?: Prisma.VerificationTokenWhereInput;
    limit?: number;
};
export type VerificationTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where: Prisma.VerificationTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.VerificationTokenCreateInput, Prisma.VerificationTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VerificationTokenUpdateInput, Prisma.VerificationTokenUncheckedUpdateInput>;
};
export type VerificationTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
    where: Prisma.VerificationTokenWhereUniqueInput;
};
export type VerificationTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VerificationTokenWhereInput;
    limit?: number;
};
export type VerificationTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VerificationTokenSelect<ExtArgs> | null;
    omit?: Prisma.VerificationTokenOmit<ExtArgs> | null;
};
export {};
