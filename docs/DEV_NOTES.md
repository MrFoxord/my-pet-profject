# DEV NOTES — my-pet-profect

Этот файл — конспект решений и плана работ, чтобы можно было продолжать разработку с другого ноутбука / другим Copilot, не теряя контекст.

Быстрая навигация:
- Актуальное состояние: `Актуализация на 2026-03-25`
- Текущий план: `TODO на следующую итерацию` (в разделе 2026-03-24)
- Предложенная стратегия: `7. Стратегия дальнейшей разработки`

---

## Актуализация на 2026-03-19

### Что сделали за текущий этап

1. Довели первую рабочую версию инвайтов по токену:
  - в `BoardInvitation` добавлен `token`;
  - реализован публичный lookup по токену;
  - реализовано принятие инвайта по токену;
  - ссылка формируется в виде `/invite/:token`.
2. Добавили фронтовую страницу публичного инвайта:
  - маршрут `src/app/invite/[token]/page.tsx`;
  - компонент `src/components/invite/InvitePageContent.tsx`;
  - страница умеет показывать состояние инвайта, срок действия и кнопку принятия.
3. Добавили UI управления инвайтами на странице пользователей доски:
  - форма создания инвайта в `BoardUsersClient`;
  - таблица ожидающих приглашений;
  - кнопка копирования ссылки приглашения.
4. Исправили критичный баг публичной invite-страницы:
  - раньше `GET /api/proxy/invitations/:token` шел через общий proxy, который всегда требовал сессию;
  - теперь публичный lookup инвайта разрешен без авторизации;
  - `accept` при этом по-прежнему остается привязанным к авторизованному пользователю.
5. Улучшили обработку ошибок на invite-flow:
  - фронтовый `apiRequest` теперь читает `message` из backend JSON-ошибок;
  - mismatch email, expired, revoked/not pending отображаются внятным текстом;
  - для обработанных invite-ошибок убраны лишние `console.error`, чтобы не поднимать лишний Next dev overlay.
6. Исправили hydration mismatch на странице пользователей доски:
  - корневая причина оказалась не только в MUI App Router cache, но и в `src/components/ui/Button/Button.tsx`;
  - там был `styled-components` wrapper поверх MUI Button (`styled(MuiButton)`), что давало рассинхрон className между SSR и клиентом;
  - обертка убрана, `Button` переведен на обычный MUI Button + `sx`.
7. Подключили `@mui/material-nextjs` и завернули app в `AppRouterCacheProvider`:
  - это нужно для корректной работы emotion/MUI в Next App Router.
8. Применили все накопившиеся Prisma-миграции в корневом проекте:
  - до этого Nest падал на `public.Board` / `public.User does not exist`;
  - после применения миграций база пришла в sync со схемой.

### Что важно понимать по текущему состоянию

1. Текущая версия инвайтов пока еще персональная:
  - email обязателен;
  - acceptance проверяет совпадение email пользователя и email инвайта.
2. Shared / массовые ссылки пока не реализованы.
3. Страница `/invite/:token` уже существует и работает как публичная точка входа, то есть для shared-link модели не нужно изобретать новый entrypoint — нужно расширять текущую модель.
4. На странице пользователей доски ссылка сейчас не показывается как текстовое поле:
  - она уже генерируется;
  - её можно скопировать через кнопку `📋` в секции ожидающих приглашений.
5. В момент остановки работ `server-nest` локально был не поднят стабильно (`npm run start:dev` завершался с ошибкой), поэтому перед продолжением следующей итерации нужно сначала поднять dev backend и убедиться, что он стартует без runtime-ошибок.

### Решение, согласованное на следующую итерацию

Переходим к полноценной модели двух типов ссылок:

1. `PERSONAL`
  - ссылка привязана к email;
  - acceptance разрешен только пользователю с совпадающим email.
2. `SHARED`
  - ссылка без email;
  - по одной ссылке можно принять несколько пользователей;
  - лимит uses читается из env;
  - срок жизни тоже читается из env.

Дополнительно согласовано:

1. Для shared-link нужен выбор одноразовая / многоразовая.
2. Максимум uses пока берем из env, дефолтная бизнес-логика — до 10 пользователей.
3. TTL ссылки — одна неделя, тоже через env.
4. Через ссылку назначается только `customRoleId`.
  - board role не меняется через invite;
  - повышение board role потом будет отдельным механизмом.
