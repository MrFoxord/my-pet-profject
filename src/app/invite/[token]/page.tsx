import { Suspense } from "react";
import InvitePageContent from "@/components/invite/InvitePageContent";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitePageContent token={token} />
    </Suspense>
  );
}
