import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiBoardResponse,
  ApiTicketReorderPayload,
  BoardInvitation,
  BoardMember,
  BoardRole,
  CreateBoardInput,
  CreateBoardInvitationInput,
  CreateTicketInput,
  NotificationsResponse,
  UpdateTicketInput,
  createBoard,
  createBoardColumn,
  createBoardInvitation,
  createTicket,
  createTicketComment,
  deleteBoard,
  deleteBoardColumn,
  deleteBoardInvitation,
  deleteBoardMember,
  deleteTicket,
  getBoardById,
  getBoardInvitations,
  getBoardMembers,
  getBoardRoles,
  getBoardTicketById,
  getBoards,
  getNotifications,
  leaveBoard,
  markAllNotificationsRead,
  markNotificationRead,
  renameBoardColumn,
  reorderBoardColumns,
  reorderBoardTickets,
  updateBoardMemberCustomRole,
  updateTicket,
} from "@/lib/api/client";
import { buildColumnsFromApi } from "@/lib/boards";
import { Board, BoardDto, Ticket, TicketComment } from "@/types";

type CustomQueryError = {
  status: "CUSTOM_ERROR";
  error: string;
};

function toCustomError(error: unknown, fallback: string): CustomQueryError {
  return {
    status: "CUSTOM_ERROR",
    error: error instanceof Error ? error.message : fallback,
  };
}

