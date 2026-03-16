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
import { auth, authProviderStates, signIn } from "@/auth";

export default async function SignInPage() {
	const session = await auth();

	if (session) {
		redirect("/boards");
	}

	return (
		<Container maxWidth="sm" sx={{ py: 10 }}>
			<Card sx={{ borderRadius: 4, boxShadow: 12 }}>
				<CardContent sx={{ p: 5 }}>
					<Stack spacing={3}>
						<Box>
							<Typography variant="overline">Authorization</Typography>
							<Typography variant="h4" sx={{ fontWeight: 700 }}>
								Вход в рабочее пространство
							</Typography>
							<Typography color="text.secondary" sx={{ mt: 1 }}>
								Авторизация через OAuth. Профиль, сессия, глобальные роли и
								membership в дашбордах сохраняются в нашей базе.
							</Typography>
						</Box>

						<Stack spacing={1.5}>
							{authProviderStates.map((provider) => (
								<form
									key={provider.id}
									action={async () => {
										"use server";

										await signIn(provider.id, { redirectTo: "/boards" });
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
											? `Продолжить через ${provider.name}`
											: `${provider.name} не настроен`}
									</Button>
								</form>
							))}
						</Stack>

						<Typography color="text.secondary" variant="body2">
							Если хочешь добавить провайдеры, нужны переменные окружения
							`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`,
							`GITHUB_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`,
							`FACEBOOK_CLIENT_SECRET`, `AUTH_SECRET`.
						</Typography>

						<Typography variant="body2" color="text.secondary">
							Регистрация отдельной формой не нужна. Первый вход через OAuth
							создаёт пользователя автоматически. <Link href="/auth/register">Подробнее</Link>
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
}
