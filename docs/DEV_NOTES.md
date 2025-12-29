# DEV NOTES — my-pet-profect

Этот файл — конспект решений и плана работ, чтобы можно было продолжать разработку с другого ноутбука / другим Copilot, не теряя контекст.

---

## 1. Текущий стек и общая идея

### Фронтенд

- **Next.js (App Router)**.
- **TypeScript**.
- **styled-components** (версия 6) — все новые UI‑штуки стараемся стилить через `styled.ts`.
- **@dnd-kit** — drag & drop для канбана (колонки + тикеты).
- MUI используется точечно (Avatar / Typography и т.п.), но большинство разметки — в styled‑компонентах.
- React Compiler включён в `next.config.ts`:
  - `reactCompiler: true`
  - из‑за этого эффекты (`useEffect`) должны быть аккуратными, без “пляшущих” зависимостей.

### Бэкенд (текущее + план)

- **PostgreSQL** как основная БД.
  - Локально установлен обычный Postgres на Windows.
  - БД: `my_pet_profect` (создана через `CREATE DATABASE my_pet_profect;`).
- **Prisma** — используется как инструмент **схемы и миграций**, а не как рантайм‑ORM во фронте.
  - `schema.prisma` описывает модели `User`, `Board`, `Ticket`, `Subtask`, `Comment`.
  - `DATABASE_URL` указывает на локальный Postgres (формат ниже в разделе 4.3).
  - Миграции уже прогнаны (`npx prisma migrate dev --name init`), клиент сгенерирован (`npx prisma generate`).
  - Сгенерированный Prisma Client **не используется напрямую в Next.js**; схема общая для Go‑сервера и любых тулов.
- **Go‑сервер** (основной бэкенд):
  - код в папке `server/` (отдельный модуль Go);
  - использует тот же Postgres, что и Prisma (`DATABASE_URL` из `.env` в корне);
  - для доступа к БД используется `pgxpool` (`github.com/jackc/pgx/v5/pgxpool`);
  - конфиг и `DATABASE_URL` подхватываются через `github.com/joho/godotenv` (`Load("../.env")`);
  - уже реализован минимальный сервер на `:8080` с эндпоинтом `/health` и CORS‑middleware.

---

## 2. Текущее состояние фронта

### 2.1. Домашняя страница (`src/app/page.tsx` + `src/components/home/styled.ts`)

Цель: показать **список досок** (Board) после “логина” (логина пока нет, доступны все борды).

- Домашка **полностью на styled-components**, без tailwind.
- Чтобы не было “мигания” нестилизованного HTML:
  - компонент `Home` — `"use client"`;
  - есть локальный стейт `isHydrated`;
  - до первого `requestAnimationFrame` рендерится только лоадер (`<Loader />`);
  - основное содержимое (`Title`, `Subtitle`, список досок) рендерится **только после** `isHydrated === true`.

Основные компоненты (`src/components/home/styled.ts`):

- `PageRoot` — фон, выравнивание по центру.
- `PageMain` — контейнер для контента.
- `Header`, `Title`, `Subtitle` — заголовок “Ваши доски” и подпись.
- `BoardsGrid` — грид с карточками досок.
- `BoardCard` — `styled.div`, внутрь рендерится `Next<Link>`.
  - ВАЖНО: `BoardCard` — **НЕ `<a>`**, чтобы не было ошибки “\<a> cannot be descendant of \<a>”.
- `BoardId`, `BoardName`, `BoardDescription`, `BoardMeta` — простая инфа по борду.

Маршрут на доску: `href={`/boards/${board.id}`}`.  
Если путь к доске поменяется — менять тут.

### 2.2. Layout борда (`DashboardClient.tsx` + `src/components/layout/styled.ts`)

`DashboardClient` — клиентский компонент `"use client"`, отвечает за:

