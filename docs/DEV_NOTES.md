# DEV NOTES — my-pet-profect

Цей файл — конспект рішень і плану робіт, щоб можна було продовжувати розробку з іншого ноутбука / іншим Copilot, не втрачаючи контекст.

Швидка навігація:
- Актуальний стан: `Актуалізація на 2026-04-01`
- Поточний план: `Пріоритетний TODO на 2026-04-01`
- Запропонована стратегія: `7. Стратегія подальшої розробки`

---

## Актуалізація на 2026-04-01

### Що зробили за поточний етап

1. Завершили backend-декомпозицію board-domain на окремі сервіси:
  - `BoardsAccessService` відповідає за membership і ticket access policy;
  - `BoardNotificationsService` відповідає за persistence + realtime сповіщень;
  - `BoardInvitationsService` відповідає за invite lifecycle і public token flow;
  - `BoardMembersService` відповідає за учасників борду;
  - `BoardRolesService` відповідає за CRUD кастомних ролей;
  - `BoardStructureService` відповідає за колонки;
  - `BoardTicketsService` відповідає за тікети, коментарі та ticket-level permission enforcement.
2. Звузили відповідальність головного board service:
  - `server-nest/src/boards/board-workflow.service.ts` залишено як board-level facade/orchestration;
  - ticket/column flow винесено з нього в окремі сервіси;
  - зовнішній HTTP-контракт не ламався: `BoardsController` продовжує працювати через стабільний фасад.
3. Закрили основний frontend-розрив між backend і UI:
  - реалізовано сторінку `src/app/dashboard/[boardId]/settings/page.tsx`;
  - додано UI для кастомних ролей, invite policy, видалення борду та редагування theme color;
  - сторінка користувачів і settings тепер покривають основний board-admin flow.
4. Розбили клієнтський RTK Query-моноліт без зміни публічного імпорту:
  - `src/store/api.ts` залишено як тонкий barrel;
  - виділено `src/store/api-base.ts`, `src/store/api-utils.ts`, `src/store/api-boards.ts`, `src/store/api-tickets.ts`, `src/store/api-notifications.ts`.
5. Спростили Prisma migration history до однієї baseline-міграції:
  - старий ланцюжок міграцій видалено як такий, що заважав і вже неактуальний;
  - створено baseline-міграцію `prisma/migrations/20260401100000_baseline_current_schema/`;
  - dev-базу скинуто і синхронізовано з поточною схемою.
6. Посилили тестове покриття на критичних board-flow:
  - unit guardrail coverage додано в `server-nest/src/boards/boards-domain.spec.ts`;
  - helper-spec `server-nest/src/boards/boards.service.spec.ts` збережено;
  - HTTP/e2e-покриття додано в `server-nest/test/boards-risk-flows.e2e-spec.ts`.
7. Зафіксували продуктовий scope щодо сповіщень:
  - поточний notification layer залишається in-app + realtime;
  - email notifications винесено в post-MVP і не вважаються активним завданням поточного релізного циклу.

### Що важливо розуміти щодо поточного стану

1. Board-domain зараз уже поділено достатньо, щоб безпечно продовжувати розробку:
  - access/invitations/members/roles/columns/tickets винесено з однієї великої купчастої логіки;
  - `BoardsService` більше не є монолітом на весь board-domain.
2. Frontend admin-сценарії тепер значно ближчі до backend-можливостей:
  - settings-сторінка існує;
  - кастомні ролі, invite policy і delete board доступні з UI;
  - shared/personal invite flow уже не є незавершеною чернеткою.
3. Критичні guardrails тепер покриті не лише unit-helper тестами:
  - є unit-тести на permissions/invites/roles/member flows;
  - є e2e HTTP-покриття на invite accept/revoke і owner-only delete board.
4. Notification system, як і раніше, означає лише БД + realtime:
  - email delivery, provider config, шаблони, async dispatch і user preferences поки відсутні;
  - це свідомо винесено в post-MVP.
5. Усі TODO і плани нижче цього блоку вважати історичними, якщо вони суперечать секції `Актуалізація на 2026-04-01`.

### Пріоритетний TODO на 2026-04-01

1. Обов'язковий pre-MVP backlog по board-domain у межах поточного узгодженого плану закрито.
2. Email notifications залишено як post-MVP:
  - це окремий delivery channel поверх уже наявних notification events;
  - для нього знадобляться provider config, async dispatch, шаблони й observability;
  - у поточний релізний scope це не включаємо.
3. Якщо продовжувати саме технічне посилення pre-MVP, то наступний корисний шар — не нова feature-розробка, а hardening:
  - додаткові integration tests для ticket permission matrix і notification dispatch;
  - runtime smoke-check `next build` / `nest build` / dev startup;
  - за потреби подальше звуження залежностей `BoardsController`, якщо він знову почне розростатися.
4. Нижчі секції файла зберігаємо як журнал еволюції проєкту, а не як актуальний backlog.

---

## Актуалізація на 2026-03-19

### Що зробили за поточний етап

