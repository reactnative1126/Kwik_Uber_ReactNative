import types from './types';

export const setUser = (data) => ({
    type: types.SET_USER,
    payload: data
});
export const signOut = (data) => ({
    type: types.SIGN_OUT,
    payload: data
});
export const setDeviceToken = (data) => ({
    type: types.SET_DEVICE_TOKEN,
    payload: data
});
export const setCustomer = (data) => ({
    type: types.SET_CUSTOMER,
    payload: data
});