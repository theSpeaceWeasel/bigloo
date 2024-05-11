import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { ticketApi } from '../services/ticket';
import { boardApi } from '../services/board';
import { cardApi } from '../services/card';

export const store = configureStore({
  reducer: {
    [ticketApi.reducerPath]: ticketApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    [cardApi.reducerPath]: cardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ticketApi.middleware, boardApi.middleware, cardApi.middleware),

});

setupListeners(store.dispatch);