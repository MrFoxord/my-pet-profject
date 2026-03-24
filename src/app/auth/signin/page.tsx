import Link from "next/link";
import { redirect } from "next/navigation";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";
import { auth, authProviderStates, signIn } from "@/auth";

interface SignInPageProps {
	searchParams: Promise<{ redirectTo?: string }>;
}

function normalizeRedirectTarget(redirectTo?: string) {
	if (!redirectTo || !redirectTo.startsWith("/")) {
		return "/boards";
	}

	return redirectTo;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
	const t = await getTranslations("auth");
	const session = await auth();
	const params = await searchParams;
	const redirectTo = normalizeRedirectTarget(params.redirectTo);

	if (session) {
		redirect(redirectTo);
	}

	return (
		<Container maxWidth="sm" sx={{ py: 10 }}>
			<Card sx={{ borderRadius: 4, boxShadow: 12 }}>
				<CardContent sx={{ p: 5 }}>
					<Stack spacing={3}>
						<Box>
							<Typography variant="overline">{t("authorization")}</Typography>
							<Typography variant="h4" sx={{ fontWeight: 700 }}>
								{t("signInTitle")}
							</Typography>
							<Typography color="text.secondary" sx={{ mt: 1 }}>
								{t("signInDescription")}
							</Typography>
						</Box>

						<Stack spacing={1.5}>
							{authProviderStates.map((provider) => (
								<form
									key={provider.id}
									action={async () => {
										"use server";

										await signIn(provider.id, { redirectTo });
									}}
								>
									<Button
										type="submit"
										variant={provider.enabled ? "contained" : "outlined"}
										disabled={!provider.enabled}
										fullWidth
										size="large"
										sx={{ minHeight: 52 }}
									>
										{provider.enabled
											? t("continueWith", { provider: provider.name })
											: t("providerNotConfigured", { provider: provider.name })}
									</Button>
								</form>
							))}
						</Stack>

						<Typography color="text.secondary" variant="body2">
							{t("envHint")}
						</Typography>

						<Typography variant="body2" color="text.secondary">
							{t("registerInfo")} <Link href={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}>{t("registerMore")}</Link>
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
}