- Лейаут: `Sidebar` слева, `Topbar` сверху, основной контент — справа.
- Проброс `board` в канбан (BoardColumns).
- Гейт по гидрации, чтобы избежать проблем со styled‑components и dnd‑атрибутами.

Главные моменты:

- Есть стейт:
  - `isHydrated` — включается после `requestAnimationFrame`.
  - `selectedTicket` + `modalOpen` — для модалки тикета.
- До гидрации:
  - показывается `<Loader />` в основном контенте;
  - **BoardColumns НЕ рендерится вообще**, чтобы не было hydration error из-за `@dnd-kit` (`aria-describedby="DndDescribedBy-X"`).
- После гидрации:
  - рендерится `BoardColumns` внутри `TicketsWrapper`.

`styled.ts` для лейаута:

- `Root` — общий flex, фон берётся из `board.themeColor`.
- `Main`, `Content` — обертки под Topbar/контент.
- `BoardHeader`, `BoardAvatar`, `BoardTitle`, `BoardDescription` — шапка борда.
- `TicketsWrapper` — контейнер под канбан.
- `EmptyBoardText` — текст, если у борда нет тикетов.

### 2.3. Канбан / колонны / тикеты

Основная логика: `src/components/dashboard/BoardColumns/*`.

#### BoardColumns.tsx

Отвечает за:

- DnD-контекст (`DndContext`).
- Обработку перетаскивания **колонок** и **тикетов**.
- Проброс клик‑хэндлера тикета вниз.

Основные детали:

- Локальный стейт:
  - `columns` — массив колонок борда (`board.columns`).
  - `tickets` — список тикетов (`board.tickets`), не меняется локально.
- `ticketsById` — `Record<string, Ticket>` для быстрого доступа.
- DnD:

  - Сенсоры:

    ```ts
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // чтобы не ломать клик по тикету
        },
      })
    );
    ```

    Это важно: пока мышь не сдвинулась на 8px, drag не активируется → нормальный click открывает модалку.

  - `handleDragStart` — запоминает `activeId`.
  - `handleDragOver` — **обрабатывает перенос тикетов**:
    - Если `activeType === "ticket"`:
      - определяет `fromColumnId` из `active.data.current?.columnId`;
      - `toColumnId` из `over.data.current?.columnId` (если над тикетом) или `over.id` (если над колонкой);
      - обновляет массив `ticketIds` в колонках:
        - удаляет тикет из `fromCol.ticketIds`;
        - вставляет в `toCol.ticketIds`:
          - либо перед `overTicketId`, либо в конец.

  - `handleDragEnd` — **обрабатывает перенос колонок**:
    - `activeType === "column"`;
    - находит `fromId = active.id`;
    - определяет `toId`:
      - если `overType === "column"` → `over.id`,
      - если `overType === "ticket"` → колонка, которая содержит этот тикет;
    - делает `arrayMove` по индексам колонок.

- Рендер:

  ```tsx
  <DndContext sensors={sensors} ...>
    <SortableContext
      items={columns.map((c) => c.id)}
      strategy={horizontalListSortingStrategy}
    >
      <ColumnsContainer>
        {columns.map((column) => (
          <BoardColumnView
            key={column.id}
            column={column}
            tickets={column.ticketIds.map((id) => ticketsById[id]).filter(Boolean)}
            onTicketClick={onTicketClick}
          />
        ))}
      </ColumnsContainer>
    </SortableContext>
  </DndContext>
  ```

#### BoardColumnView.tsx

Отвечает за:

- DnD по колонкам (обёртка вокруг `ColumnWrapper`).
- Вложенный `SortableContext` для тикетов в колонке.
- Проброс `onTicketClick` в `TickerCard`.

Ключевые моменты:

- `useSortable({ id: column.id, data: { type: "column" } })` для самой колонки.
- Принудительно обнуляем scale, чтобы колонку не “сплющивало”:

  ```ts
  const style = {
    transform: transform
      ? CSS.Transform.toString({ ...transform, scaleX: 1, scaleY: 1 })
      : undefined,
    transition,
  };
  ```