function toBoard(apiBoard: ApiBoardResponse): Board {
  const tickets = apiBoard.tickets ?? [];
  return {
    ...apiBoard,
    tickets,
    columns: buildColumnsFromApi(apiBoard.columns ?? [], tickets),
  };
}

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "Boards",
    "Board",
    "BoardTicket",
    "BoardRoles",
    "BoardMembers",
    "BoardInvitations",
    "Notifications",
  ],
  endpoints: (builder) => ({
    getBoards: builder.query<BoardDto[], void>({
      queryFn: async () => {
        try {
          const data = await getBoards();
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load boards") };
        }
      },
      providesTags: ["Boards"],
    }),
    createBoard: builder.mutation<BoardDto | null, CreateBoardInput>({
      queryFn: async (input) => {
        try {
          const data = await createBoard(input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create board") };
        }
      },
      invalidatesTags: ["Boards"],
    }),
    deleteBoard: builder.mutation<null, { boardId: string }>({
      queryFn: async ({ boardId }) => {
        try {
          await deleteBoard(boardId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete board") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        "Boards",
        { type: "Board", id: boardId },
      ],
    }),
    getBoardById: builder.query<Board | null, string>({
      queryFn: async (boardId) => {
        try {
          const data = await getBoardById(boardId);
          if (!data) {
            return { data: null };
          }
          return { data: toBoard(data) };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load board") };
        }
      },
      providesTags: (_result, _error, boardId) => [{ type: "Board", id: boardId }],
    }),
    getBoardTicketById: builder.query<Ticket | null, { boardId: string; ticketId: string }>({
      queryFn: async ({ boardId, ticketId }) => {
        try {
          const data = await getBoardTicketById(boardId, ticketId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load board ticket") };
        }
      },
      providesTags: (_result, _error, { boardId, ticketId }) => [
        { type: "Board", id: boardId },
        { type: "BoardTicket", id: `${boardId}:${ticketId}` },
      ],
    }),
    getBoardRoles: builder.query<BoardRole[], string>({
      queryFn: async (boardId) => {
        try {
          const data = await getBoardRoles(boardId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load board roles") };
        }
      },
      providesTags: (_result, _error, boardId) => [{ type: "BoardRoles", id: boardId }],
    }),
    getBoardMembers: builder.query<BoardMember[], string>({
      queryFn: async (boardId) => {
        try {
          const data = await getBoardMembers(boardId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load board members") };
        }
      },
      providesTags: (_result, _error, boardId) => [{ type: "BoardMembers", id: boardId }],
    }),
    getBoardInvitations: builder.query<BoardInvitation[], string>({
      queryFn: async (boardId) => {
        try {
          const data = await getBoardInvitations(boardId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load board invitations") };
        }
      },
      providesTags: (_result, _error, boardId) => [{ type: "BoardInvitations", id: boardId }],
    }),
    updateBoardMemberCustomRole: builder.mutation<BoardMember | null, { boardId: string; memberId: string; customRoleId: string | null }>({
      queryFn: async ({ boardId, memberId, customRoleId }) => {
        try {
          const data = await updateBoardMemberCustomRole(boardId, memberId, customRoleId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to update board member role") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "BoardMembers", id: boardId }],
    }),
    deleteBoardMember: builder.mutation<null, { boardId: string; memberId: string }>({
      queryFn: async ({ boardId, memberId }) => {
        try {
          await deleteBoardMember(boardId, memberId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete board member") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardMembers", id: boardId },
        { type: "Board", id: boardId },
      ],
    }),
    createBoardInvitation: builder.mutation<BoardInvitation | null, { boardId: string; input: CreateBoardInvitationInput }>({
      queryFn: async ({ boardId, input }) => {
        try {
          const data = await createBoardInvitation(boardId, input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create board invitation") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "BoardInvitations", id: boardId }],
    }),
    deleteBoardInvitation: builder.mutation<null, { boardId: string; invitationId: string }>({
      queryFn: async ({ boardId, invitationId }) => {
        try {
          await deleteBoardInvitation(boardId, invitationId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete board invitation") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "BoardInvitations", id: boardId }],
    }),
    leaveBoard: builder.mutation<null, { boardId: string }>({
      queryFn: async ({ boardId }) => {
        try {
          await leaveBoard(boardId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to leave board") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        "Boards",
        { type: "Board", id: boardId },
        { type: "BoardMembers", id: boardId },
      ],
    }),
    createBoardColumn: builder.mutation<Board["columns"][number] | null, { boardId: string; title: string }>({
      queryFn: async ({ boardId, title }) => {
        try {
          const data = await createBoardColumn(boardId, title);
          if (!data) {
            return { data: null };
          }
          return { data: { id: data.id, title: data.title, ticketIds: [] } };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create board column") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    renameBoardColumn: builder.mutation<null, { boardId: string; columnId: string; title: string }>({
      queryFn: async ({ boardId, columnId, title }) => {
        try {
          await renameBoardColumn(boardId, columnId, title);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to rename board column") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    deleteBoardColumn: builder.mutation<null, { boardId: string; columnId: string; ticketIds: string[] }>({
      queryFn: async ({ boardId, columnId, ticketIds }) => {
        try {
          await deleteBoardColumn(boardId, columnId, ticketIds);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete board column") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    reorderBoardColumns: builder.mutation<null, { boardId: string; columnIds: string[] }>({
      queryFn: async ({ boardId, columnIds }) => {
        try {
          await reorderBoardColumns(boardId, columnIds);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to reorder board columns") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    createTicket: builder.mutation<Ticket | null, CreateTicketInput>({
      queryFn: async (input) => {
        try {
          const data = await createTicket(input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create ticket") };
        }
      },
      invalidatesTags: (_result, _error, input) => [{ type: "Board", id: input.boardId }],
    }),
    updateTicket: builder.mutation<Ticket | null, { boardId: string; ticketId: string; input: UpdateTicketInput }>({
      queryFn: async ({ boardId, ticketId, input }) => {
        try {
          const data = await updateTicket(boardId, ticketId, input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to update ticket") };
        }
      },
      invalidatesTags: (_result, _error, { boardId, ticketId }) => [
        { type: "Board", id: boardId },
        { type: "BoardTicket", id: `${boardId}:${ticketId}` },
      ],
    }),
    createTicketComment: builder.mutation<TicketComment | null, { boardId: string; ticketId: string; body: string }>({
      queryFn: async ({ boardId, ticketId, body }) => {
        try {
          const data = await createTicketComment(boardId, ticketId, body);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create ticket comment") };
        }
      },
      invalidatesTags: (_result, _error, { boardId, ticketId }) => [
        { type: "Board", id: boardId },
        { type: "BoardTicket", id: `${boardId}:${ticketId}` },
      ],
    }),
    deleteTicket: builder.mutation<null, { boardId: string; ticketId: string }>({
      queryFn: async ({ boardId, ticketId }) => {
        try {
          await deleteTicket(boardId, ticketId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete ticket") };
        }
      },
      invalidatesTags: (_result, _error, { boardId, ticketId }) => [
        { type: "Board", id: boardId },
        { type: "BoardTicket", id: `${boardId}:${ticketId}` },
      ],
    }),
    reorderBoardTickets: builder.mutation<null, { boardId: string; payload: ApiTicketReorderPayload }>({
      queryFn: async ({ boardId, payload }) => {
        try {
          await reorderBoardTickets(boardId, payload);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to reorder board tickets") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    getNotifications: builder.query<NotificationsResponse, void>({
      queryFn: async () => {
        try {
          const data = await getNotifications();
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to load notifications") };
        }
      },
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<{ ok: boolean; unreadCount: number } | null, string>({
      queryFn: async (notificationId) => {
        try {
          const data = await markNotificationRead(notificationId);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to mark notification as read") };
        }
      },
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<{ ok: boolean; unreadCount: number } | null, void>({
      queryFn: async () => {
        try {
          const data = await markAllNotificationsRead();
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to mark all notifications as read") };
        }
      },
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useGetBoardByIdQuery,
  useGetBoardTicketByIdQuery,
  useGetBoardRolesQuery,
  useGetBoardMembersQuery,
  useGetBoardInvitationsQuery,
  useUpdateBoardMemberCustomRoleMutation,
  useDeleteBoardMemberMutation,
  useCreateBoardInvitationMutation,
  useDeleteBoardInvitationMutation,
  useLeaveBoardMutation,
  useCreateBoardColumnMutation,
  useRenameBoardColumnMutation,
  useDeleteBoardColumnMutation,
  useReorderBoardColumnsMutation,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useCreateTicketCommentMutation,
  useDeleteTicketMutation,
  useReorderBoardTicketsMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = appApi;
