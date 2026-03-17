import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
type PrismaInstance = InstanceType<typeof PrismaClient>;
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly pool;
    private readonly _client;
    constructor();
    get board(): import("../generated/prisma/models").BoardDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get boardColumn(): import("../generated/prisma/models").BoardColumnDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get boardMember(): import("../generated/prisma/models").BoardMemberDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get ticket(): import("../generated/prisma/models").TicketDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get boardRole(): import("../generated/prisma/models").BoardRoleDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get boardInvitation(): import("../generated/prisma/models").BoardInvitationDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get subtask(): import("../generated/prisma/models").SubtaskDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get comment(): import("../generated/prisma/models").CommentDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    get user(): import("../generated/prisma/models").UserDelegate<import("@prisma/client/runtime/client").InternalArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    $transaction<T>(fn: (tx: Omit<PrismaInstance, '$transaction' | '$connect' | '$disconnect'>) => Promise<T>): Promise<T>;
    $transaction<T extends readonly unknown[]>(ops: [...{
        [K in keyof T]: Promise<T[K]>;
    }]): Promise<T>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
