export const locales = ["en", "uk", "ru"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeCookieName = "NEXT_LOCALE";

export function isValidLocale(locale: string | undefined | null): locale is AppLocale {
  return Boolean(locale && locales.includes(locale as AppLocale));
}
