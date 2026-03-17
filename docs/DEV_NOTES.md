# DEV NOTES — my-pet-profect

Этот файл — конспект решений и плана работ, чтобы можно было продолжать разработку с другого ноутбука / другим Copilot, не теряя контекст.

Быстрая навигация:
- Актуальное состояние: `Актуализация на 2026-03-16`
- Текущий план: `6. Ближайшие шаги (актуальный TODO)`
- Предложенная стратегия: `7. Стратегия дальнейшей разработки`

---

## Актуализация на 2026-03-16

Ниже в документе есть исторические секции (как проект стартовал). Этот блок фиксирует текущее состояние после последних изменений.

### Что сделали за текущий этап

1. Подняли `server-nest/` как основной бэкенд и завершили вывод Go из runtime.
2. Перенесли базовую логику бордов/колонок в Nest:
  - список бордов;
  - создание борда;
  - получение борда;
  - reorder/rename/delete колонок.
3. Обновили Prisma-схему под auth + роли + membership (в корне и в `server-nest/prisma/schema.prisma`):
  - OAuth-модели: `Account`, `Session`, `VerificationToken`;
  - расширили `User` (`image`, `emailVerified`, роли);
  - добавили `BoardMember` для роли пользователя внутри конкретной доски.
4. Внедрили Auth.js (NextAuth v5 beta) в Next:
  - OAuth-провайдеры: Google, GitHub, Facebook;
  - стратегия сессий: `database`;
  - API-роут: `src/app/api/auth/[...nextauth]/route.ts`.
5. Добавили ролевую модель в 3 измерениях:
  - monetization role: `FREE | SUBMITTED | PREMIUM`;
  - work role: `CLIENT | EXECUTOR | ORGANIZER | CEO`;
  - dashboard role: строковая роль в `BoardMember.role`.
6. Обновили роутинг и доступ:
  - `/` теперь редиректит в `/auth/signin` или `/boards`;
  - `middleware.ts` защищает `/boards` и `/dashboard/*`;
  - добавлена страница `src/app/boards/page.tsx` как authenticated entry.
7. Синхронизировали фронтовый API-клиент и типы под user-scoped данные.
8. Починили инфраструктурные проблемы, которые блокировали запуск:
  - Prisma v7 runtime/config нюансы;
  - загрузка env в Nest;
  - конфликтующие импорты Prisma-клиента;
  - ошибки типизации `pg`.
9. Проверили git-шум по `server-nest/node_modules`:
  - папка игнорируется корректно;
  - tracked-файлов в индексе нет.
10. Довели Google OAuth до рабочего состояния end-to-end:
  - создан OAuth Client в Google;
  - прописаны `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` в `.env`;
  - подтвержден вход через `/auth/signin` и callback Auth.js.
11. Починили падение Auth.js adapter (`prisma.account.findUnique`):
  - регенерация Prisma Client после изменений auth-моделей;
  - перезапуск Next после обновления клиента.
12. Исправили Prisma runtime module mismatch в сгенерированном клиенте:
  - вместо `query_compiler_fast_bg.postgresql.*` используется доступный runtime `query_compiler_bg.postgresql.*`;
  - после фикса сборка/запуск приложения больше не падают на `Module not found`.

### Дополнительно сделано (финал дня, 2026-03-16)

1. Полностью убрали Go legacy из runtime и документации:
  - удален `server/` (Go backend);
  - проект работает в связке Next + Nest.
2. Провели cleanup фронта от Tailwind и лишних зависимостей:
  - удалены tailwind/postcss хвосты;
  - стили приведены к plain CSS + текущему UI стеку.
3. Закрыли большой слой lint/type проблем:
  - настроены корректные ignores для generated/dist;
  - исправлены unsafe места в PrismaService и неиспользуемые импорты/переменные;
  - линт приведен в рабочее состояние.
4. Подняли локальную PostgreSQL и синхронизировали миграции:
  - применены миграции Prisma;
  - устранены конфликты портов и проблемы запуска dev-окружения.
5. Усилили backend-proxy безопасность:
  - браузер ходит в Nest через Next proxy;
  - на proxy добавлена обязательная проверка сессии (401 без auth);
  - добавлены явные ответы на ошибки конфигурации/недоступности backend (500/503).
6. Пробовали onboarding-ветку с редиректами, затем откатили как избыточно сложную для текущего этапа.
7. Принята рабочая модель без редиректа:
  - после OAuth — обычный вход на `/boards`;
  - добавлен флаг `User.isDefault` + профильные поля (`firstName`, `lastName`, `nickname`);
  - при загрузке `/boards` фронт спрашивает state через Nest;
  - если `isDefault=true`, показывается модалка профиля;
  - после сохранения профиль пишется в БД, `isDefault=false`, UI обновляется динамически.