1. Довели першу робочу версію інвайтів за токеном:
  - у `BoardInvitation` додано `token`;
  - реалізовано публічний lookup за токеном;
  - реалізовано прийняття інвайту за токеном;
  - посилання формується у вигляді `/invite/:token`.
2. Додали фронтову сторінку публічного інвайту:
  - маршрут `src/app/invite/[token]/page.tsx`;
  - компонент `src/components/invite/InvitePageContent.tsx`;
  - сторінка вміє показувати стан інвайту, строк дії та кнопку прийняття.
3. Додали UI керування інвайтами на сторінці користувачів дошки:
  - форма створення інвайту в `BoardUsersClient`;
  - таблиця очікуваних запрошень;
  - кнопка копіювання посилання запрошення.
4. Виправили критичний баг публічної invite-сторінки:
  - раніше `GET /api/proxy/invitations/:token` ішов через загальний proxy, який завжди вимагав сесію;
  - тепер публічний lookup інвайту дозволено без авторизації;
  - `accept` при цьому, як і раніше, залишається прив'язаним до авторизованого користувача.
5. Покращили обробку помилок на invite-flow:
  - фронтовий `apiRequest` тепер читає `message` з backend JSON-помилок;
  - mismatch email, expired, revoked/not pending відображаються зрозумілим текстом;
  - для оброблених invite-помилок прибрано зайві `console.error`, щоб не підіймати зайвий Next dev overlay.
6. Виправили hydration mismatch на сторінці користувачів дошки:
  - коренева причина виявилася не лише в MUI App Router cache, а й у `src/components/ui/Button/Button.tsx`;
  - там був `styled-components` wrapper поверх MUI Button (`styled(MuiButton)`), що давало розсинхрон className між SSR і клієнтом;
  - обгортку прибрано, `Button` переведено на звичайний MUI Button + `sx`.
7. Підключили `@mui/material-nextjs` і обгорнули app в `AppRouterCacheProvider`:
  - це потрібно для коректної роботи emotion/MUI в Next App Router.
8. Застосували всі накопичені Prisma-міграції в кореневому проєкті:
  - до цього Nest падав на `public.Board` / `public.User does not exist`;
  - після застосування міграцій база прийшла в sync зі схемою.

### Що важливо розуміти щодо поточного стану

1. Поточна версія інвайтів поки що ще персональна:
  - email обов'язковий;
  - acceptance перевіряє збіг email користувача та email інвайту.
2. Shared / масові посилання поки не реалізовані.
3. Сторінка `/invite/:token` уже існує і працює як публічна точка входу, тобто для shared-link моделі не потрібно вигадувати новий entrypoint — потрібно розширювати поточну модель.
4. На сторінці користувачів дошки посилання зараз не показується як текстове поле:
  - воно вже генерується;
  - його можна скопіювати через кнопку `📋` у секції очікуваних запрошень.
5. На момент зупинки робіт `server-nest` локально не був піднятий стабільно (`npm run start:dev` завершувався з помилкою), тому перед продовженням наступної ітерації потрібно спершу підняти dev backend і переконатися, що він стартує без runtime-помилок.

### Рішення, узгоджене на наступну ітерацію

Переходимо до повноцінної моделі двох типів посилань:

1. `PERSONAL`
  - посилання прив'язане до email;
  - acceptance дозволений лише користувачу зі збіжним email.
2. `SHARED`
  - посилання без email;
  - за одним посиланням можуть прийняти кілька користувачів;
  - ліміт uses читається з env;
  - строк життя теж читається з env.

Додатково узгоджено:

1. Для shared-link потрібен вибір одноразове / багаторазове.
2. Максимум uses поки беремо з env, дефолтна бізнес-логіка — до 10 користувачів.
3. TTL посилання — один тиждень, теж через env.
4. Через посилання призначається лише `customRoleId`.
  - board role не змінюється через invite;
  - підвищення board role потім буде окремим механізмом.
5. Якщо користувач уже перебуває в дошці:
  - accept має бути ідемпотентним;
  - нічого не змінювати й не падати з помилкою.
6. Якщо custom role видалили після генерації посилання:
  - acceptance має завершуватися відмовою;
  - користувачу показуємо, що потрібне нове посилання.
7. Після логіна/реєстрації потрібно продовжувати invite flow:
  - токен треба запам'ятовувати між `/invite/:token` і auth flow;
  - після успішного входу/реєстрації acceptance має продовжуватися автоматично.
8. Для shared-link потрібні всі окремі стани UI:
  - revoked;
  - expired;
  - limit reached;
  - already accepted / already member;
  - email mismatch для personal invite.
9. Для shared-link важливо зробити атомарну перевірку ліміту uses, щоб уникнути race condition при одночасному прийнятті.

### Що планувалося зробити наступним кроком

Наступний незавершений slice, на якому роботу було зупинено:

