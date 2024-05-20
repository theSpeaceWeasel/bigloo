import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tagTypes } from "./tags";

export const cardApi = createApi({
    reducerPath: 'cardApi',
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

        getCardsFromBoard: builder.query({
            query: (boardId) => `/api/cards/${boardId}`,
            // refetchOnMountOrArgChange: true,
            providesTags: (result, error, boardId) => [{ type: 'Cards', id: boardId }],
        }),

        createCard: builder.mutation({
            query: (card) => ({
                url: `/api/cards`,
                // includeCredentials: true,
                credentials: "include",
                method: 'POST',
                body: { ...card },
                headers: {
                    "Content-Type": `application/json`,
                    "Accept": "application/json",
                    // "X-XSRF-TOKEN": token,
                    "X-Requested-With": "XMLHttpRequest"

                }
            }),
            invalidatesTags: (result, error, { board_id }) => [{ type: 'Cards', id: board_id }],
        }),

        updateCardTitle: builder.mutation({
            query: ({ title, cardId }) => ({
                url: `/api/cards/title/${cardId}`,
                method: 'PUT',
                body: { title },
                headers: {
                    "Content-Type": `application/json`,
                    "Accept": "application/json"
                },
            }),
            invalidatesTags: ['boards'],
        }),

        updateCardDescription: builder.mutation({
            query: ({ description, cardId }) => ({
                url: `/api/cards/description/${cardId}`,
                method: 'PUT',
                body: { description },
                headers: {
                    "Content-Type": `application/json`,
                    "Accept": "application/json"
                },
            }),
            invalidatesTags: ['boards'],
        }),

        addLabelToCard: builder.mutation({
            query: ({ label, cardId }) => ({
                url: `/api/cards/${cardId}/labels`,
                method: 'POST',
                body: { ...label },
            }),
            invalidatesTags: ['boards'],
        }),

        addTaskToCard: builder.mutation({
            query: ({ task, cardId }) => ({
                url: `/api/cards/${cardId}/tasks`,
                method: 'POST',
                body: { ...task },
            }),
            invalidatesTags: ['boards'],
        }),

        updateCardTask: builder.mutation({
            query: ({ id, completed }) => ({
                url: `/api/tasks/${id}`,
                method: 'PUT',
                body: { completed },
            }),
            invalidatesTags: ['tasksDone'],
        }),

        updateDueDateForCard: builder.mutation({
            query: ({ date, cardId }) => ({
                url: `/api/cards/${cardId}/duedate`,
                method: 'POST',
                body: { date },
            }),
            invalidatesTags: ['boards'],
        }),


        deleteCard: builder.mutation({
            query: ({ cardId }) => ({
                url: `/api/cards/${cardId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
        }),

        deleteLabelFromCard: builder.mutation({
            query: (labelId) => ({
                url: `/api/labels/${labelId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['boards'],
        }),

        deleteTaskFromCard: builder.mutation({
            query: (taskId) => ({
                url: `/api/tasks/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['boards'],
        }),

    }),

});

export const {
    // useGetCardsQuery,
    useCreateCardMutation,
    useUpdateCardTitleMutation,
    useUpdateCardDescriptionMutation,
    useDeleteCardMutation,
    useAddLabelToCardMutation,
    useUpdateCardTaskMutation,
    useUpdateDueDateForCardMutation,
    useDeleteLabelFromCardMutation,
    useDeleteTaskFromCardMutation,
    useAddTaskToCardMutation,
    useGetCardsFromBoardQuery,
} = cardApi;