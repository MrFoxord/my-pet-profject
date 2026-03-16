package main

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

const defaultAssigneeName = "Unassigned"
const defaultAssigneeAvatar = "https://i.pravatar.cc/100?img=1"
const defaultThemeColor = "#f3f4f6"

type TicketIDRef struct {
	ID string `json:"id"`
}

type BoardListItem struct {
	ID          string       `json:"id"`
	Title       string       `json:"title"`
	Description *string      `json:"description"`
	LogoURL     *string      `json:"logoUrl"`
	ThemeColor  *string      `json:"themeColor"`
	Tickets     []TicketIDRef `json:"tickets"`
}

type TicketPayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	Priority    string `json:"priority"`
	Status      string `json:"status"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt,omitempty"`
	DueDate     string `json:"dueDate,omitempty"`
	Assignee    struct {
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	} `json:"assignee"`
	Subtasks []struct {
		ID    string `json:"id"`
		Title string `json:"title"`
		Done  bool   `json:"done"`
	} `json:"subtasks"`
}

type BoardPayload struct {
	ID          string          `json:"id"`
	Title       string          `json:"title"`
	Description string          `json:"description"`
	LogoURL     *string         `json:"logoUrl"`
	ThemeColor  string          `json:"themeColor"`
	Columns     []BoardColumnPayload `json:"columns"`
	Tickets     []TicketPayload `json:"tickets"`
}

type CreateBoardRequest struct {
	Title       string  `json:"title"`
	Description *string `json:"description"`
	ThemeColor  *string `json:"themeColor"`
	LogoURL     *string `json:"logoUrl"`
	Columns     []string `json:"columns"`
}

type BoardColumnPayload struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Position int    `json:"position"`
}

type ReorderColumnsRequest struct {
	ColumnIDs []string `json:"columnIds"`
}

type RenameColumnRequest struct {
	Title string `json:"title"`
}

type DeleteColumnRequest struct {
	TicketIDs []string `json:"ticketIds"`
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}

func normalizeDatabaseURL(raw string) string {
	parsed, err := url.Parse(raw)
	if err != nil {
		return raw
	}

	q := parsed.Query()
	// Prisma uses `schema` in query, pgx treats it as an unsupported server setting.
	q.Del("schema")

	if q.Get("sslmode") == "" {
		host := parsed.Hostname()
		if host == "localhost" || host == "127.0.0.1" || host == "::1" {
			q.Set("sslmode", "disable")
		}
	}

	parsed.RawQuery = q.Encode()
	return parsed.String()
}