- `ticketIds = tickets.map(t => t.id)` — список для `SortableContext`.
- Внутри рендерим `SortableTicketCard`:

  ```tsx
  <SortableContext
    items={ticketIds}
    strategy={verticalListSortingStrategy}
  >
    <ColumnTicketList>
      {tickets.map((ticket) => (
        <SortableTicketCard
          key={ticket.id}
          ticket={ticket}
          columnId={column.id}
          onTicketClick={onTicketClick}
        />
      ))}
    </ColumnTicketList>
  </SortableContext>
  ```

- `SortableTicketCard`:

  - `useSortable({ id: ticket.id, data: { type: "ticket", columnId } })`;
  - возвращает `<div ref={setNodeRef} style={style} {...attributes} {...listeners}>`;
  - внутри рендерит `<TickerCard ticket={ticket} onClick={onTicketClick} />`.

#### Тикетная карточка (`TickerCard/TicketCard.tsx`)

- Клиентский компонент `"use client"`.
- Пропсы (по типу `TickerCardProps` из `src/types/...`):
  - `ticket: Ticket`;
  - `onClick?: (ticket: Ticket) => void`;
  - `onRender` больше **не используется** (можно позже выкинуть из типов).
- Клик:

  ```tsx
  <Card onClick={() => onClick?.(ticket)}>
    <HeaderRow>{/* ... */}</HeaderRow>
    {/* остальные части карточки */}
  </Card>
  ```

- В `DashboardClient` `handleTicketClick` принимает `Ticket`, пишет его в `selectedTicket` и открывает модалку `TicketModal`.

---

## 3. Моки и реальные данные

### Моки

- Моки лежат в `src/store/mockBoards.ts` и `src/store/tickets.ts`.
- `mockBoards` сейчас имеют поля:
  - `id`, `title`, `description`, `logoUrl`, `themeColor`;
  - `tickets: Ticket[]`;
  - `columns: BoardColumn[]`, где колонка содержит:
    - `id: string` (например `"todo"`, `"in-progress"`, `"done"`);
    - `title: string`;
    - `ticketIds: string[]` — порядок тикетов в колонке.
- Колонки инициализируются из `tickets` по `status` (todo / in-progress / done).

### План перехода на БД/Go

1. На раннем этапе:
   - Board и Ticket кладём в БД;
   - `columns` на фронте **можно продолжать собирать** из поля `Ticket.status`, чтобы не усложнять схему.
2. Позже:
   - можно добавить в БД сущность `Column` или хранить порядок колонок/тикетов в отдельных таблицах.

---

## 4. Prisma и БД

### 4.1. Файлы Prisma

- `prisma/schema.prisma` — схема моделей.
- `prisma.config.ts` — указывает:
  - `schema: "prisma/schema.prisma"`;
  - `migrations.path: "prisma/migrations"`;
  - `datasource.url: env("DATABASE_URL")`.

### 4.2. Текущая схема (`schema.prisma`)

Модели (примерно):

- `User`
  - `id`, `email`, `name?`, `boards`, `comments`, `createdAt`, `updatedAt`.
- `Board`
  - `id`, `title`, `description?`, `logoUrl?`, `themeColor?`;
  - `ownerId?`, `owner?` (`User`);
  - `tickets`, `createdAt`, `updatedAt`.
- `Ticket`
  - `id: String @id` — человекочитаемый ID (`"PROJ-101"` и т.п.);
  - `title`, `description?`;
  - `status: String` (todo/in-progress/done);
  - `priority: String` (low/medium/high/critical);
  - `type: String` (bug/task/story/...);
  - `boardId` + `board @relation(...)`;
  - `estimateOriginalHours?`, `estimateSpentHours?`, `estimateRemainingHours?`, `storyPoints?`;
  - `subtasks: Subtask[]`;
  - (пока без `Comment` или с ним — зависит от актуальной версии файла);
  - `dueDate?`, `createdAt`, `updatedAt`.
