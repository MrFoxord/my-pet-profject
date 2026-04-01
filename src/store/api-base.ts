import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

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
  endpoints: () => ({}),
});