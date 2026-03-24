import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

type BoardUiState = {
  selectedTicketId: string | null;
  isTicketModalOpen: boolean;
};

type DashboardUiState = {
  byBoardId: Record<string, BoardUiState>;
};

const initialBoardUiState: BoardUiState = {
  selectedTicketId: null,
  isTicketModalOpen: false,
};

const initialState: DashboardUiState = {
  byBoardId: {},
};

function ensureBoardState(state: DashboardUiState, boardId: string): BoardUiState {
  if (!state.byBoardId[boardId]) {
    state.byBoardId[boardId] = { ...initialBoardUiState };
  }

  return state.byBoardId[boardId];
}

const dashboardUiSlice = createSlice({
  name: "dashboardUi",
  initialState,
  reducers: {
    openTicketModal: (
      state,
      action: PayloadAction<{ boardId: string; ticketId: string }>
    ) => {
      const boardState = ensureBoardState(state, action.payload.boardId);
      boardState.selectedTicketId = action.payload.ticketId;
      boardState.isTicketModalOpen = true;
    },
    closeTicketModal: (state, action: PayloadAction<{ boardId: string }>) => {
      const boardState = ensureBoardState(state, action.payload.boardId);
      boardState.isTicketModalOpen = false;
      boardState.selectedTicketId = null;
    },
    setSelectedTicketId: (
      state,
      action: PayloadAction<{ boardId: string; ticketId: string | null }>
    ) => {
      const boardState = ensureBoardState(state, action.payload.boardId);
      boardState.selectedTicketId = action.payload.ticketId;
    },
  },
});

export const { openTicketModal, closeTicketModal, setSelectedTicketId } = dashboardUiSlice.actions;

export const selectBoardUiState = (state: RootState, boardId: string): BoardUiState =>
  state.dashboardUi.byBoardId[boardId] ?? initialBoardUiState;

export const dashboardUiReducer = dashboardUiSlice.reducer;
