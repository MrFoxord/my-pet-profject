import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Board: "Board";
    readonly BoardMember: "BoardMember";
    readonly BoardRole: "BoardRole";
    readonly BoardInvitation: "BoardInvitation";
    readonly BoardColumn: "BoardColumn";
    readonly Ticket: "Ticket";
    readonly Subtask: "Subtask";
    readonly Comment: "Comment";
    readonly Account: "Account";
    readonly VerificationToken: "VerificationToken";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly name: "name";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly nickname: "nickname";
    readonly isDefault: "isDefault";
    readonly image: "image";
    readonly emailVerified: "emailVerified";
    readonly monetizationRole: "monetizationRole";
    readonly workRole: "workRole";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const BoardScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly logoUrl: "logoUrl";
    readonly themeColor: "themeColor";
    readonly ownerId: "ownerId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BoardScalarFieldEnum = (typeof BoardScalarFieldEnum)[keyof typeof BoardScalarFieldEnum];
export declare const BoardMemberScalarFieldEnum: {
    readonly id: "id";
    readonly role: "role";
    readonly boardId: "boardId";
    readonly userId: "userId";
    readonly customRoleId: "customRoleId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BoardMemberScalarFieldEnum = (typeof BoardMemberScalarFieldEnum)[keyof typeof BoardMemberScalarFieldEnum];
export declare const BoardRoleScalarFieldEnum: {
    readonly id: "id";
    readonly boardId: "boardId";
    readonly name: "name";
    readonly permissions: "permissions";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BoardRoleScalarFieldEnum = (typeof BoardRoleScalarFieldEnum)[keyof typeof BoardRoleScalarFieldEnum];
export declare const BoardInvitationScalarFieldEnum: {
    readonly id: "id";
    readonly token: "token";
    readonly email: "email";
    readonly boardId: "boardId";
    readonly role: "role";
    readonly status: "status";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type BoardInvitationScalarFieldEnum = (typeof BoardInvitationScalarFieldEnum)[keyof typeof BoardInvitationScalarFieldEnum];
export declare const BoardColumnScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly position: "position";
    readonly boardId: "boardId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BoardColumnScalarFieldEnum = (typeof BoardColumnScalarFieldEnum)[keyof typeof BoardColumnScalarFieldEnum];
export declare const TicketScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly status: "status";
    readonly sortIndex: "sortIndex";
    readonly priority: "priority";
    readonly type: "type";
    readonly accessPolicy: "accessPolicy";
    readonly boardId: "boardId";
    readonly columnId: "columnId";
    readonly estimateOriginalHours: "estimateOriginalHours";
    readonly estimateSpentHours: "estimateSpentHours";
    readonly estimateRemainingHours: "estimateRemainingHours";
    readonly storyPoints: "storyPoints";
    readonly dueDate: "dueDate";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum];
export declare const SubtaskScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly done: "done";
    readonly ticketId: "ticketId";
};
export type SubtaskScalarFieldEnum = (typeof SubtaskScalarFieldEnum)[keyof typeof SubtaskScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly body: "body";
    readonly ticketId: "ticketId";
    readonly authorId: "authorId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly provider: "provider";
    readonly providerAccountId: "providerAccountId";
    readonly refresh_token: "refresh_token";
    readonly access_token: "access_token";
    readonly expires_at: "expires_at";
    readonly token_type: "token_type";
    readonly scope: "scope";
    readonly id_token: "id_token";
    readonly session_state: "session_state";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationTokenScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly token: "token";
    readonly expires: "expires";
};
export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
