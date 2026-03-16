declare const WORK_ROLES: readonly ["CLIENT", "EXECUTOR", "ORGANIZER", "CEO"];
export declare class UpdateDefaultProfileDto {
    firstName: string;
    lastName: string;
    nickname?: string;
    workRole: (typeof WORK_ROLES)[number];
}
export {};
