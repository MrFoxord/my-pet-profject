import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type AccountModel = runtime.Types.Result.DefaultSelection<Prisma.$AccountPayload>;
export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
};
export type AccountAvgAggregateOutputType = {
    expires_at: number | null;
};
export type AccountSumAggregateOutputType = {
    expires_at: number | null;
};
export type AccountMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    provider: string | null;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
};
export type AccountMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    provider: string | null;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
};
export type AccountCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    provider: number;
    providerAccountId: number;
    refresh_token: number;
    access_token: number;
    expires_at: number;
    token_type: number;
    scope: number;
    id_token: number;
    session_state: number;
    _all: number;
};
export type AccountAvgAggregateInputType = {
    expires_at?: true;
};
export type AccountSumAggregateInputType = {
    expires_at?: true;
};
export type AccountMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
};
export type AccountMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
};
export type AccountCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
    _all?: true;
};
export type AccountAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AccountCountAggregateInputType;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
};
export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAccount[P]> : Prisma.GetScalarType<T[P], AggregateAccount[P]>;
};
export type AccountGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithAggregationInput | Prisma.AccountOrderByWithAggregationInput[];
    by: Prisma.AccountScalarFieldEnum[] | Prisma.AccountScalarFieldEnum;
    having?: Prisma.AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
};
export type AccountGroupByOutputType = {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
};
type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AccountGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AccountGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AccountGroupByOutputType[P]>;
}>>;
export type AccountWhereInput = {
    AND?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    OR?: Prisma.AccountWhereInput[];
    NOT?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    id?: Prisma.StringFilter<"Account"> | string;
    userId?: Prisma.StringFilter<"Account"> | string;
    type?: Prisma.StringFilter<"Account"> | string;
    provider?: Prisma.StringFilter<"Account"> | string;
    providerAccountId?: Prisma.StringFilter<"Account"> | string;
    refresh_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    access_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    expires_at?: Prisma.IntNullableFilter<"Account"> | number | null;
    token_type?: Prisma.StringNullableFilter<"Account"> | string | null;
    scope?: Prisma.StringNullableFilter<"Account"> | string | null;
    id_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    session_state?: Prisma.StringNullableFilter<"Account"> | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AccountOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    providerAccountId?: Prisma.SortOrder;
    refresh_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    access_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    expires_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    token_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    scope?: Prisma.SortOrderInput | Prisma.SortOrder;
    id_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    session_state?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    provider_providerAccountId?: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput;
    AND?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    OR?: Prisma.AccountWhereInput[];
    NOT?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    userId?: Prisma.StringFilter<"Account"> | string;
    type?: Prisma.StringFilter<"Account"> | string;
    provider?: Prisma.StringFilter<"Account"> | string;
    providerAccountId?: Prisma.StringFilter<"Account"> | string;
    refresh_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    access_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    expires_at?: Prisma.IntNullableFilter<"Account"> | number | null;
    token_type?: Prisma.StringNullableFilter<"Account"> | string | null;
    scope?: Prisma.StringNullableFilter<"Account"> | string | null;
    id_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    session_state?: Prisma.StringNullableFilter<"Account"> | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "provider_providerAccountId">;
export type AccountOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    providerAccountId?: Prisma.SortOrder;
    refresh_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    access_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    expires_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    token_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    scope?: Prisma.SortOrderInput | Prisma.SortOrder;
    id_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    session_state?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.AccountCountOrderByAggregateInput;
    _avg?: Prisma.AccountAvgOrderByAggregateInput;
    _max?: Prisma.AccountMaxOrderByAggregateInput;
    _min?: Prisma.AccountMinOrderByAggregateInput;
    _sum?: Prisma.AccountSumOrderByAggregateInput;
};
export type AccountScalarWhereWithAggregatesInput = {
    AND?: Prisma.AccountScalarWhereWithAggregatesInput | Prisma.AccountScalarWhereWithAggregatesInput[];
    OR?: Prisma.AccountScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AccountScalarWhereWithAggregatesInput | Prisma.AccountScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    type?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    provider?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    providerAccountId?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    refresh_token?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    access_token?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    expires_at?: Prisma.IntNullableWithAggregatesFilter<"Account"> | number | null;
    token_type?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    scope?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    id_token?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    session_state?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
};
export type AccountCreateInput = {
    id?: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    user: Prisma.UserCreateNestedOneWithoutAccountsInput;
};
export type AccountUncheckedCreateInput = {
    id?: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
};
export type AccountUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput;
};
export type AccountUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountCreateManyInput = {
    id?: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
};
export type AccountUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountListRelationFilter = {
    every?: Prisma.AccountWhereInput;
    some?: Prisma.AccountWhereInput;
    none?: Prisma.AccountWhereInput;
};
export type AccountOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string;
    providerAccountId: string;
};
export type AccountCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    providerAccountId?: Prisma.SortOrder;
    refresh_token?: Prisma.SortOrder;
    access_token?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    token_type?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    id_token?: Prisma.SortOrder;
    session_state?: Prisma.SortOrder;
};
export type AccountAvgOrderByAggregateInput = {
    expires_at?: Prisma.SortOrder;
};
export type AccountMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    providerAccountId?: Prisma.SortOrder;
    refresh_token?: Prisma.SortOrder;
    access_token?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    token_type?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    id_token?: Prisma.SortOrder;
    session_state?: Prisma.SortOrder;
};
export type AccountMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    providerAccountId?: Prisma.SortOrder;
    refresh_token?: Prisma.SortOrder;
    access_token?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    token_type?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    id_token?: Prisma.SortOrder;
    session_state?: Prisma.SortOrder;
};
export type AccountSumOrderByAggregateInput = {
    expires_at?: Prisma.SortOrder;
};
export type AccountCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput> | Prisma.AccountCreateWithoutUserInput[] | Prisma.AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutUserInput | Prisma.AccountCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AccountCreateManyUserInputEnvelope;
    connect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
};
export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput> | Prisma.AccountCreateWithoutUserInput[] | Prisma.AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutUserInput | Prisma.AccountCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AccountCreateManyUserInputEnvelope;
    connect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
};
export type AccountUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput> | Prisma.AccountCreateWithoutUserInput[] | Prisma.AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutUserInput | Prisma.AccountCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AccountUpsertWithWhereUniqueWithoutUserInput | Prisma.AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AccountCreateManyUserInputEnvelope;
    set?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    disconnect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    delete?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    connect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    update?: Prisma.AccountUpdateWithWhereUniqueWithoutUserInput | Prisma.AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AccountUpdateManyWithWhereWithoutUserInput | Prisma.AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AccountScalarWhereInput | Prisma.AccountScalarWhereInput[];
};
export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput> | Prisma.AccountCreateWithoutUserInput[] | Prisma.AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutUserInput | Prisma.AccountCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AccountUpsertWithWhereUniqueWithoutUserInput | Prisma.AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AccountCreateManyUserInputEnvelope;
    set?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    disconnect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    delete?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    connect?: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereUniqueInput[];
    update?: Prisma.AccountUpdateWithWhereUniqueWithoutUserInput | Prisma.AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AccountUpdateManyWithWhereWithoutUserInput | Prisma.AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AccountScalarWhereInput | Prisma.AccountScalarWhereInput[];
};
export type AccountCreateWithoutUserInput = {
    id?: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
};
export type AccountUncheckedCreateWithoutUserInput = {
    id?: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
};
export type AccountCreateOrConnectWithoutUserInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput>;
};
export type AccountCreateManyUserInputEnvelope = {
    data: Prisma.AccountCreateManyUserInput | Prisma.AccountCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.AccountWhereUniqueInput;
    update: Prisma.XOR<Prisma.AccountUpdateWithoutUserInput, Prisma.AccountUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutUserInput, Prisma.AccountUncheckedCreateWithoutUserInput>;
};
export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutUserInput, Prisma.AccountUncheckedUpdateWithoutUserInput>;
};
export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.AccountScalarWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateManyMutationInput, Prisma.AccountUncheckedUpdateManyWithoutUserInput>;
};
export type AccountScalarWhereInput = {
    AND?: Prisma.AccountScalarWhereInput | Prisma.AccountScalarWhereInput[];
    OR?: Prisma.AccountScalarWhereInput[];
    NOT?: Prisma.AccountScalarWhereInput | Prisma.AccountScalarWhereInput[];
    id?: Prisma.StringFilter<"Account"> | string;
    userId?: Prisma.StringFilter<"Account"> | string;
    type?: Prisma.StringFilter<"Account"> | string;
    provider?: Prisma.StringFilter<"Account"> | string;
    providerAccountId?: Prisma.StringFilter<"Account"> | string;
    refresh_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    access_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    expires_at?: Prisma.IntNullableFilter<"Account"> | number | null;
    token_type?: Prisma.StringNullableFilter<"Account"> | string | null;
    scope?: Prisma.StringNullableFilter<"Account"> | string | null;
    id_token?: Prisma.StringNullableFilter<"Account"> | string | null;
    session_state?: Prisma.StringNullableFilter<"Account"> | string | null;
};
export type AccountCreateManyUserInput = {
    id?: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
};
export type AccountUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    providerAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type AccountSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    provider?: boolean;
    providerAccountId?: boolean;
    refresh_token?: boolean;
    access_token?: boolean;
    expires_at?: boolean;
    token_type?: boolean;
    scope?: boolean;
    id_token?: boolean;
    session_state?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["account"]>;
