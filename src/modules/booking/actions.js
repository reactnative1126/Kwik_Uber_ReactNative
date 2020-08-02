import types from './types';

export const setBooking = (data) => ({
    type: types.SET_BOOKING,
    payload: data
});

export const setNotification = (data) => ({
    type: types.SET_NOTIFICATION,
    payload: data
});