func getBoardsList(ctx context.Context, pool *pgxpool.Pool) ([]BoardListItem, error) {
	rows, err := pool.Query(ctx, `
		SELECT id, title, description, "logoUrl", "themeColor"
		FROM "Board"
		ORDER BY "createdAt" ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	boards := make([]BoardListItem, 0)

	for rows.Next() {
		var board BoardListItem
		if err := rows.Scan(&board.ID, &board.Title, &board.Description, &board.LogoURL, &board.ThemeColor); err != nil {
			return nil, err
		}

		ticketRows, err := pool.Query(ctx, `
			SELECT id
			FROM "Ticket"
			WHERE "boardId" = $1
			ORDER BY "createdAt" ASC
		`, board.ID)
		if err != nil {
			return nil, err
		}

		board.Tickets = make([]TicketIDRef, 0)
		for ticketRows.Next() {
			var ticketID string
			if err := ticketRows.Scan(&ticketID); err != nil {
				ticketRows.Close()
				return nil, err
			}
			board.Tickets = append(board.Tickets, TicketIDRef{ID: ticketID})
		}
		if err := ticketRows.Err(); err != nil {
			ticketRows.Close()
			return nil, err
		}
		ticketRows.Close()

		boards = append(boards, board)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return boards, nil
}

func getBoardByID(ctx context.Context, pool *pgxpool.Pool, boardID string) (*BoardPayload, error) {
	var board BoardPayload
	var description *string
	var themeColor *string

	err := pool.QueryRow(ctx, `
		SELECT id, title, description, "logoUrl", "themeColor"
		FROM "Board"
		WHERE id = $1
	`, boardID).Scan(&board.ID, &board.Title, &description, &board.LogoURL, &themeColor)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if description != nil {
		board.Description = *description
	}
	if themeColor != nil && *themeColor != "" {
		board.ThemeColor = *themeColor
	} else {
		board.ThemeColor = defaultThemeColor
	}

	columnRows, err := pool.Query(ctx, `
		SELECT id, title, position
		FROM "BoardColumn"
		WHERE "boardId" = $1
		ORDER BY position ASC, "createdAt" ASC
	`, boardID)
	if err != nil {
		return nil, err
	}
	defer columnRows.Close()

	board.Columns = make([]BoardColumnPayload, 0)
	for columnRows.Next() {
		var column BoardColumnPayload
		if err := columnRows.Scan(&column.ID, &column.Title, &column.Position); err != nil {
			return nil, err
		}
		board.Columns = append(board.Columns, column)
	}
	if err := columnRows.Err(); err != nil {
		return nil, err
	}

	ticketRows, err := pool.Query(ctx, `
		SELECT id, title, description, status, priority, type, "createdAt", "updatedAt", "dueDate"
		FROM "Ticket"
		WHERE "boardId" = $1
		ORDER BY "createdAt" ASC
	`, boardID)
	if err != nil {
		return nil, err
	}
	defer ticketRows.Close()

	board.Tickets = make([]TicketPayload, 0)

	for ticketRows.Next() {
		var ticket TicketPayload
		var description *string
		var dueDate *time.Time
		var createdAt time.Time
		var updatedAt time.Time

		if err := ticketRows.Scan(
			&ticket.ID,
			&ticket.Title,
			&description,
			&ticket.Status,
			&ticket.Priority,
			&ticket.Type,
			&createdAt,
			&updatedAt,
			&dueDate,
		); err != nil {
			return nil, err
		}

		if description != nil {
			ticket.Description = *description
		}

		ticket.CreatedAt = createdAt.Format(time.RFC3339)
		ticket.UpdatedAt = updatedAt.Format(time.RFC3339)
		if dueDate != nil {
			ticket.DueDate = dueDate.Format(time.RFC3339)
		}

		ticket.Assignee.Name = defaultAssigneeName
		ticket.Assignee.Avatar = defaultAssigneeAvatar

		subtaskRows, err := pool.Query(ctx, `
			SELECT id, title, done
			FROM "Subtask"
			WHERE "ticketId" = $1
			ORDER BY id ASC
		`, ticket.ID)
		if err != nil {
			return nil, err
		}

		ticket.Subtasks = make([]struct {
			ID    string `json:"id"`
			Title string `json:"title"`
			Done  bool   `json:"done"`
		}, 0)

		for subtaskRows.Next() {
			var subtask struct {
				ID    string `json:"id"`
				Title string `json:"title"`
				Done  bool   `json:"done"`
			}
			if err := subtaskRows.Scan(&subtask.ID, &subtask.Title, &subtask.Done); err != nil {
				subtaskRows.Close()
				return nil, err
			}
			ticket.Subtasks = append(ticket.Subtasks, subtask)
		}
		if err := subtaskRows.Err(); err != nil {
			subtaskRows.Close()
			return nil, err
		}
		subtaskRows.Close()

		board.Tickets = append(board.Tickets, ticket)
	}

	if err := ticketRows.Err(); err != nil {
		return nil, err
	}

	return &board, nil
}

func normalizeOptionalText(value *string) *string {
	if value == nil {
		return nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}

	return &trimmed
}

func normalizeColumnTitles(columns []string) []string {
	normalized := make([]string, 0, len(columns))
	seen := make(map[string]struct{})

	for _, column := range columns {
		title := strings.TrimSpace(column)
		if title == "" {
			continue
		}
		key := strings.ToLower(title)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		normalized = append(normalized, title)
	}

	if len(normalized) == 0 {
		return []string{"Backlog", "In Progress", "Done"}
	}

	return normalized
}

func newBoardID() (string, error) {
	b := make([]byte, 4)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}

	return fmt.Sprintf("board-%d-%x", time.Now().UnixMilli(), b), nil
}

func createBoard(ctx context.Context, pool *pgxpool.Pool, req CreateBoardRequest) (*BoardListItem, error) {
	title := strings.TrimSpace(req.Title)
	if title == "" {
		return nil, errors.New("title is required")
	}

	boardID, err := newBoardID()
	if err != nil {
		return nil, err
	}

	description := normalizeOptionalText(req.Description)
	logoURL := normalizeOptionalText(req.LogoURL)
	themeColor := normalizeOptionalText(req.ThemeColor)
	columns := normalizeColumnTitles(req.Columns)

	tx, err := pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `
		INSERT INTO "Board" (id, title, description, "logoUrl", "themeColor", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
	`, boardID, title, description, logoURL, themeColor); err != nil {
		return nil, err
	}

	for index, columnTitle := range columns {
		if _, err := tx.Exec(ctx, `
			INSERT INTO "BoardColumn" (id, title, position, "boardId", "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, NOW(), NOW())
		`, fmt.Sprintf("col-%s-%d", boardID, index+1), columnTitle, index, boardID); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return &BoardListItem{
		ID:          boardID,
		Title:       title,
		Description: description,
		LogoURL:     logoURL,
		ThemeColor:  themeColor,
		Tickets:     []TicketIDRef{},
	}, nil
}

func updateBoardColumnsOrder(ctx context.Context, pool *pgxpool.Pool, boardID string, columnIDs []string) error {
	if len(columnIDs) == 0 {
		return errors.New("columnIds are required")
	}

	rows, err := pool.Query(ctx, `
		SELECT id
		FROM "BoardColumn"
		WHERE "boardId" = $1
	`, boardID)
	if err != nil {
		return err
	}
	defer rows.Close()

	existing := make(map[string]struct{})
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		existing[id] = struct{}{}
	}
	if err := rows.Err(); err != nil {
		return err
	}

	if len(existing) != len(columnIDs) {
		return errors.New("columnIds count mismatch")
	}

	for _, id := range columnIDs {
		if _, ok := existing[id]; !ok {
			return errors.New("unknown column id")
		}
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for index, id := range columnIDs {
		if _, err := tx.Exec(ctx, `
			UPDATE "BoardColumn"
			SET position = $1, "updatedAt" = NOW()
			WHERE id = $2 AND "boardId" = $3
		`, index, id, boardID); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func renameBoardColumn(ctx context.Context, pool *pgxpool.Pool, boardID, columnID, title string) error {
	normalizedTitle := strings.TrimSpace(title)
	if normalizedTitle == "" {
		return errors.New("title is required")
	}

	result, err := pool.Exec(ctx, `
		UPDATE "BoardColumn"
		SET title = $1, "updatedAt" = NOW()
		WHERE id = $2 AND "boardId" = $3
	`, normalizedTitle, columnID, boardID)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return errors.New("column not found")
	}

	return nil
}

func deleteBoardColumn(ctx context.Context, pool *pgxpool.Pool, boardID, columnID string, ticketIDs []string) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var columnsCount int
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*)
		FROM "BoardColumn"
		WHERE "boardId" = $1
	`, boardID).Scan(&columnsCount); err != nil {
		return err
	}

	if columnsCount <= 1 {
		return errors.New("at least one column must remain")
	}

	if len(ticketIDs) > 0 {
		if _, err := tx.Exec(ctx, `
			DELETE FROM "Ticket"
			WHERE "boardId" = $1 AND id = ANY($2)
		`, boardID, ticketIDs); err != nil {
			return err
		}
	}

	deleteResult, err := tx.Exec(ctx, `
		DELETE FROM "BoardColumn"
		WHERE id = $1 AND "boardId" = $2
	`, columnID, boardID)
	if err != nil {
		return err
	}

	if deleteResult.RowsAffected() == 0 {
		return errors.New("column not found")
	}

	if _, err := tx.Exec(ctx, `
		WITH ordered AS (
			SELECT id, ROW_NUMBER() OVER (ORDER BY position ASC, "createdAt" ASC) - 1 AS new_position
			FROM "BoardColumn"
			WHERE "boardId" = $1
		)
		UPDATE "BoardColumn" c
		SET position = o.new_position, "updatedAt" = NOW()
		FROM ordered o
		WHERE c.id = o.id
	`, boardID); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func main() {
	_ = godotenv.Load("../.env")

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}
	dsn = normalizeDatabaseURL(dsn)

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("failed to create db pool: %v", err)
	}
	defer pool.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port

	log.Printf("DB connected, starting HTTP server on %s\n", addr)

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	mux.HandleFunc("/boards", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			defer cancel()

			boards, err := getBoardsList(ctx, pool)
			if err != nil {
				log.Printf("failed to get boards: %v", err)
				http.Error(w, "failed to load boards", http.StatusInternalServerError)
				return
			}

			writeJSON(w, http.StatusOK, boards)

		case http.MethodPost:
			var req CreateBoardRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				http.Error(w, "invalid request body", http.StatusBadRequest)
				return
			}

			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			defer cancel()

			board, err := createBoard(ctx, pool, req)
			if err != nil {
				if err.Error() == "title is required" {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}
				log.Printf("failed to create board: %v", err)
				http.Error(w, "failed to create board", http.StatusInternalServerError)
				return
			}

			writeJSON(w, http.StatusCreated, board)

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/boards/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/boards/")
		if path == "" {
			http.NotFound(w, r)
			return
		}

		parts := strings.Split(path, "/")
		boardID := parts[0]
		if boardID == "" {
			http.NotFound(w, r)
			return
		}

		if len(parts) == 1 {
			if r.Method != http.MethodGet {
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				return
			}

			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			defer cancel()

			board, err := getBoardByID(ctx, pool, boardID)
			if err != nil {
				log.Printf("failed to get board by id: %v", err)
				http.Error(w, "failed to load board", http.StatusInternalServerError)
				return
			}

			if board == nil {
				http.NotFound(w, r)
				return
			}

			writeJSON(w, http.StatusOK, board)
			return
		}

		if len(parts) == 3 && parts[1] == "columns" && parts[2] == "order" {
			if r.Method != http.MethodPatch {
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				return
			}

			var req ReorderColumnsRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				http.Error(w, "invalid request body", http.StatusBadRequest)
				return
			}

			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			defer cancel()

			if err := updateBoardColumnsOrder(ctx, pool, boardID, req.ColumnIDs); err != nil {
				if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "mismatch") || strings.Contains(err.Error(), "unknown") {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}
				log.Printf("failed to update board columns order: %v", err)
				http.Error(w, "failed to update columns order", http.StatusInternalServerError)
				return
			}

			writeJSON(w, http.StatusOK, map[string]any{"ok": true})
			return
		}

		if len(parts) == 3 && parts[1] == "columns" {
			columnID := parts[2]
			if columnID == "" {
				http.NotFound(w, r)
				return
			}

			switch r.Method {
			case http.MethodPatch:
				var req RenameColumnRequest
				if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
					http.Error(w, "invalid request body", http.StatusBadRequest)
					return
				}

				ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
				defer cancel()

				if err := renameBoardColumn(ctx, pool, boardID, columnID, req.Title); err != nil {
					if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "not found") {
						http.Error(w, err.Error(), http.StatusBadRequest)
						return
					}
					log.Printf("failed to rename board column: %v", err)
					http.Error(w, "failed to rename column", http.StatusInternalServerError)
					return
				}

				writeJSON(w, http.StatusOK, map[string]any{"ok": true})
				return

			case http.MethodDelete:
				var req DeleteColumnRequest
				_ = json.NewDecoder(r.Body).Decode(&req)

				ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
				defer cancel()

				if err := deleteBoardColumn(ctx, pool, boardID, columnID, req.TicketIDs); err != nil {
					if strings.Contains(err.Error(), "must remain") || strings.Contains(err.Error(), "not found") {
						http.Error(w, err.Error(), http.StatusBadRequest)
						return
					}
					log.Printf("failed to delete board column: %v", err)
					http.Error(w, "failed to delete column", http.StatusInternalServerError)
					return
				}

				writeJSON(w, http.StatusOK, map[string]any{"ok": true})
				return

			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				return
			}
		}

		http.NotFound(w, r)
	})

	srv := &http.Server{
		Addr:         addr,
		Handler:      withCORS(mux), // <─ оборачиваем mux
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
		if allowedOrigin == "" {
			// dev/default: позволяем всё; в проде задаём ALLOWED_ORIGIN
			allowedOrigin = "*"
		}

		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