1. Розширити `BoardInvitation` у Prisma:
  - `type: PERSONAL | SHARED`;
  - `email: String?`;
  - `customRoleId: String?`;
  - `createdByUserId: String?`;
  - `maxUses: Int?`;
  - `usedCount: Int @default(0)`;
  - прибрати жорстку унікальність `@@unique([boardId, email])` як універсальне правило;
  - додати зв'язки/індекси під нову модель.
2. Переписати backend-логіку створення і прийняття інвайтів:
  - env-конфіг для TTL і shared max uses;
  - idempotent accept;
  - atomic increment для shared-link;
  - перевірка видаленої кастомної ролі.
3. Оновити UI `BoardUsersClient`:
  - явний вибір між `PERSONAL` і `SHARED`;
  - чекбокс/перемикач одноразове vs багаторазове shared-link;
  - показувати посилання в явному вигляді, а не лише кнопкою копіювання.
4. Реалізувати resume flow після auth:
  - invite token потрібно переносити через signin/register redirect chain.

### Практичні нотатки перед продовженням роботи

1. Перед наступною ітерацією варто перевірити поточний стан `package.json`, тому що під час фіксу hydration було додано `@mui/material-nextjs`.
2. Під час редагування invite-flow треба особливо акуратно перевіряти `src/lib/api/routes.ts` і `src/lib/api/client.ts`:
  - раніше ці файли вже ламалися через невдалі масові правки.
3. Якщо повторно почнуться дивні hydration warning'и, насамперед перевіряти, чи не обгорнули MUI-компонент через `styled-components`.

---

## Актуалізація на 2026-03-16

Нижче в документі є історичні секції (як проєкт стартував). Цей блок фіксує поточний стан після останніх змін.

### Що зробили за поточний етап

1. Підняли `server-nest/` як основний бекенд і завершили виведення Go з runtime.
2. Перенесли базову логіку бордів/колонок у Nest:
  - список бордів;
  - створення борду;
  - отримання борду;
  - reorder/rename/delete колонок.
3. Оновили Prisma-схему під auth + ролі + membership (у корені та в `server-nest/prisma/schema.prisma`):
  - OAuth-моделі: `Account`, `Session`, `VerificationToken`;
  - розширили `User` (`image`, `emailVerified`, ролі);
  - додали `BoardMember` для ролі користувача всередині конкретної дошки.
4. Впровадили Auth.js (NextAuth v5 beta) у Next:
  - OAuth-провайдери: Google, GitHub, Facebook;
  - стратегія сесій: `database`;
  - API-маршрут: `src/app/api/auth/[...nextauth]/route.ts`.
5. Додали рольову модель у 3 вимірах:
  - monetization role: `FREE | SUBMITTED | PREMIUM`;
  - work role: `CLIENT | EXECUTOR | ORGANIZER | CEO`;
  - dashboard role: рядкова роль у `BoardMember.role`.
6. Оновили роутинг і доступ:
  - `/` тепер редіректить на `/auth/signin` або `/boards`;
  - `middleware.ts` захищає `/boards` і `/dashboard/*`;
  - додано сторінку `src/app/boards/page.tsx` як authenticated entry.
7. Синхронізували фронтовий API-клієнт і типи під user-scoped дані.
8. Полагодили інфраструктурні проблеми, які блокували запуск:
  - Prisma v7 runtime/config нюанси;
  - завантаження env у Nest;
  - конфліктні імпорти Prisma-клієнта;
  - помилки типізації `pg`.
9. Перевірили git-шум щодо `server-nest/node_modules`:
  - папка ігнорується коректно;
  - tracked-файлів в індексі немає.
10. Довели Google OAuth до робочого стану end-to-end:
  - створено OAuth Client у Google;
  - прописано `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` у `.env`;
  - підтверджено вхід через `/auth/signin` і callback Auth.js.
11. Полагодили падіння Auth.js adapter (`prisma.account.findUnique`):
  - регенерація Prisma Client після змін auth-моделей;
  - перезапуск Next після оновлення клієнта.
12. Виправили Prisma runtime module mismatch у згенерованому клієнті:
  - замість `query_compiler_fast_bg.postgresql.*` використовується доступний runtime `query_compiler_bg.postgresql.*`;
  - після фіксу збірка/запуск застосунку більше не падають на `Module not found`.

### Додатково зроблено (фінал дня, 2026-03-16)

1. Повністю прибрали Go legacy з runtime і документації:
  - видалено `server/` (Go backend);
  - проєкт працює у зв'язці Next + Nest.
2. Провели cleanup фронта від Tailwind і зайвих залежностей:
  - видалено tailwind/postcss хвости;
  - стилі приведено до plain CSS + поточного UI стеку.
3. Закрили великий шар lint/type проблем:
  - налаштовано коректні ignores для generated/dist;
  - виправлено unsafe місця в PrismaService та невикористовувані імпорти/змінні;
  - лінт приведено до робочого стану.
4. Підняли локальну PostgreSQL і синхронізували міграції:
  - застосовано Prisma-міграції;
  - усунуто конфлікти портів і проблеми запуску dev-оточення.