export type AccountSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    provider?: boolean;
    providerAccountId?: boolean;
    refresh_token?: boolean;
    access_token?: boolean;
    expires_at?: boolean;
    token_type?: boolean;
    scope?: boolean;
    id_token?: boolean;
    session_state?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["account"]>;
export type AccountSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    provider?: boolean;
    providerAccountId?: boolean;
    refresh_token?: boolean;
    access_token?: boolean;
    expires_at?: boolean;
    token_type?: boolean;
    scope?: boolean;
    id_token?: boolean;
    session_state?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["account"]>;
export type AccountSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    provider?: boolean;
    providerAccountId?: boolean;
    refresh_token?: boolean;
    access_token?: boolean;
    expires_at?: boolean;
    token_type?: boolean;
    scope?: boolean;
    id_token?: boolean;
    session_state?: boolean;
};
export type AccountOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>;
export type AccountInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AccountIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AccountIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AccountPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Account";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string | null;
        expires_at: number | null;
        token_type: string | null;
        scope: string | null;
        id_token: string | null;
        session_state: string | null;
    }, ExtArgs["result"]["account"]>;
    composites: {};
};
export type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AccountPayload, S>;
export type AccountCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AccountCountAggregateInputType | true;
};
export interface AccountDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Account'];
        meta: {
            name: 'Account';
        };
    };
    findUnique<T extends AccountFindUniqueArgs>(args: Prisma.SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AccountFindFirstArgs>(args?: Prisma.SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AccountFindManyArgs>(args?: Prisma.SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AccountCreateArgs>(args: Prisma.SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AccountCreateManyArgs>(args?: Prisma.SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AccountDeleteArgs>(args: Prisma.SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AccountUpdateArgs>(args: Prisma.SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AccountDeleteManyArgs>(args?: Prisma.SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AccountUpdateManyArgs>(args: Prisma.SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AccountUpsertArgs>(args: Prisma.SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AccountCountArgs>(args?: Prisma.Subset<T, AccountCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AccountCountAggregateOutputType> : number>;
    aggregate<T extends AccountAggregateArgs>(args: Prisma.Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>;
    groupBy<T extends AccountGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AccountGroupByArgs['orderBy'];
    } : {
        orderBy?: AccountGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AccountFieldRefs;
}
export interface Prisma__AccountClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AccountFieldRefs {
    readonly id: Prisma.FieldRef<"Account", 'String'>;
    readonly userId: Prisma.FieldRef<"Account", 'String'>;
    readonly type: Prisma.FieldRef<"Account", 'String'>;
    readonly provider: Prisma.FieldRef<"Account", 'String'>;
    readonly providerAccountId: Prisma.FieldRef<"Account", 'String'>;
    readonly refresh_token: Prisma.FieldRef<"Account", 'String'>;
    readonly access_token: Prisma.FieldRef<"Account", 'String'>;
    readonly expires_at: Prisma.FieldRef<"Account", 'Int'>;
    readonly token_type: Prisma.FieldRef<"Account", 'String'>;
    readonly scope: Prisma.FieldRef<"Account", 'String'>;
    readonly id_token: Prisma.FieldRef<"Account", 'String'>;
    readonly session_state: Prisma.FieldRef<"Account", 'String'>;
}
export type AccountFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AccountFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AccountFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AccountCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;
};
export type AccountCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AccountCreateManyInput | Prisma.AccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AccountCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    data: Prisma.AccountCreateManyInput | Prisma.AccountCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AccountIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AccountUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountUpdateInput, Prisma.AccountUncheckedUpdateInput>;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AccountUpdateManyMutationInput, Prisma.AccountUncheckedUpdateManyInput>;
    where?: Prisma.AccountWhereInput;
    limit?: number;
};
export type AccountUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountUpdateManyMutationInput, Prisma.AccountUncheckedUpdateManyInput>;
    where?: Prisma.AccountWhereInput;
    limit?: number;
    include?: Prisma.AccountIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AccountUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AccountUpdateInput, Prisma.AccountUncheckedUpdateInput>;
};
export type AccountDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    limit?: number;
};
export type AccountDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
};
export {};