- `Subtask`
  - `id`, `title`, `done: Boolean @default(false)`;
  - `ticketId` + `ticket @relation(...)`.

*(Если в актуальной схеме есть ещё `Comment` — он привязан к `Ticket` и `User`.)*

### 4.3. Настройка `.env` и БД

Сейчас используется **локальный Postgres**, не Prisma Postgres / Data Proxy.

- В корне проекта есть `.env` со строкой подключения вида:

  ```env
  DATABASE_URL="postgresql://postgres:<ТВОЙ_ПАРОЛЬ>@localhost:5432/my_pet_profect?schema=public"
  ```

  Пример из одной из машин:

  ```env
  DATABASE_URL="postgresql://postgres:brd93kv53@localhost:5432/my_pet_profect?schema=public"
  ```

- `.env.example` содержит описание формата `DATABASE_URL` и можно использовать его как шаблон.

- Миграции уже были запущены:

  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```

  В результате в локальной БД созданы таблицы для всех моделей из `schema.prisma`, а Prisma Client сгенерирован в `src/generated/prisma`.

> Важно: Prisma Client сейчас используется только как вспомогательный инструмент (например, через Prisma Studio / seed‑скрипты). Фронтенд (Next.js) и боевой бэкенд (Go) **напрямую в рантайме Prisma не используют**.

### 4.4. Как поднять БД на другой машине

1. Установить PostgreSQL (обычный installer под Windows / Linux / macOS).
2. Создать БД `my_pet_profect` (через `psql` или GUI):

  ```sql
  CREATE DATABASE my_pet_profect;
  ```

3. В корневом `.env` прописать корректный `DATABASE_URL` с твоим логином/паролем.
4. Выполнить миграции и генерацию клиента:

  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```

После этого Go‑сервер и всё остальное будет работать с той же схемой БД.

---

## 5. Go‑сервер

### 5.1. Структура проекта для Go

Сервер уже заведён в корне:

```
my-pet-profect/
  server/
    go.mod
    main.go
    # (в будущем можно добавить internal/db, internal/http, internal/boards и т.п.)
```

- `go.mod` и `go.sum` лежат в `server/` (отдельный модуль Go).
- Основной файл сервера: `server/main.go`.

### 5.2. Текущее состояние main.go

На текущем этапе `main.go` делает следующее:

- Загружает переменные окружения из корневого `.env`:

  ```go
  _ = godotenv.Load("../.env")
  ```

- Берёт `DATABASE_URL` и поднимает пул соединений через `pgxpool`:

  ```go
  pool, err := pgxpool.New(ctx, dsn)
  ```

- Пингует БД (`pool.Ping(ctx)`), чтобы упасть сразу, если база недоступна.
- Поднимает HTTP‑сервер на `:8080`.
- Регистрирует эндпоинт `/health`, который возвращает `200 OK` и строку `"ok"`.
- Оборачивает весь `ServeMux` в CORS‑middleware `withCORS`, который сейчас в dev‑режиме пускает запросы с `Access-Control-Allow-Origin: *` и обрабатывает `OPTIONS`.

Это уже позволяет фронту (`localhost:3000`) сходить на `http://localhost:8080/health` без CORS‑ошибок.

### 5.3. Ближайшие эндпоинты

Следующие шаги по серверу:

1. `GET /boards`

   - Достаёт из БД список бордов (`Board`) и, по минимуму, связанные тикеты (`Ticket[]`).
   - Возвращает JSON в формате, совместимом с `BoardDto` из `src/types/dashboard.ts` (id, title, description, logoUrl, themeColor, tickets: [{ id }]).
   - Фронт на домашней странице (`/`) будет звать именно этот эндпоинт.