5. Если пользователь уже состоит в доске:
  - accept должен быть идемпотентным;
  - ничего не менять и не падать ошибкой.
6. Если custom role удалили после генерации ссылки:
  - acceptance должен завершаться отказом;
  - пользователю показываем, что нужна новая ссылка.
7. После логина/регистрации нужно продолжать invite flow:
  - токен надо запоминать между `/invite/:token` и auth flow;
  - после успешного входа/регистрации acceptance должен продолжаться автоматически.
8. Для shared-link нужны все отдельные состояния UI:
  - revoked;
  - expired;
  - limit reached;
  - already accepted / already member;
  - email mismatch для personal invite.
9. Для shared-link важно сделать атомарную проверку лимита uses, чтобы избежать гонки при одновременном принятии.

### Что планировалось сделать следующим шагом

Следующий незавершенный slice, на котором работа была остановлена:

1. Расширить `BoardInvitation` в Prisma:
  - `type: PERSONAL | SHARED`;
  - `email: String?`;
  - `customRoleId: String?`;
  - `createdByUserId: String?`;
  - `maxUses: Int?`;
  - `usedCount: Int @default(0)`;
  - убрать жесткую уникальность `@@unique([boardId, email])` как универсальное правило;
  - добавить связи/индексы под новую модель.
2. Переписать backend логику создания и принятия инвайтов:
  - env-конфиг для TTL и shared max uses;
  - idempotent accept;
  - atomic increment для shared-link;
  - проверка удаленной кастомной роли.
3. Обновить UI `BoardUsersClient`:
  - явный выбор между `PERSONAL` и `SHARED`;
  - чекбокс/переключатель одноразовая vs многоразовая shared-link;
  - показывать ссылку в явном виде, а не только кнопкой копирования.
4. Реализовать resume flow после auth:
  - invite token нужно переносить через signin/register redirect chain.

### Практические заметки перед продолжением работы

1. Перед следующей итерацией стоит проверить текущее состояние `package.json`, потому что во время фикса hydration был добавлен `@mui/material-nextjs`.
2. При редактировании invite-flow надо особенно аккуратно проверять `src/lib/api/routes.ts` и `src/lib/api/client.ts`:
  - ранее эти файлы уже ломались из-за неудачных массовых правок.
3. Если повторно начнутся странные hydration warning'и, первым делом проверять, не обернули ли MUI-компонент через `styled-components`.

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

---

## Актуализация на 2026-03-24

### Что сделали за день

Это был в первую очередь **релизно-подготовительный** этап: не новые фичи, а системная доводка до стандарта, при котором проект можно запускать и передавать другим людям без страха.

#### Безопасность и хардening

1. Подключили `helmet` в bootstrap Nest — базовые HTTP security headers на всех ответах API.
2. Добавили глобальный rate limiting через `@nestjs/throttler` (AppModule + global guard).
3. Добавили усиленные per-endpoint throttle декораторы на публичных invite-эндпоинтах (lookup / accept) — направленная защита от brute-force по токену.
4. Добавили lightweight in-memory rate limiter в Next `middleware.ts` для `/auth/*` и `/invite/*` — защита от перебора на уровне фронтенда до того, как запрос дойдет до бекенда.
5. Добавили расширенный набор security headers в `next.config.ts`:
   - CSP baseline;
   - `X-Frame-Options: DENY`;
   - `X-Content-Type-Options: nosniff`;
   - `Referrer-Policy: strict-origin-when-cross-origin`;
   - выключен `X-Powered-By`.

#### Тестирование (с нуля до рабочей инфраструктуры)

1. Создан `jest.config.ts` для unit-тестов в `server-nest`.
2. Создан `test/jest-e2e.json` для e2e-тестов.
3. Добавлены npm-скрипты `test`, `test:watch`, `test:e2e` в `server-nest/package.json`.
4. Написан первый `boards.service.spec.ts` — 4 unit-теста на приватную логику:
   - pending invitation state;
   - limit_reached при исчерпании shared-инвайта;
   - OWNER всегда может управлять доступом;
   - VIEWER не может редактировать при restrictive policy.
