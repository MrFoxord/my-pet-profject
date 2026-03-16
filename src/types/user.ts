export type MonetizationRole = "FREE" | "SUBMITTED" | "PREMIUM";

export type WorkRole = "CLIENT" | "EXECUTOR" | "ORGANIZER" | "CEO";

export interface AppUser {
    id: string;
    email: string | null;
    name: string | null;
    image?: string | null;
    monetizationRole: MonetizationRole;
    workRole: WorkRole;
}