import types from './types';

export const setSearch = (data) => ({
    type: types.SET_SEARCH,
    payload: data
})
export const setOld = (data) => ({
    type: types.SET_OLD,
    payload: data
})