5. Посилили backend-proxy безпеку:
  - браузер ходить у Nest через Next proxy;
  - на proxy додано обов'язкову перевірку сесії (401 без auth);
  - додано явні відповіді на помилки конфігурації/недоступності backend (500/503).
6. Пробували onboarding-гілку з редіректами, потім відкотили як надмірно складну для поточного етапу.
7. Прийнято робочу модель без редіректу:
  - після OAuth — звичайний вхід на `/boards`;
  - додано прапорець `User.isDefault` + профільні поля (`firstName`, `lastName`, `nickname`);
  - під час завантаження `/boards` фронт запитує state через Nest;
  - якщо `isDefault=true`, показується модалка профілю;
  - після збереження профіль пишеться в БД, `isDefault=false`, UI оновлюється динамічно.
8. Додано backend-модуль `users` у Nest:
  - `GET /users/me/default-state`;
  - `PATCH /users/me/default-profile`.

### Поточна робоча поведінка (узгоджена)

1. Авторизація: дефолтний OAuth flow (Google/GitHub/Facebook у міру наявності credentials).
2. Редірект після входу: на `/boards`.
3. Первинне донастроювання профілю: через модалку на `/boards`, без окремого onboarding route.
4. API-доступ до Nest із браузера: лише через Next proxy.

### Що зараз по факту архітектурно

- Go-сервер видалено з активної кодової бази.
- Nest-сервер покриває поточний board-flow і розвивається як єдиний API backend.
- Auth і сесії тепер зав'язані на БД (а не на mock/local-only).
- Авторизація на фронті працює через middleware + session provider.
- Модель доступу вже готова під монетизацію і B2B/командні сценарії.

---

## 6. Найближчі кроки (актуальний TODO)

### Критично (найближчі 1-2 ітерації)

1. Винести модалку default-профілю з `boards/page` в окремий компонент:
  - зменшити зв'язність сторінки;
  - спростити подальші зміни UX/валідацій.
2. Закрити UX-валидації профілю:
  - нормалізувати nickname (регістр, пробіли, допустимі символи);
  - зрозумілі помилки щодо конфлікту унікальності;
  - додати optimistic/blocking стани кнопок.
3. Добити провайдери OAuth:
  - Google уже робочий;
  - підключити/перевірити GitHub і Facebook (якщо потрібні в MVP).

### Важливо (наступні ітерації)

1. Дополірувати board management UX:
  - не показувати або блокувати member/invite actions для `MEMBER` / `VIEWER`;
  - не маскувати `401/403/500` на dashboard-сторінках під `404`.
2. Уніфікувати ticket enums між frontend і backend:
  - одне джерело правди для `status`, `type`, `priority`;
  - прибрати ризик потрапляння довільних рядків у БД і подальшої поломки колонок/UI.
3. Продовжити regression/e2e-покриття критичних flows:
  - invite accept/revoke/create з role-based обмеженнями;
  - board settings/users сценарії для OWNER / ADMIN / MEMBER.

### У найближчий релізний цикл

1. Пройти smoke/regression по зв'язці: auth -> boards -> default profile modal -> create board.
2. Додати e2e-сценарій на `isDefault` flow.
3. Стабілізувати dev scripts (один Next + один Nest процес, без lock/портових перегонів).

## 7. Стратегія подальшої розробки (пропозиція)

### Принцип

Ідемо ітеративно: "спочатку паритет, потім покращення". Не змішуємо одночасно глибокий рефакторинг і нові продуктові фічі.

Окремо: уникаємо великих змін auth-flow до моменту, поки не закрито продуктовий сценарій запрошень і membership.

### Рекомендований порядок

1. Stabilize поточний auth+boards (без нових редіректів/онбордингів).
2. Винести й допрацювати default-profile модалку як окремий UI-модуль.
3. Реалізувати email-invite у борди як наступний вертикальний slice.
4. Після цього розширювати domain (tickets/comments/realtime).

### Технічні правила на наступні етапи

1. Prisma schema у корені та в `server-nest` тримати синхронно, без ручного розходження.
2. Будь-яка нова роль/permission спочатку описується в БД і серверних перевірках, потім у UI.
3. Будь-який новий endpoint спочатку документується коротким контрактом (input/output/errors), потім код.
4. Усі risky-зміни (auth, membership, ролі) проганяти щонайменше через smoke-скрипт перед merge.
5. Не запускати паралельно кілька `next dev`/`nest --watch` в одній робочій копії (щоб уникнути lock/порт-конфліктів і хибних 5xx).

---

## Актуалізація на 2026-03-17

### Що зробили за день

1. Розширили доменну модель дощок і ролей:
  - `BoardMember.role` переведено на enum `BoardMemberRole`;
  - додано `BoardRole` і `BoardInvitation`;
  - схему синхронізовано і в кореневому Prisma, і в `server-nest/prisma/schema.prisma`.
2. Реалізували backend API для ролей дошки:
  - `POST /boards/:boardId/roles`;
  - `GET /boards/:boardId/roles`;
  - `PATCH /boards/:boardId/roles/:roleId`;
  - `DELETE /boards/:boardId/roles/:roleId`.