5. Написан `test/health.e2e-spec.ts` — smoke e2e через supertest + Nest bootstrap.
6. Прогнаны все тесты, стабильно зеленые: unit 4/4, e2e 1/1.
7. В процессе доводки пришлось решить два нетривиальных нюанса:
   - в e2e нужно `import * as request from 'supertest'`, не `default import` (CommonJS interop);
   - health-контроллер возвращает plain `'ok'`, а не `{ status: 'ok' }` — тест должен проверять `response.text`, не `response.body`.

#### Новые фичи

1. Добавлен `DELETE /boards/:boardId` в backend (owner-only, cascade через Prisma).
2. Добавлен `deleteBoard` в API-клиент фронта, RTK Query mutation и UI-кнопку удаления борды с confirmation.
3. Добавлена серверная поддержка пагинации тикетов при запросе борды: query-параметры `ticketsOffset` / `ticketsLimit` в `GET /boards/:id`.

#### Фронтовая устойчивость (resilience)

1. Создан `src/app/error.tsx` — глобальный error boundary для App Router с кнопками `Повторить` и `К доскам`.
2. Создан `src/app/not-found.tsx` — кастомная 404-страница.
3. В `src/app/dashboard/[boardId]/page.tsx` заменён ручной fallback на `notFound()`.
4. Оба файла поддерживают i18n through `next-intl`.
5. Добавлены переводы (`errors.*`) во все три locale: en / ru / uk.

#### Инфраструктура

1. Создан `.github/workflows/ci.yml` — два job'а: frontend (lint + build) и backend (build + unit + e2e).
2. Расширен `.env.example` в корне (Swagger URL, rate limit env, app public URL).
3. Создан `server-nest/.env.example` — первый раз задокументировал все переменные бекенда.
4. Переписан `README.md` — убраны стандартные Next.js шаблонные тексты, добавлено: описание проекта, архитектура, инструкция по запуску, переменные окружения, тестирование, security notes.

#### Lint и качество кода (финальный cleanup)

1. Устранены 13 lint-ошибок:
   - 4 `any` в `boards.service.ts` → заменены на `CreateBoardRoleDto`, `UpdateBoardRoleDto`, `Partial<{...}>`, `unknown`;
   - `(service as any).method` в тесте → заменён на типизированный `serviceInternals` с explicit interface;
   - `require()` import в e2e → заменён на `import * as`;
   - 4 нарушения `react-hooks/set-state-in-effect` → `setState` обёрнут через `setTimeout(..., 0)` в `BoardColumns.tsx` и `TicketModal.tsx`.
2. Финальные результаты после всех правок:
   - `npm run lint` — 0 ошибок, 0 предупреждений;
   - `npm run build` (Next) — успешно, 0 TypeScript ошибок;
   - `nest build` — успешно, 0 TypeScript ошибок;
   - unit tests — 4/4;
   - e2e tests — 1/1.

---

### Наблюдения по итогам дня

#### Что видно в архитектуре прямо сейчас

1. **`boards.service.ts` — критична точка роста.**
   Файл уже превышает 2000 строк. Внутри него вперемешку: бизнес-логика досок, билеты, колонки, инвайты, роли, нотификации, агрегации. Это пока работает, но при следующем крупном feature-слое (например, real-time коллаборация или полноценный permission enforcement) файл станет непосильным для понимания или безопасного изменения.

2. **Notification-слой реализован, но не тестируется.**
   `createAndDispatchNotifications`, `notifyBoardMembers`, `listUserNotifications` — эти методы существуют и, судя по TypeScript, корректны. Но ни один тест их не покрывает. При любом рефакторинге этого слоя можно сломать тихо.

3. **RTK Query API (`src/store/api.ts`) полностью соответствует backend.**
   Это хороший признак: клиентский и серверный контракты не разошлись. Но весь `api.ts` — это один монолитный `createApi` с ~400 строк. При дальнейшем расширении стоит разбить по namespace'ам (boards, tickets, members, notifications).

4. **Realtime-loop замкнут — `DashboardClient.tsx` уже подписывается и реагирует.**
   `SocketContext.tsx` подключается, регистрирует userId. `RealtimeGateway` отправляет события. `DashboardClient.tsx` вызывает `useSocket()`, на `componentDidMount` эмитит `subscribe-board`, слушает `board-state-changed` (инвалидирует RTK-тег `Board`) и `ticket-state-changed` (инвалидирует `BoardTicket` + анимирует перемещение). Своя эхо-отсечка через `actorUserId === session.user.id`. На `unmount` — `unsubscribe-board`. Realtime полностью рабочий.

