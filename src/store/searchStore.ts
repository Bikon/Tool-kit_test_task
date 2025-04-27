import { createStore, createEvent } from 'effector';

// События
export const setSearchQuery = createEvent<string>();
export const setPage = createEvent<number>();

// Стора поиска
export const $searchQuery = createStore('')
    .on(setSearchQuery, (_, query) => query);

// Стора текущей страницы
export const $page = createStore(1)
    .on(setPage, (_, page) => page);