2. `GET /boards/:id`

   - Возвращает один борд по ID с полным набором тикетов, subtasks и прочих полей.
   - Будет использоваться страницей борда / дашбордом.

3. (позже) мутации:

   - `POST /tickets` — создать тикет;
   - `PATCH /tickets/:id` — обновить тикет (описание/статус/оценки/подзадачи);
   - `POST /comments` — добавить комментарий;
   - и т.д.

### 5.4. Связка фронт ↔ Go

- Фронтенд (Next.js) в итоге должен ходить **только к Go‑серверу**, а не напрямую к БД / Prisma.
- Для dev‑режима достаточно прямых запросов вида:

  ```ts
  fetch("http://localhost:8080/boards")
  ```

  внутри клиентских компонентов (`"use client"`) с учётом CORS.

- В будущем можно спрятать URL в env (`NEXT_PUBLIC_API_URL`) и собирать его как

  ```ts
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  fetch(`${baseUrl}/boards`);
  ```

### 5.2. Формат API (предложение)

#### GET /boards

Ответ:

```jsonc
[
  {
    "id": "1",
    "title": "Marketing Board",
    "description": "Board for marketing tasks",
    "logoUrl": "/logos/marketing.png",
    "themeColor": "#f3f4f6",
    "tickets": [
      {
        "id": "PROJ-101",
        "title": "...",
        "description": "...",
        "status": "todo",
        "priority": "high",
        "type": "task",
        "boardId": "1",
        "subtasks": [
          { "id": "sub1", "title": "Design", "done": false }
        ]
      }
    ]
  }
]
```

Колонки (`columns`) пока можно строить на фронте из `tickets` по `status`:

- todo → колонка `"To Do"`;
- in-progress → колонка `"In Progress"`;
- done → колонка `"Done"`.

Позже:

- либо сохраняем `columns` как отдельные сущности в БД;
- либо добавляем таблицу для порядка тикетов/колонок.

---

## 6. Ближайшие шаги (TODO)

### БД / Prisma

1. **Решить окончательно по БД**:
   - использовать обычный Postgres (`postgresql://...`).
2. Если выбрали обычный Postgres:
   - поднять контейнер / инстанс;
   - заменить `DATABASE_URL` в `.env` на обычную строку;
   - `npx prisma migrate dev --name init`;
   - `npx prisma generate`.
3. (по желанию) Наполнить БД начальными данными (seed):
   - можно сделать `prisma/seed.ts` или выполнить инсёрты вручную.

### Go‑сервер

1. Создать `server/`, `go.mod`, `main.go`.
2. Подключиться к Postgres через `DATABASE_URL`.
3. Реализовать:
   - `GET /boards` — вернуть все борды с их тикетами.
   - `GET /boards/:id` — вернуть один борд по ID.
4. Настроить CORS либо сделать сервер на том же домене, что и Next (например, через прокси).

### Фронт: переход с моков на БД / Go

1. Домашняя (`src/app/page.tsx`):
  - после гидрации (`isHydrated === true`) вызывать `fetch("http://localhost:8080/boards")`;
  - ожидать от сервера массив `BoardDto[]` и подставлять его вместо `mockBoards`;
  - пока бэкенд не готов, можно временно звать `/health` (как сейчас) просто для проверки связки.

2. Страница борда / `DashboardClient`:
  - вместо `board` из `mockBoards` грузить данные борда по ID через `GET http://localhost:8080/boards/:id`;
  - адаптировать тип `Board` на фронте к форме, которую вернёт Go (минимум: tickets + возможность собрать columns по статусу).

### Дополнительные фичи (после подключения БД/Go)

- Создание тикета в колонке + сохранение в БД.
- Редактирование тикета из модалки.
- Создание/редактирование/удаление колонок (если вынесем в отдельную сущность).
- Сохранение перетаскивания тикетов/колонок (persist порядка в БД).
- Фильтры, поиск, приоритеты, дедлайны и т.д.

---