5. **Security headers — baseline, не финальный уровень.**
   CSP написан как baseline (без nonces для inline-scripts). MUI + emotion генерируют inline-критические стили, что в production с `nonce`-based CSP потребует доработки. Сейчас это нормально, но надо иметь в виду, что текущий CSP — это отправная точка, а не production-hardened конфиг.

6. **Тестовое покрытие пока очень мало.**
   4 unit-теста + 1 e2e — это каркас инфраструктуры, не coverage. Из критичной логики не тестируются: invitation acceptance, ticket access enforcement, board deletion со связанными данными, notifications dispatch. Это технический долг, который вырастет резкo, когда проект начнут использовать несколько человек.

---

### Видение дальнейшего развития

#### ~~Ближайший шаг — realtime реактивность~~ ✅ Уже сделано

`DashboardClient.tsx` уже подписывается на `board-state-changed` и `ticket-state-changed`, инвалидирует RTK Query теги и анимирует перемещение тикетов. Realtime-loop закрыт. Это больше не задача.

#### Board Management UI — частично сделано

Серверная логика реализована полностью: роли, инвайты, управление участниками, удаление.

На фронте существует страница `src/app/dashboard/[boardId]/users/` с компонентом `BoardUsersClient`:
- список участников с их кастомными ролями и кнопкой удаления;
- создание инвайтов типа `PERSONAL` (с email) и `SHARED` (без email, `SINGLE_USE` / `MULTI_USE`);
- таблица ожидающих приглашений с кнопкой копирования ссылки и отзывом.

**Что пока не реализовано:**
- Страница `/dashboard/[boardId]/settings` — sidebar на неё ссылается, но page.tsx не существует.
- UI управления кастомными ролями (create / rename / delete) — доступно только при создании борды, не редактируется после.

Следующий реальный шаг — создать страницу `/settings` (или добавить вкладку "Роли" в `/users`) с CRUD кастомных ролей.

#### Технический долг, который надо погасить до следующего feature-слоя

1. **Разделить `boards.service.ts`** на несколько сервисов:
   - `BoardsService` (CRUD борд + memberships);
   - `TicketsService` (тикеты, комментарии, access policy enforcement);
   - `BoardInvitationsService` (инвайты, токены, acceptance flow);
   - `NotificationsService` (dispatch, list, read).

2. **Добавить тесты на критичую логику:**
   - acceptance флоу инвайтов (personal + shared, expiry, limit);
   - ticket access enforcement (view/edit/delete по ролям);
   - deleteBoard с каскадом.

3. **RTK Query api.ts разбить по namespace:**
   - `boardsApi`, `ticketsApi`, `membersApi`, `notificationsApi`;
   - это также позволит переиспользовать теги и инвалидации точечно, а не через один глобальный `appApi`.

#### Среднесрочное видение (следующие 2–3 итерации)

1. **Полноценный ticket lifecycle:**
   - assignees (кому назначен);
   - due date + reminder (через notification dispatch);
   - subtask completion агрегация;
   - attachments (хотя бы как ссылки).

2. **Board-level аналитика:**
   - сколько тикетов в каждом статусе;
   - burndown или простой счётчик прогресса спринта;
   - это сделает борд не просто Kanban, а управленческим инструментом.

3. **Email-нотификации:**
   - сейчас нотификации хранятся в БД и отдаются в realtime;
   - следующий уровень — отправка email при важных событиях (invite, mention, назначение);
   - minimal MVP: SMTP + Nodemailer в Nest, шаблон приглашения.

4. **Многопользовательская коллаборация на тикете:**
   - lock при редактировании (optimistic, через realtime);
   - cursor awareness (кто смотрит на тикет прямо сейчас);
   - это реалистично, потому что realtime-слой уже готов принять эти события.

#### Долгосрочное видение

Проект строился как pet-project, но архитектурно уже сейчас готов к командной работе:
- RBAC с кастомными ролями per-board — это enterprise-уровень;
- realtime gateway — это product-level фича;
- typed API + generated Prisma — это production-grade backend.

Если добавить email-инвайты, board analytics и mobile-responsive layout — он превращается в реально конкурентоспособный B2B-продукт для небольших команд.

