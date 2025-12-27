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
            keepUnusedDataFor: 86400,  // Cache data for 5 minutes (300 seconds) by default
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
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ title, cardId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        const card = draft?.data?.find(c => c.id === cardId)
                        if (card) {
                            card.title = title
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
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ description, cardId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        const card = draft?.data?.find(c => c.id === cardId)
                        if (card) {
                            card.description = description
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

        addLabelToCard: builder.mutation({
            query: ({ label, cardId }) => ({
                url: `/api/cards/${cardId}/labels`,
                method: 'POST',
                body: { ...label },
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ label, cardId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const tempId = Date.now();
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        const card = draft?.data?.find(c => c.id === cardId)
                        if (card) {
                            if (!card.labels) card.labels = [];
                            card.labels.push({ ...label, id: tempId });
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

        addTaskToCard: builder.mutation({
            query: ({ task, cardId }) => ({
                url: `/api/cards/${cardId}/tasks`,
                method: 'POST',
                body: { ...task },
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ task, cardId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const tempId = Date.now();
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        const card = draft?.data?.find(c => c.id === cardId)
                        if (card) {
                            if (!card.tasks) card.tasks = [];
                            card.tasks.push({ ...task, id: tempId });
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

        updateCardTask: builder.mutation({
            query: ({ taskId, completed }) => ({
                url: `/api/tasks/${taskId}`,
                method: 'PUT',
                body: { completed },
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ taskId, completed, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        if (!draft?.data) return;
                        for (const card of draft.data) {
                            const task = card.tasks?.find(t => t.id === taskId)
                            if (task) {
                                task.completed = completed
                                break
                            }
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

        updateDueDateForCard: builder.mutation({
            query: ({ date, cardId }) => ({
                url: `/api/cards/${cardId}/duedate`,
                method: 'POST',
                body: { date },
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
        }),


        deleteCard: builder.mutation({
            query: ({ cardId }) => ({
                url: `/api/cards/${cardId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
        }),

        deleteLabelFromCard: builder.mutation({
            query: ({ labelId }) => ({
                url: `/api/labels/${labelId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ labelId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        if (!draft?.data) return;
                        for (const card of draft.data) {
                            const index = card.labels?.findIndex(l => l.id === labelId)
                            if (index !== undefined && index !== -1) {
                                card.labels.splice(index, 1)
                                break
                            }
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

        deleteTaskFromCard: builder.mutation({
            query: ({ taskId }) => ({
                url: `/api/tasks/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { boardId }) => [{ type: 'Cards', id: boardId }],
            async onQueryStarted({ taskId, boardId }, { dispatch, queryFulfilled }) {
                if (!boardId) return;
                const patchResult = dispatch(
                    cardApi.util.updateQueryData('getCardsFromBoard', boardId, (draft) => {
                        if (!draft?.data) return;
                        for (const card of draft.data) {
                            const index = card.tasks?.findIndex(t => t.id === taskId)
                            if (index !== undefined && index !== -1) {
                                card.tasks.splice(index, 1)
                                break
                            }
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