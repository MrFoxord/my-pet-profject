import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReactNode } from "react";

export default async function BoardsLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