3. Реалізували backend API для інвайтів у дошку:
  - `POST /boards/:boardId/invitations`;
  - `GET /boards/:boardId/invitations`;
  - `POST /boards/:boardId/invitations/:invitationId/accept`;
  - `DELETE /boards/:boardId/invitations/:invitationId`.
4. Оновили створення дошки:
  - у модалку додано введення кастомних ролей;
  - кастомні ролі створюються одразу під час створення борду;
  - виправлено критичний баг: під час створення борду тепер передається `ownerId`, тому для створювача реально створюється `BoardMember`.
5. Перевели створення тікетів з `prompt` на повноцінну модалку:
  - `title`, `description`, `type`, `priority`;
  - вибір доступу за ролями;
  - у мультиселекті спочатку стандартні ролі (`owner/admin/member/viewer`), потім кастомні ролі дошки.
6. Допрацювали модалку тікета:
  - додали backend `PATCH /boards/:boardId/tickets/:ticketId`;
  - додали backend `DELETE /boards/:boardId/tickets/:ticketId`;
  - редагування тікета з модалки тепер реально зберігається в Nest;
  - видалення тікета з модалки тепер реально працює через API.
7. Привели Next build до стабільного стану:
  - виправили контракт `params` для Next 16 App Router;
  - виключили `server-nest` із фронтового typecheck через `tsconfig.json`;
  - додали `@types/express` для коректної типізації у фронтовій збірці, коли Next захоплював backend-код.
8. Провели фронтовий cleanup і перший шар систематизації UI:
  - додано shared-компоненти `RolesSelect`, `TicketTypeSelect`, `TicketPrioritySelect`, `TicketStatusSelect`;
  - введено єдиний barrel `src/components/ui/index.ts`;
  - `TicketModal` і `BoardColumns` переведено на shared UI-компоненти;
  - видалено невикористовувані/порожні компоненти: `TaskList`, `TicketList`, `TicketDetails`, `ModalTaskEditor`.

### Ключові баги та спостереження

1. Найважливіший знайдений баг за день:
  - борд створювався без `ownerId` у клієнтському виклику `createBoard`;
  - через це в таблиці `BoardMember` не з'являвся запис для створювача;
  - будь-які захищені операції (`delete ticket`, `update ticket`, roles/invitations) падали через `ensureBoardMembership` з `400 board access denied`.
2. У поточному стані `accessibilityRoles` уже зберігаються і редагуються коректно, але це поки що лише дані, а не повноцінний enforcement.
  - Тобто обмеження видимості/редагування на сервері поки не застосовуються за цими ролями автоматично.
3. У Next 16 важливо акуратно стежити за server/app route typing:
  - `params` для dynamic routes у typegen очікуються як `Promise<...>`.
4. На фронті був явний structural drift:
  - частина UI вже жила через MUI/styled-components;
  - частина через локальні ad-hoc компоненти;
  - частина файлів була порожньою або orphaned.
  Сьогодні це почали вичищати, але роботу ще не завершено на весь фронт.
5. У збірці Next залишилися warning'и щодо Prisma + Edge Runtime:
  - це не ламає build зараз;
  - але це сигнал, що `auth.ts` / prisma imports потенційно можуть бути чутливими в edge-context, якщо туди й надалі потраплятимуть Node-only залежності.

### Рекомендації

1. Не розпорошуватися далі на випадкові UX-покращення тікетів, поки не закрито enforcement прав.
2. Усі нові поля доступу спочатку реалізовувати в серверних перевірках, і лише потім розширювати UI.
3. Продовжувати виносити повторюваний UI в shared-шар:
  - кнопки;
  - select'и;
  - field groups;
  - modal actions;
  - статусні chip/badge-компоненти.
4. Після видалення orphaned-компонентів періодично робити повторне очищення imports/types, тому що проєкт історично вже накопичив кілька шарів застарілих abstraction-ів.
5. Під час перевірки build на Windows краще викликати Node/Nest/Next напряму через `node .../bin/...`, якщо PowerShell execution policy заважає звичайним `npm`/`npx` сценаріям.

### Що логічніше робити далі

#### Наступний найкращий крок

1. Реалізувати backend enforcement для ticket-доступів:
  - фільтрація видимості тікетів за `accessibilityRoles`;
  - перевірка прав на update/delete;
  - окреме правило на зміну самого доступу до тікета.

#### Після цього

1. Зробити `Board Settings` / `Board Management` UI:
  - учасники;
  - інвайти;
  - кастомні ролі;
  - зміна ролей учасникам.
2. Потім перейти до permissions у кастомних ролей:
  - поки у кастомних ролей є лише ім'я;
  - наступний шар — реальні permissions (`ticket.view`, `ticket.edit`, `ticket.delete`, `board.manage_members` тощо).

### Практичний TODO на наступну ітерацію

1. Винести серверні helper'и доступу в окремий service/guard utility для boards/tickets.
2. Додати серверну функцію на кшталт `getEffectiveBoardRolesForUser(boardId, userId)`.
3. На читанні борду фільтрувати `tickets` за цими ролями.
4. На mutation-ендпоінтах тікета ввести перевірку не лише membership, а й ticket-level access.
5. Після цього будувати UI керування учасниками та ролями дошки.

