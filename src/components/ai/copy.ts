export type AiAssistantCopy = {
  launcherLabel: string;
  title: string;
  subtitle: string;
  introTitle: string;
  introBody: string;
  placeholder: string;
  send: string;
  close: string;
  clear: string;
  loading: string;
  mockBadge: string;
  errorFallback: string;
  suggestions: string[];
};

export function resolveAiAssistantCopy(locale: string): AiAssistantCopy {
  if (locale.startsWith("ru")) {
    return {
      launcherLabel: "Ассистент",
      title: "AI-ассистент",
      subtitle: "Подскажу по ролям, инвайтам и настройке доски",
      introTitle: "С чего начать",
      introBody: "Я помогаю разобраться в функционале продукта и выбрать подходящий вариант без лишнего усложнения.",
      placeholder: "Например: какую роль лучше дать новому участнику?",
      send: "Отправить",
      close: "Закрыть",
      clear: "Очистить",
      loading: "Ассистент думает...",
      mockBadge: "Mock",
      errorFallback: "Не удалось получить ответ ассистента. Попробуйте ещё раз.",
      suggestions: [
        "Какую роль лучше дать новому участнику?",
        "Когда использовать personal invite, а когда shared?",
        "Как лучше организовать доску для маленькой команды?",
        "Что сейчас умеют уведомления?",
      ],
    };
  }

  if (locale.startsWith("uk")) {
    return {
      launcherLabel: "Асистент",
      title: "AI-асистент",
      subtitle: "Підкажу щодо ролей, інвайтів і налаштування дошки",
      introTitle: "З чого почати",
      introBody: "Я допомагаю розібратися у функціоналі продукту та вибрати доречний варіант без зайвого ускладнення.",
      placeholder: "Наприклад: яку роль краще дати новому учаснику?",
      send: "Надіслати",
      close: "Закрити",
      clear: "Очистити",
      loading: "Асистент думає...",
      mockBadge: "Mock",
      errorFallback: "Не вдалося отримати відповідь асистента. Спробуйте ще раз.",
      suggestions: [
        "Яку роль краще дати новому учаснику?",
        "Коли використовувати personal invite, а коли shared?",
        "Як краще організувати дошку для маленької команди?",
        "Що зараз уміють сповіщення?",
      ],
    };
  }

  return {
    launcherLabel: "Assistant",
    title: "AI Assistant",
    subtitle: "I can help with roles, invites, and board setup choices",
    introTitle: "Start here",
    introBody: "I explain product functionality and help choose sensible options without overcomplicating the setup.",
    placeholder: "For example: which role should I give a new participant?",
    send: "Send",
    close: "Close",
    clear: "Clear",
    loading: "Assistant is thinking...",
    mockBadge: "Mock",
    errorFallback: "The assistant response could not be loaded. Please try again.",
    suggestions: [
      "Which role should I give a new participant?",
      "When should I use a personal invite vs a shared invite?",
      "How should I structure a board for a small team?",
      "What do notifications support right now?",
    ],
  };
}
