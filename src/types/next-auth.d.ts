import { DefaultSession } from "next-auth";
import { MonetizationRole, WorkRole } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      monetizationRole: MonetizationRole;
      workRole: WorkRole;
    };
  }

  interface User {
    id: string;
    monetizationRole?: MonetizationRole;
    workRole?: WorkRole;
  }
}
