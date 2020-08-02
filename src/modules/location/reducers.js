import types from './types';

const initialState = {
    search: null,
    old: null
}

export default function locationReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_SEARCH:
            return {
                ...state,
                search: action.payload
            };
        case types.SET_OLD:
            return {
                ...state,
                old: action.payload
            };
        default:
            return state;
    }
}