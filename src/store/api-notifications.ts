import {
  NotificationsResponse,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/client";
import { ticketsApi } from "./api-tickets";
import { toCustomError } from "./api-utils";

export const notificationsApi = ticketsApi.injectEndpoints({
  endpoints: (builder) => ({
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
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;