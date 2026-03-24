import { redirect } from "next/navigation";

interface RegisterPageProps {
	searchParams: Promise<{ redirectTo?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
	const params = await searchParams;
	const redirectTo = params.redirectTo;

	if (redirectTo && redirectTo.startsWith("/")) {
		redirect(`/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	redirect("/auth/signin");
}
