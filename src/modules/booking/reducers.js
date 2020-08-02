import types from './types';

const initialState = {
    booking_info: null,
    notification: null
}

export default function bookingReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_BOOKING:
            return {
                ...state,
                booking_info: action.payload
            };
        case types.SET_NOTIFICATION:
            return {
                ...state,
                notification: action.payload
            };
        default:
            return state;
    }
}