8. Добавлен backend-модуль `users` в Nest:
  - `GET /users/me/default-state`;
  - `PATCH /users/me/default-profile`.

### Текущее рабочее поведение (согласованное)

1. Авторизация: дефолтный OAuth flow (Google/GitHub/Facebook по мере наличия credentials).
2. Редирект после входа: на `/boards`.
3. Первичная донастройка профиля: через модалку на `/boards`, без отдельного onboarding route.
4. API-доступ к Nest из браузера: только через Next proxy.

### Что сейчас по факту архитектурно

- Go-сервер удален из активной кодовой базы.
- Nest-сервер покрывает текущий board-flow и развивается как единственный API backend.
- Auth и сессии теперь завязаны на БД (а не на mock/local-only).
- Авторизация на фронте работает по middleware + session provider.
- Модель доступа уже готова под монетизацию и B2B/командные сценарии.

---

## 6. Ближайшие шаги (актуальный TODO)

### Критично (ближайшие 1-2 итерации)

1. Вынести модалку default-профиля из `boards/page` в отдельный компонент:
  - уменьшить связность страницы;
  - упростить дальнейшие изменения UX/валидаций.
2. Закрыть UX валидации профиля:
  - нормализовать nickname (регистр, пробелы, допустимые символы);
  - понятные ошибки по конфликту уникальности;
  - добавить optimistic/blocking состояния кнопок.
3. Добить провайдеры OAuth:
  - Google уже рабочий;
  - подключить/проверить GitHub и Facebook (если нужны в MVP).

### Важно (следующие итерации)

1. Реализовать приглашения в доску (рекомендуемый следующий продуктовый шаг):
  - основной сценарий: invite по email + выбранная роль;
  - статусная модель инвайтов: pending/accepted/expired/revoked;
  - принятие инвайта после входа (для существующего и нового пользователя).
2. После инвайтов — расширить права доступа:
  - матрица permissions по dashboard role;
  - запрет операций вне membership на всех mutation endpoints.
3. Далее — ticket/subtask/comment CRUD и persistence drag-and-drop порядка.

### В ближайший релизный цикл

1. Пройти smoke/regression по связке: auth -> boards -> default profile modal -> create board.
2. Добавить e2e сценарий на `isDefault` flow.
3. Стабилизировать dev scripts (один Next + один Nest процесс, без lock/порт-гонок).

## 7. Стратегия дальнейшей разработки (предложение)

### Принцип

Идем итеративно: "сначала паритет, потом улучшения". Не смешиваем одновременно глубокий рефакторинг и новые продуктовые фичи.

Отдельно: избегаем крупных изменений auth-flow до момента, пока не закрыт продуктовый сценарий приглашений и membership.

### Рекомендуемый порядок

1. Stabilize текущий auth+boards (без новых редиректов/онбордингов).
2. Вынести и доработать default-profile модалку как отдельный UI модуль.
3. Реализовать email-invite в борды как следующий вертикальный slice.
4. После этого расширять domain (tickets/comments/realtime).

### Технические правила на следующие этапы

1. Prisma schema в корне и в `server-nest` держать синхронно, без ручного расхождения.
2. Любая новая роль/permission сначала описывается в БД и серверных проверках, потом в UI.
3. Любой новый endpoint сначала документируется коротким контрактом (input/output/errors), затем код.
4. Все risky-изменения (auth, membership, роли) прогонять минимум через smoke-скрипт перед merge.
5. Не запускать параллельно несколько `next dev`/`nest --watch` в одной рабочей копии (во избежание lock/порт-конфликтов и ложных 5xx).

---

## Актуализация на 2026-03-17

### Что сделали за день

1. Расширили доменную модель досок и ролей:
  - `BoardMember.role` переведен на enum `BoardMemberRole`;
  - добавлены `BoardRole` и `BoardInvitation`;
  - схема синхронизирована и в корневом Prisma, и в `server-nest/prisma/schema.prisma`.
2. Реализовали backend API для ролей доски:
  - `POST /boards/:boardId/roles`;
  - `GET /boards/:boardId/roles`;
  - `PATCH /boards/:boardId/roles/:roleId`;
  - `DELETE /boards/:boardId/roles/:roleId`.
3. Реализовали backend API для инвайтов в доску:
  - `POST /boards/:boardId/invitations`;
  - `GET /boards/:boardId/invitations`;
  - `POST /boards/:boardId/invitations/:invitationId/accept`;
  - `DELETE /boards/:boardId/invitations/:invitationId`.
4. Обновили создание доски:
  - в модалку добавлен ввод кастомных ролей;
  - кастомные роли создаются сразу при создании борды;
  - исправлен критичный баг: при создании борды теперь передается `ownerId`, поэтому для создателя реально создается `BoardMember`.
