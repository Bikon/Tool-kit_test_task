import { createEvent, createStore } from 'effector';

export const setSearchQuery = createEvent<string>();
export const setPage = createEvent<number>();
export const setPerPage = createEvent<number>();
export const resetPagination = createEvent();

export const $searchQuery = createStore('')
    .on(setSearchQuery, (_, query) => query);

export const $page = createStore(1)
    .on(setPage, (_, page) => page)
    .reset(resetPagination);