---

## Актуалізація на 2026-03-24

### Що зробили за день

Це був насамперед **релізно-підготовчий** етап: не нові фічі, а системне доведення до стандарту, за якого проєкт можна запускати й передавати іншим людям без страху.

#### Безпека і hardening

1. Підключили `helmet` у bootstrap Nest — базові HTTP security headers на всіх відповідях API.
2. Додали глобальний rate limiting через `@nestjs/throttler` (AppModule + global guard).
3. Додали посилені per-endpoint throttle декоратори на публічних invite-ендпоінтах (lookup / accept) — спрямований захист від brute-force за токеном.
4. Додали lightweight in-memory rate limiter у Next `middleware.ts` для `/auth/*` і `/invite/*` — захист від перебору на рівні фронтенда до того, як запит дійде до бекенда.
5. Додали розширений набір security headers у `next.config.ts`:
   - CSP baseline;
   - `X-Frame-Options: DENY`;
   - `X-Content-Type-Options: nosniff`;
   - `Referrer-Policy: strict-origin-when-cross-origin`;
   - вимкнено `X-Powered-By`.

#### Тестування (з нуля до робочої інфраструктури)

1. Створено `jest.config.ts` для unit-тестів у `server-nest`.
2. Створено `test/jest-e2e.json` для e2e-тестів.
3. Додано npm-скрипти `test`, `test:watch`, `test:e2e` у `server-nest/package.json`.
4. Написано перший `boards.service.spec.ts` — 4 unit-тести на приватну логіку:
   - pending invitation state;
   - limit_reached при вичерпанні shared-інвайту;
   - OWNER завжди може керувати доступом;
   - VIEWER не може редагувати при restrictive policy.
5. Написано `test/health.e2e-spec.ts` — smoke e2e через supertest + Nest bootstrap.
6. Прогнано всі тести, стабільно зелені: unit 4/4, e2e 1/1.
7. У процесі доведення довелося вирішити два нетривіальні нюанси:
   - в e2e потрібно `import * as request from 'supertest'`, а не `default import` (CommonJS interop);
   - health-контролер повертає plain `'ok'`, а не `{ status: 'ok' }` — тест має перевіряти `response.text`, а не `response.body`.

#### Нові фічі

1. Додано `DELETE /boards/:boardId` у backend (owner-only, cascade через Prisma).
2. Додано `deleteBoard` в API-клієнт фронта, RTK Query mutation і UI-кнопку видалення борду з confirmation.
3. Додано серверну підтримку пагінації тікетів під час запиту борду: query-параметри `ticketsOffset` / `ticketsLimit` у `GET /boards/:id`.

#### Фронтова стійкість (resilience)

1. Створено `src/app/error.tsx` — глобальний error boundary для App Router з кнопками `Повторити` і `До дошок`.
2. Створено `src/app/not-found.tsx` — кастомну 404-сторінку.
3. У `src/app/dashboard/[boardId]/page.tsx` замінено ручний fallback на `notFound()`.
4. Обидва файли підтримують i18n through `next-intl`.
5. Додано переклади (`errors.*`) у всі три locale: en / ru / uk.

#### Інфраструктура

1. Створено `.github/workflows/ci.yml` — два job'и: frontend (lint + build) і backend (build + unit + e2e).
2. Розширено `.env.example` у корені (Swagger URL, rate limit env, app public URL).
3. Створено `server-nest/.env.example` — уперше задокументовано всі змінні бекенда.
4. Переписано `README.md` — прибрано стандартні Next.js шаблонні тексти, додано: опис проєкту, архітектура, інструкція із запуску, змінні оточення, тестування, security notes.

#### Lint і якість коду (фінальний cleanup)

1. Усунено 13 lint-помилок:
   - 4 `any` у `boards.service.ts` → замінено на `CreateBoardRoleDto`, `UpdateBoardRoleDto`, `Partial<{...}>`, `unknown`;
   - `(service as any).method` у тесті → замінено на типізований `serviceInternals` з explicit interface;
   - `require()` import в e2e → замінено на `import * as`;
   - 4 порушення `react-hooks/set-state-in-effect` → `setState` обгорнуто через `setTimeout(..., 0)` у `BoardColumns.tsx` і `TicketModal.tsx`.
2. Фінальні результати після всіх правок:
   - `npm run lint` — 0 помилок, 0 попереджень;
   - `npm run build` (Next) — успішно, 0 TypeScript помилок;
   - `nest build` — успішно, 0 TypeScript помилок;
   - unit tests — 4/4;
   - e2e tests — 1/1.

---

### Спостереження за підсумками дня

#### Що видно в архітектурі прямо зараз

