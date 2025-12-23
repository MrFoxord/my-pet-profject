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

### Бэкенд (план/частично)

- **PostgreSQL** как основная БД.
- **Prisma** — схема уже есть, миграции ещё не прогонялись (нужно поднять Postgres и сменить `DATABASE_URL`).
- Будущий **Go‑сервер**:
  - отдельная папка `/server`;
  - Go будет использовать ту же БД что и Prisma (общий `DATABASE_URL` в `.env`).

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

Сейчас `.env` сгенерен Prisma и содержит `DATABASE_URL` вида:

```env
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

Это **Prisma Data Proxy / Prisma Postgres**.  
Рекомендация для реального проекта: перейти на обычный Postgres с URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_pet_profect?schema=public"
```

План:

1. Поднять локальный Postgres через Docker (пример):

   ```bash
   docker run --name my-pet-postgres ^
     -e POSTGRES_PASSWORD=postgres ^
     -e POSTGRES_DB=my_pet_profect ^
     -p 5432:5432 ^
     -d postgres:16
   ```

2. В корневом `.env` заменить `DATABASE_URL` на обычный `postgresql://...` (как выше).

3. Создать `.env.example` (уже сделан), где описан формат строки подключения и пример.

4. Прогнать миграции и сгенерировать клиент:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

Клиент Prisma настроен на вывод в `src/generated/prisma` (см. `generator client` в `schema.prisma`).

---

## 5. План по Go‑серверу

### 5.1. Структура проекта для Go

Планируем завести папку `server` в корне:

```
my-pet-profect/
  server/
    go.mod
    main.go
    internal/
      db/
      http/
      boards/
```

Примерный план:

1. В `server/`:

   ```bash
   cd server
   go mod init my-pet-profect-server
   ```

2. В `.env` (тот же, что для Prisma) уже есть `DATABASE_URL`.  
   В Go можно либо:
   - парсить его напрямую, либо
   - завести отдельную переменную `PG_DSN` (но проще пока использовать `DATABASE_URL`, если это обычный `postgresql://...`).

3. Использовать, например, `github.com/jackc/pgx/v5/pgxpool` для подключения к Postgres.

4. Первый эндпоинт: `GET /boards`:
   - Возвращает список бордов с тиками:
     - `Board` + связанные `Ticket[]`.
   - На фронте: домашняя (`/`) и `DashboardClient` перестают использовать `mockBoards` и начинают ходить в этот эндпоинт.

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

### Фронт: переход с моков на БД

1. На домашней (`src/app/page.tsx`):
   - вместо `mockBoards` сделать клиентский запрос на `/boards` (пока что можно простым `fetch` из `"use client"` компонента);
   - или завести `app/api/boards/route.ts`, который ходит в Go или напрямую в Prisma (временно).

2. На `DashboardClient`:
   - вместо `board` из `mockBoards` подгружать данные для конкретного борда с бэка.

### Дополнительные фичи (после подключения БД/Go)

- Создание тикета в колонке + сохранение в БД.
- Редактирование тикета из модалки.
- Создание/редактирование/удаление колонок (если вынесем в отдельную сущность).
- Сохранение перетаскивания тикетов/колонок (persist порядка в БД).
- Фильтры, поиск, приоритеты, дедлайны и т.д.

---