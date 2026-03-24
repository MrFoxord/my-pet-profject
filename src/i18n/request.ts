import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isValidLocale, localeCookieName } from "./config";

function localeFromAcceptLanguage(headerValue: string | null): string {
  if (!headerValue) {
    return defaultLocale;
  }

  const normalized = headerValue
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean) as string[];

  for (const value of normalized) {
    if (value.startsWith("en")) {
      return "en";
    }
    if (value.startsWith("uk")) {
      return "uk";
    }
    if (value.startsWith("ru")) {
      return "ru";
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  const locale = isValidLocale(cookieLocale)
    ? cookieLocale
    : localeFromAcceptLanguage((await headers()).get("accept-language"));

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
