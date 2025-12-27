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
            keepUnusedDataFor: 86400,  // Cache data for 5 minutes (300 seconds) by default
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
                url: `/api/boards/${board.ticket_id}`,
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
            async onQueryStarted({ board }, { dispatch, queryFulfilled }) {
                const tempId = Date.now();
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getBoards', board.ticket_id, (draft) => {
                        if (!draft?.data) return;
                        draft.data.push({ ...board, id: tempId });
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),


        deleteBoard: builder.mutation({
            query: ({ boardId }) => ({
                url: `/api/boards/${boardId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { ticketId }) => [{ type: 'Cards', id: ticketId }],
            async onQueryStarted({ boardId, ticketId }, { dispatch, queryFulfilled }) {
                if (!ticketId) return;
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getBoards', ticketId, (draft) => {
                        if (!draft?.data) return;
                        const index = draft.data.findIndex(b => b.id === boardId);
                        if (index !== -1) {
                            draft.data.splice(index, 1);
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

    }),

});

export const { useGetBoardsQuery, useCreateBoardMutation, useUpdateBoardMutation, useDeleteBoardMutation } = boardApi;