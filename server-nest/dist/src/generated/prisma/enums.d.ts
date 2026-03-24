export declare const BoardMemberRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
    readonly VIEWER: "VIEWER";
};
export type BoardMemberRole = (typeof BoardMemberRole)[keyof typeof BoardMemberRole];
export declare const InvitationType: {
    readonly PERSONAL: "PERSONAL";
    readonly SHARED: "SHARED";
};
export type InvitationType = (typeof InvitationType)[keyof typeof InvitationType];
export declare const MonetizationRole: {
    readonly FREE: "FREE";
    readonly SUBMITTED: "SUBMITTED";
    readonly PREMIUM: "PREMIUM";
};
export type MonetizationRole = (typeof MonetizationRole)[keyof typeof MonetizationRole];
export declare const WorkRole: {
    readonly CLIENT: "CLIENT";
    readonly EXECUTOR: "EXECUTOR";
    readonly ORGANIZER: "ORGANIZER";
    readonly CEO: "CEO";
};
export type WorkRole = (typeof WorkRole)[keyof typeof WorkRole];
