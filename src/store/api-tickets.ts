import {
  ApiTicketReorderPayload,
  CreateTicketInput,
  UpdateTicketInput,
  createTicket,
  createTicketComment,
  deleteTicket,
  getBoardTicketById,
  reorderBoardTickets,
  updateTicket,
} from "@/lib/api/client";
import { Ticket, TicketComment } from "@/types";
import { boardsApi } from "./api-boards";
import { toCustomError } from "./api-utils";

export const ticketsApi = boardsApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
  overrideExisting: false,
});

export const {
  useGetBoardTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useCreateTicketCommentMutation,
  useDeleteTicketMutation,
  useReorderBoardTicketsMutation,
} = ticketsApi;