"use client";

import { useEffect, useState } from "react";
import StatusPage from "@/components/ui/StatusPage/StatusPage";
import enMessages from "../../messages/en.json";
import ruMessages from "../../messages/ru.json";
import ukMessages from "../../messages/uk.json";

type ErrorMessages = typeof enMessages.errors;

function resolveMessages(locale: string): ErrorMessages {
  if (locale.startsWith("ru")) {
    return ruMessages.errors;
  }

  if (locale.startsWith("uk")) {
    return ukMessages.errors;
  }

  return enMessages.errors;
}

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<ErrorMessages>(enMessages.errors);

  useEffect(() => {
    const nextLocale = document.documentElement.lang || navigator.language || "en";
    setLocale(nextLocale);
    setMessages(resolveMessages(nextLocale.toLowerCase()));
  }, []);

  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <StatusPage
          fullViewport
          code="500"
          title={messages.unexpectedTitle}
          description={messages.unexpectedDescription}
          primaryAction={{ label: messages.tryAgain, onClick: () => reset() }}
          secondaryAction={{ label: messages.goBoards, href: "/boards" }}
        />
      </body>
    </html>
  );
}