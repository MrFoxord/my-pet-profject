import {
  BoardInvitation,
  BoardMember,
  BoardRole,
  CreateBoardInput,
  CreateBoardInvitationInput,
  UpdateBoardInput,
  createBoard,
  createBoardRole,
  createBoardColumn,
  createBoardInvitation,
  deleteBoard,
  deleteBoardRole,
  deleteBoardColumn,
  deleteBoardInvitation,
  deleteBoardMember,
  getBoardById,
  getBoardInvitations,
  getBoardMembers,
  getBoardRoles,
  getBoards,
  leaveBoard,
  renameBoardColumn,
  reorderBoardColumns,
  updateBoard,
  updateBoardMemberCustomRole,
  updateBoardRole,
} from "@/lib/api/client";
import { Board, BoardDto } from "@/types";
import { appApi } from "./api-base";
import { toBoard, toCustomError } from "./api-utils";

export const boardsApi = appApi.injectEndpoints({
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
    updateBoard: builder.mutation<Board | null, { boardId: string; input: UpdateBoardInput }>({
      queryFn: async ({ boardId, input }) => {
        try {
          const data = await updateBoard(boardId, input);
          if (!data) {
            return { data: null };
          }
          return { data: toBoard(data) };
        } catch (error) {
          return { error: toCustomError(error, "Failed to update board") };
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
    createBoardRole: builder.mutation<BoardRole | null, { boardId: string; input: { name: string; permissions?: string[] } }>({
      queryFn: async ({ boardId, input }) => {
        try {
          const data = await createBoardRole(boardId, input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to create board role") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardRoles", id: boardId },
        { type: "BoardMembers", id: boardId },
        { type: "Board", id: boardId },
      ],
    }),
    updateBoardRole: builder.mutation<BoardRole | null, { boardId: string; roleId: string; input: { name?: string; permissions?: string[] } }>({
      queryFn: async ({ boardId, roleId, input }) => {
        try {
          const data = await updateBoardRole(boardId, roleId, input);
          return { data };
        } catch (error) {
          return { error: toCustomError(error, "Failed to update board role") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardRoles", id: boardId },
        { type: "BoardMembers", id: boardId },
        { type: "Board", id: boardId },
      ],
    }),
    deleteBoardRole: builder.mutation<null, { boardId: string; roleId: string }>({
      queryFn: async ({ boardId, roleId }) => {
        try {
          await deleteBoardRole(boardId, roleId);
          return { data: null };
        } catch (error) {
          return { error: toCustomError(error, "Failed to delete board role") };
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardRoles", id: boardId },
        { type: "BoardMembers", id: boardId },
        { type: "Board", id: boardId },
      ],
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
  }),
  overrideExisting: false,
});

export const {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
  useGetBoardByIdQuery,
  useGetBoardRolesQuery,
  useCreateBoardRoleMutation,
  useUpdateBoardRoleMutation,
  useDeleteBoardRoleMutation,
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
} = boardsApi;