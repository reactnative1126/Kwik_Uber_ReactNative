import types from './types';

const initialState = {
    logged: false,
    device_token: null,
    user_info: null,
    driver_info: null
}

export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_USER:
            return {
                ...state,
                logged: true,
                user_info: action.payload
            };
        case types.SIGN_OUT:
            return {
                ...state,
                logged: false,
                user_info: initialState
            };
        case types.SET_DEVICE_TOKEN:
            return {
                ...state,
                device_token: action.payload
            };
        case types.SET_DRIVER:
            return {
                ...state,
                driver_info: action.payload
            };
        default:
            return state;
    }
}