5. Перевели создание тикетов с `prompt` на полноценную модалку:
  - `title`, `description`, `type`, `priority`;
  - выбор доступа по ролям;
  - в мультиселекте сначала стандартные роли (`owner/admin/member/viewer`), затем кастомные роли доски.
6. Доработали модалку тикета:
  - добавили backend `PATCH /boards/:boardId/tickets/:ticketId`;
  - добавили backend `DELETE /boards/:boardId/tickets/:ticketId`;
  - редактирование тикета из модалки теперь реально сохраняется в Nest;
  - удаление тикета из модалки теперь реально работает через API.
7. Привели Next build к стабильному состоянию:
  - исправили контракт `params` для Next 16 App Router;
  - исключили `server-nest` из фронтового typecheck через `tsconfig.json`;
  - добавили `@types/express` для корректной типизации во фронтовой сборке, когда Next захватывал backend-код.
8. Провели фронтовый cleanup и первый слой систематизации UI:
  - добавлены shared-компоненты `RolesSelect`, `TicketTypeSelect`, `TicketPrioritySelect`, `TicketStatusSelect`;
  - введен единый barrel `src/components/ui/index.ts`;
  - `TicketModal` и `BoardColumns` переведены на shared UI-компоненты;
  - удалены неиспользуемые/пустые компоненты: `TaskList`, `TicketList`, `TicketDetails`, `ModalTaskEditor`.

### Ключевые баги и наблюдения

1. Самый важный найденный баг за день:
  - борда создавалась без `ownerId` в клиентском вызове `createBoard`;
  - из-за этого в таблице `BoardMember` не появлялась запись для создателя;
  - любые защищенные операции (`delete ticket`, `update ticket`, roles/invitations) падали через `ensureBoardMembership` с `400 board access denied`.
2. В текущем состоянии `accessibilityRoles` уже сохраняются и редактируются корректно, но это пока только данные, а не полноценный enforcement.
  - То есть ограничения видимости/редактирования на сервере пока не применяются по этим ролям автоматически.
3. В Next 16 важно аккуратно следить за server/app route typing:
  - `params` для dynamic routes в typegen ожидаются как `Promise<...>`.
4. Во фронте был явный structural drift:
  - часть UI уже жила через MUI/styled-components;
  - часть через локальные ad-hoc компоненты;
  - часть файлов была пустой или orphaned.
  Сегодня это начали вычищать, но работа еще не завершена на весь фронт.
5. В сборке Next остались warning'и по Prisma + Edge Runtime:
  - это не ломает build сейчас;
  - но это сигнал, что `auth.ts` / prisma imports потенциально могут быть чувствительны в edge-context, если туда продолжат попадать Node-only зависимости.

### Рекомендации

1. Не распыляться дальше на случайные UX-улучшения тикетов, пока не закрыт enforcement прав.
2. Все новые поля доступа сначала реализовывать в серверных проверках, и только потом расширять UI.
3. Продолжать выносить повторяющийся UI в shared-слой:
  - кнопки;
  - select'ы;
  - field groups;
  - модальные actions;
  - статусные chip/badge-компоненты.
4. После удаления orphaned-компонентов периодически делать повторную зачистку imports/types, потому что проект исторически уже накопил несколько слоев устаревших abstraction-ов.
5. При проверке build на Windows лучше вызывать Node/Nest/Next напрямую через `node .../bin/...`, если PowerShell execution policy мешает обычным `npm`/`npx` сценариям.

### Что логичнее делать дальше

#### Следующий лучший шаг

1. Реализовать backend enforcement для тикетных доступов:
  - фильтрация видимости тикетов по `accessibilityRoles`;
  - проверка прав на update/delete;
  - отдельное правило на изменение самого доступа к тикету.

#### После этого

1. Сделать `Board Settings` / `Board Management` UI:
  - участники;
  - инвайты;
  - кастомные роли;
  - смена ролей участникам.
2. Затем перейти к permissions у кастомных ролей:
  - пока у кастомных ролей есть только имя;
  - следующий слой — реальные permissions (`ticket.view`, `ticket.edit`, `ticket.delete`, `board.manage_members` и т.д.).

### Практический TODO на следующую итерацию

1. Вынести серверные helper'ы доступа в отдельный service/guard utility для boards/tickets.
2. Добавить серверную функцию вида `getEffectiveBoardRolesForUser(boardId, userId)`.
3. На чтении борды фильтровать `tickets` по этим ролям.
4. На mutation-эндпоинтах тикета ввести проверку не только membership, но и ticket-level access.
5. После этого строить UI управления участниками и ролями доски.
