"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.VerificationTokenScalarFieldEnum = exports.AccountScalarFieldEnum = exports.NotificationScalarFieldEnum = exports.CommentScalarFieldEnum = exports.SubtaskScalarFieldEnum = exports.TicketScalarFieldEnum = exports.BoardColumnScalarFieldEnum = exports.BoardInvitationScalarFieldEnum = exports.BoardRoleScalarFieldEnum = exports.BoardMemberScalarFieldEnum = exports.BoardScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = require("@prisma/client/runtime/index-browser");
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Board: 'Board',
    BoardMember: 'BoardMember',
    BoardRole: 'BoardRole',
    BoardInvitation: 'BoardInvitation',
    BoardColumn: 'BoardColumn',
    Ticket: 'Ticket',
    Subtask: 'Subtask',
    Comment: 'Comment',
    Notification: 'Notification',
    Account: 'Account',
    VerificationToken: 'VerificationToken'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    firstName: 'firstName',
    lastName: 'lastName',
    nickname: 'nickname',
    isDefault: 'isDefault',
    image: 'image',
    emailVerified: 'emailVerified',
    monetizationRole: 'monetizationRole',
    workRole: 'workRole',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BoardScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    logoUrl: 'logoUrl',
    themeColor: 'themeColor',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BoardMemberScalarFieldEnum = {
    id: 'id',
    role: 'role',
    boardId: 'boardId',
    userId: 'userId',
    customRoleId: 'customRoleId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BoardRoleScalarFieldEnum = {
    id: 'id',
    boardId: 'boardId',
    name: 'name',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BoardInvitationScalarFieldEnum = {
    id: 'id',
    token: 'token',
    type: 'type',
    email: 'email',
    boardId: 'boardId',
    customRoleId: 'customRoleId',
    customRoleName: 'customRoleName',
    createdByUserId: 'createdByUserId',
    status: 'status',
    maxUses: 'maxUses',
    usedCount: 'usedCount',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.BoardColumnScalarFieldEnum = {
    id: 'id',
    title: 'title',
    position: 'position',
    boardId: 'boardId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TicketScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    sortIndex: 'sortIndex',
    priority: 'priority',
    type: 'type',
    accessPolicy: 'accessPolicy',
    boardId: 'boardId',
    columnId: 'columnId',
    estimateOriginalHours: 'estimateOriginalHours',
    estimateSpentHours: 'estimateSpentHours',
    estimateRemainingHours: 'estimateRemainingHours',
    storyPoints: 'storyPoints',
    dueDate: 'dueDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubtaskScalarFieldEnum = {
    id: 'id',
    title: 'title',
    done: 'done',
    ticketId: 'ticketId'
};
exports.CommentScalarFieldEnum = {
    id: 'id',
    body: 'body',
    ticketId: 'ticketId',
    authorId: 'authorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    boardId: 'boardId',
    ticketId: 'ticketId',
    kind: 'kind',
    title: 'title',
    message: 'message',
    isRead: 'isRead',
    readAt: 'readAt',
    createdAt: 'createdAt'
};
exports.AccountScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
};
exports.VerificationTokenScalarFieldEnum = {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map