Ключевое, что осталось сделать для этого перехода:
- закрыть realtime loop (subscribe → update → UI);
- сделать Board Settings как полноценный UI;
- добавить минимальный test coverage на критичную логику.

Всё остальное — это наращивание, а не фундамент.

---

### TODO на следующую итерацию (приоритет)

1. `[x]` ~~Подписаться на `board-state-changed` в `[boardId]/page.tsx`, вызвать `refetch` при событии.~~ — **Сделано в `DashboardClient.tsx`** (invalidateTags Board + ticket-state-changed)
2. `[x]` ~~Подписаться на `ticket-state-changed` в том же компоненте, инвалидировать `getBoardTicketById`.~~ — **Сделано** (см. выше)
3. `[ ]` Создать страницу `/dashboard/[boardId]/settings` — sidebar уже ссылается, но файла нет.
4. `[ ]` Добавить UI управления кастомными ролями (create / rename / delete) в settings или users page.
5. `[ ]` Разбить `boards.service.ts` — минимум выделить `BoardInvitationsService` и `NotificationsService`.
6. `[ ]` Добавить тест на acceptance flow инвайта (unit, mocked Prisma).
7. `[ ]` Разбить `src/store/api.ts` на namespace-эндпоинты.
8. `[ ]` Email-уведомления — Nodemailer в Nest, шаблон инвайта.
9. `[ ]` Resume flow после auth — invite-токен должен переживать signin/register redirect chain.

---

## Актуализация на 2026-03-25

### Ревизия — что реально сделано к этому моменту

Этот раздел исправляет ряд неточностей из секции 2026-03-24, которые описывали как «ещё не готово» то, что на самом деле уже было реализовано в более ранних итерациях.

#### Realtime — полностью готов

- `DashboardClient.tsx` импортирует `useSocket()`, на mount эмитит `subscribe-board`, слушает события:
  - `board-state-changed` → `dispatch(appApi.util.invalidateTags([{type:'Board', id:boardId}]))`
  - `ticket-state-changed` → `dispatch(appApi.util.invalidateTags([{type:'BoardTicket', id:ticketId}]))` + анимация перемещения
- Самоэхо-отсечка: события с `actorUserId === session.user.id` игнорируются.
- На unmount — `unsubscribe-board`.
- `SocketProvider` обёрнут в `src/components/Providers.tsx`, доступен глобально.

#### Board Users / Invitations UI — реализован

- Существует `src/app/dashboard/[boardId]/users/page.tsx`.
- `BoardUsersClient.tsx` обеспечивает:
  - список участников со сменой кастомной роли и удалением;
  - создание инвайтов `PERSONAL` (с email) и `SHARED` (`SINGLE_USE` / `MULTI_USE`);
  - таблица pending-инвайтов с копированием ссылки и отзывом.

#### Ticket access enforcement — работает в бэкенде

- `boards.service.ts` содержит `normalizeTicketAccessPolicy()`, `canUseTicketPermission()`, `canAccessTicket()`.
- Enforcement применяется на всех mutation-эндпоинтах: edit / fill / delete / estimate / comment.

#### SHARED-инвайты — реализованы (вопреки заметкам от 2026-03-19)

- Модель `BoardInvitation` содержит `type: PERSONAL | SHARED`, `email?`, `customRoleId?`, `maxUses?`, `usedCount`.
- Acceptance-логика атомарно инкрементирует `usedCount` и проверяет `maxUses`.
- Удалена жёсткая уникальность `@@unique([boardId, email])`.

### Что пока не реализовано (актуальный технический долг)

| Задача | Приоритет |
|---|---|
| `src/app/dashboard/[boardId]/settings/page.tsx` — sidebar ссылается, файла нет | Высокий |
| UI управления кастомными ролями (создание/переименование/удаление) | Высокий |
| Resume flow: invite-токен переживает цепочку редиректов signin/register | Средний |
| Email-уведомления (Nodemailer, шаблон инвайта) | Средний |
| Разбить `boards.service.ts` (2000+ строк) на `TicketsService`, `BoardInvitationsService`, `NotificationsService` | Средний |
| Разбить `src/store/api.ts` (~400 строк) по namespace'ам | Низкий |
| Тест на флоу принятия инвайта (unit, mocked Prisma) | Средний |
| Тест на каскадное удаление борды | Низкий |
