import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tagTypes } from "./tags";

export const boardApi = createApi({
    reducerPath: 'boardApi',
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
    defaultOptions: {
        queries: {
            keepUnusedDataFor: 3000,  // Cache data for 5 minutes (300 seconds) by default
        },
    },
    tagTypes,

    endpoints: (builder) => ({

        getBoards: builder.query({
            query: (ticketId) => `/api/boards/${ticketId}`,
            // refetchOnMountOrArgChange: true,
            providesTags: (result, error, ticketId) => [{ type: 'Cards', id: ticketId }],
        }),

        createBoard: builder.mutation({
            query: ({ board, token }) => ({
                url: `/api/boards`,
                // includeCredentials: true,
                credentials: "include",
                method: 'POST',
                body: { ...board },
                headers: {
                    "Content-Type": `application/json`,
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": token,
                    "X-Requested-With": "XMLHttpRequest"

                }
            }),
            invalidatesTags: (result, error, { board }) => [{ type: 'Cards', id: board.ticket_id }],
        }),

        // updateBoard: builder.mutation({
        //     query: ({ id, title }) => ({
        //         url: `boards/${id}`,
        //         method: 'PUT',
        //         body: { title },
        //         headers: {
        //             "Content-Type": `application/json`,
        //             "Accept": "application/json"
        //         },
        //     }),
        //     invalidatesTags: ['boards'],
        // }),

        deleteBoard: builder.mutation({
            query: ({ boardId }) => ({
                url: `/api/boards/${boardId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { ticketId }) => [{ type: 'Cards', id: ticketId }],
        }),

    }),

});

export const { useGetBoardsQuery, useCreateBoardMutation, useUpdateBoardMutation, useDeleteBoardMutation } = boardApi;