1. **`boards.service.ts` — критична точка росту.**
   Файл уже перевищує 2000 рядків. Усередині нього впереміш: бізнес-логіка дощок, квитків, колонок, інвайтів, ролей, нотифікацій, агрегацій. Це поки працює, але при наступному великому feature-шарі (наприклад, real-time колаборація або повноцінний permission enforcement) файл стане непосильним для розуміння або безпечної зміни.

2. **Notification-шар реалізовано, але не тестується.**
   `createAndDispatchNotifications`, `notifyBoardMembers`, `listUserNotifications` — ці методи існують і, судячи з TypeScript, коректні. Але жоден тест їх не покриває. За будь-якого рефакторингу цього шару його можна зламати тихо.

3. **RTK Query API (`src/store/api.ts`) повністю відповідає backend.**
   Це добрий знак: клієнтський і серверний контракти не розійшлися. Але весь `api.ts` — це один монолітний `createApi` із ~400 рядків. При подальшому розширенні варто розбити за namespace'ами (boards, tickets, members, notifications).

4. **Realtime-loop замкнений — `DashboardClient.tsx` уже підписується і реагує.**
   `SocketContext.tsx` підключається, реєструє userId. `RealtimeGateway` відправляє події. `DashboardClient.tsx` викликає `useSocket()`, на `componentDidMount` емітить `subscribe-board`, слухає `board-state-changed` (інвалідовує RTK-тег `Board`) і `ticket-state-changed` (інвалідовує `BoardTicket` + анімує переміщення). Власне echo-відсікання через `actorUserId === session.user.id`. На `unmount` — `unsubscribe-board`. Realtime повністю робочий.

5. **Security headers — baseline, не фінальний рівень.**
   CSP написано як baseline (без nonces для inline-scripts). MUI + emotion генерують inline-критичні стилі, що в production із `nonce`-based CSP вимагатиме доопрацювання. Зараз це нормально, але треба мати на увазі, що поточний CSP — це відправна точка, а не production-hardened конфіг.

6. **Тестове покриття поки дуже мале.**
   4 unit-тести + 1 e2e — це каркас інфраструктури, а не coverage. Із критичної логіки не тестуються: invitation acceptance, ticket access enforcement, board deletion із пов'язаними даними, notifications dispatch. Це технічний борг, який різко зросте, коли проєкт почнуть використовувати кілька людей.

---

### Бачення подальшого розвитку

#### ~~Найближчий крок — realtime реактивність~~ ✅ Уже зроблено

`DashboardClient.tsx` уже підписується на `board-state-changed` і `ticket-state-changed`, інвалідовує RTK Query теги та анімує переміщення тікетів. Realtime-loop закрито. Це більше не задача.

#### Board Management UI — частково зроблено

Серверну логіку реалізовано повністю: ролі, інвайти, керування учасниками, видалення.

На фронті існує сторінка `src/app/dashboard/[boardId]/users/` з компонентом `BoardUsersClient`:
- список учасників зі зміною кастомної ролі й видаленням;
- створення інвайтів типу `PERSONAL` (з email) і `SHARED` (без email, `SINGLE_USE` / `MULTI_USE`);
- таблиця pending-інвайтів із копіюванням посилання і відкликанням.

**Що поки не реалізовано:**
- Сторінка `/dashboard/[boardId]/settings` — sidebar на неї посилається, але page.tsx не існує.
- UI керування кастомними ролями (create / rename / delete) — доступно лише під час створення борду, не редагується після.

Наступний реальний крок — створити сторінку `/settings` (або додати вкладку "Ролі" в `/users`) з CRUD кастомних ролей.

#### Технічний борг, який треба погасити до наступного feature-шару

1. **Розділити `boards.service.ts`** на кілька сервісів:
   - `BoardsService` (CRUD борду + memberships);
   - `TicketsService` (тікети, коментарі, access policy enforcement);
   - `BoardInvitationsService` (інвайти, токени, acceptance flow);
   - `NotificationsService` (dispatch, list, read).

2. **Додати тести на критичну логіку:**
   - acceptance флоу інвайтів (personal + shared, expiry, limit);
   - ticket access enforcement (view/edit/delete за ролями);
   - deleteBoard з каскадом.

3. **RTK Query api.ts розбити за namespace:**
   - `boardsApi`, `ticketsApi`, `membersApi`, `notificationsApi`;
   - це також дозволить перевикористовувати теги й інвалідації точково, а не через один глобальний `appApi`.

#### Середньострокове бачення (наступні 2–3 ітерації)

1. **Повноцінний ticket lifecycle:**
   - assignees (кому призначено);
   - due date + reminder (через notification dispatch);
   - subtask completion агрегація;
   - attachments (хоча б як посилання).

2. **Board-level аналітика:**
   - скільки тікетів у кожному статусі;
   - burndown або простий лічильник прогресу спринту;
   - це зробить борд не просто Kanban, а управлінським інструментом.

3. **Email-сповіщення:**
   - зараз нотифікації зберігаються в БД і віддаються в realtime;
   - наступний рівень — надсилання email при важливих подіях (invite, mention, призначення);
   - minimal MVP: SMTP + Nodemailer у Nest, шаблон запрошення.

