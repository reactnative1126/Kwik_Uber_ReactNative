import types from './types';

export const setUser = (data) => ({
    type: types.SET_USER,
    payload: data
})