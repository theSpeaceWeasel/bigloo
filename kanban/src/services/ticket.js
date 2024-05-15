import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tagTypes } from "./tags";


export const ticketApi = createApi({
  reducerPath: 'ticketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-type", "application/json")
      headers.set("Accept", "application/json")
      const token = decodeURIComponent(document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]);
      headers.set('X-XSRF-TOKEN', token);
      headers.set('X-Requested-With', "XMLHttpRequest");
      return headers;
    },
  }),
  tagTypes,

  endpoints: (builder) => ({

    getTickets: builder.query({
      query: ({ userId, search, sorting }) => `api/tickets/${userId}?search=${encodeURIComponent(search)}&sorting=${sorting}`,
      providesTags: ['tickets'],
    }),

    getTicketTasksCompleted: builder.query({
      query: (ticketId) => `api/ticket/${ticketId}/tasks-completed`,
      providesTags: ['tasksDone'],
    }),

    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/api/tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['tickets'],
    }),

  }),

});

export const { useGetTicketsQuery,
  useGetTicketTasksCompletedQuery,
  useDeleteTicketMutation,
} = ticketApi;