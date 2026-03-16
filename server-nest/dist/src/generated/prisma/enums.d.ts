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