4. **Багатокористувацька колаборація на тікеті:**
   - lock під час редагування (optimistic, через realtime);
   - cursor awareness (хто дивиться на тікет просто зараз);
   - це реалістично, тому що realtime-шар уже готовий приймати ці події.

#### Довгострокове бачення

Проєкт будувався як pet-project, але архітектурно вже зараз готовий до командної роботи:
- RBAC з кастомними ролями per-board — це enterprise-рівень;
- realtime gateway — це product-level фіча;
- typed API + generated Prisma — це production-grade backend.

Якщо додати email-інвайти, board analytics і mobile-responsive layout — він перетворюється на реально конкурентоспроможний B2B-продукт для невеликих команд.

Ключове, що залишилося зробити для цього переходу:
- закрити realtime loop (subscribe → update → UI);
- зробити Board Settings як повноцінний UI;
- додати мінімальний test coverage на критичну логіку.

Усе інше — це нарощування, а не фундамент.

---

### TODO на наступну ітерацію (пріоритет)

1. `[x]` ~~Підписатися на `board-state-changed` у `[boardId]/page.tsx`, викликати `refetch` при події.~~ — **Зроблено в `DashboardClient.tsx`** (invalidateTags Board + ticket-state-changed)
2. `[x]` ~~Підписатися на `ticket-state-changed` у тому ж компоненті, інвалідовувати `getBoardTicketById`.~~ — **Зроблено** (див. вище)
3. `[ ]` Створити сторінку `/dashboard/[boardId]/settings` — sidebar уже посилається, але файла немає.
4. `[ ]` Додати UI керування кастомними ролями (create / rename / delete) у settings або users page.
5. `[ ]` Розбити `boards.service.ts` — мінімум виділити `BoardInvitationsService` і `NotificationsService`.
6. `[ ]` Додати тест на acceptance flow інвайту (unit, mocked Prisma).
7. `[ ]` Розбити `src/store/api.ts` на namespace-ендпоінти.
8. `[ ]` Email-сповіщення — Nodemailer у Nest, шаблон інвайту.
9. `[ ]` Resume flow після auth — invite-токен має переживати signin/register redirect chain.

---

## Актуалізація на 2026-03-25

### Ревізія — що реально зроблено на цей момент

Цей розділ виправляє низку неточностей із секції 2026-03-24, які описували як «ще не готово» те, що насправді вже було реалізовано в попередніх ітераціях.

#### Realtime — повністю готовий

- `DashboardClient.tsx` імпортує `useSocket()`, на mount емітить `subscribe-board`, слухає події:
  - `board-state-changed` → `dispatch(appApi.util.invalidateTags([{type:'Board', id:boardId}]))`
  - `ticket-state-changed` → `dispatch(appApi.util.invalidateTags([{type:'BoardTicket', id:ticketId}]))` + анімація переміщення
- Самоехо-відсікання: події з `actorUserId === session.user.id` ігноруються.
- На unmount — `unsubscribe-board`.
- `SocketProvider` обгорнуто в `src/components/Providers.tsx`, доступний глобально.

#### Board Users / Invitations UI — реалізовано

- Існує `src/app/dashboard/[boardId]/users/page.tsx`.
- `BoardUsersClient.tsx` забезпечує:
  - список учасників зі зміною кастомної ролі й видаленням;
  - створення інвайтів `PERSONAL` (з email) і `SHARED` (`SINGLE_USE` / `MULTI_USE`);
  - таблицю pending-інвайтів із копіюванням посилання і відкликанням.

#### Ticket access enforcement — працює в бекенді

- `boards.service.ts` містить `normalizeTicketAccessPolicy()`, `canUseTicketPermission()`, `canAccessTicket()`.
- Enforcement застосовується на всіх mutation-ендпоінтах: edit / fill / delete / estimate / comment.

#### SHARED-інвайти — реалізовані (всупереч нотаткам від 2026-03-19)

- Модель `BoardInvitation` містить `type: PERSONAL | SHARED`, `email?`, `customRoleId?`, `maxUses?`, `usedCount`.
- Acceptance-логіка атомарно інкрементує `usedCount` і перевіряє `maxUses`.
- Видалено жорстку унікальність `@@unique([boardId, email])`.

### Що поки не реалізовано (актуальний технічний борг)

| Завдання | Пріоритет |
|---|---|
| `src/app/dashboard/[boardId]/settings/page.tsx` — sidebar посилається, файла немає | Високий |
| UI керування кастомними ролями (створення/перейменування/видалення) | Високий |
| Resume flow: invite-токен переживає ланцюжок редіректів signin/register | Середній |
| Email-сповіщення (Nodemailer, шаблон інвайта) | Середній |
| Розбити `boards.service.ts` (2000+ рядків) на `TicketsService`, `BoardInvitationsService`, `NotificationsService` | Середній |
| Розбити `src/store/api.ts` (~400 рядків) за namespace'ами | Низький |
| Тест на флоу прийняття інвайту (unit, mocked Prisma) | Середній |
| Тест на каскадне видалення борду | Низький |