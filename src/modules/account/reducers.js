import types from './types';

const initialState = {
    logged: false,
    userinfo: {
        user_id: 9,
        api_token: "Eh1qJuJWSztfdPDEMjd7LE503bYJWQxZmr5dWjBtgk9s4mOKb0FzWTC3kkQT",
        fcm_id: null,
        device_token: null,
        socialmedia_uid: null,
        user_name: "Dan Jin",
        user_type: "C",
        mobno: "1112224444",
        phone_code: "+93",
        email: "danjplay@outlook.com",
        gender: 1,
        password: "$2y$10$GvEfxhltWPD08WKcG9VUn.PMPIPHrGWd8pvItVa8QxDbrejpEwbGe",
        profile_pic: null,
        status: 1,
        timestamp: "2020-06-07 16:39:03"
    }
}

export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_USER:
            return {
                ...state,
                logged: true,
                userinfo: action.payload
            };
        case types.SIGN_OUT:
            return {
                ...state,
                logged: false,
                userinfo: initialState
            }
        default:
            return state;
    }
}