import { createEvent, createStore } from 'effector';

// События
export const setSearchQuery = createEvent<string>();
export const setPage = createEvent<number>();
export const setPerPage = createEvent<number>();
export const resetPagination = createEvent();

// Стора поиска
export const $searchQuery = createStore('')
    .on(setSearchQuery, (_, query) => query);

// Стора текущей страницы
export const $page = createStore(1)
    .on(setPage, (_, page) => page)
    .reset(resetPagination);

// Стора элементов на странице
export const $perPage = createStore(10)
    .on(setPerPage, (_, perPage) => perPage)
    .reset(resetPagination);
