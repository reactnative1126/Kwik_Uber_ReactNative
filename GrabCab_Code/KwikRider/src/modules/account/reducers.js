import types from './types';

const initialState = {
    logged: false,
    userinfo: {
        api_token: "oWequ4LCyJJKZdjb1GZrAhuWIhXmaiY09BxmoYetd790svWrvIXAOmFmfdTc",
        device_token: null,
        email: "ddd@qq.com",
        fcm_id: null,
        gender: 1,
        mobno: "1239876540",
        password: "$2y$10$SZ1bv0wBnK2AZr4BM0aMeOdwj/dLu91BrtCI/Pu./88I1dYyMpIda",
        phone_code: null,
        profile_pic: null,
        socialmedia_uid: null,
        status: 1,
        timestamp: "2020-06-08 02:46:27",
        user_id: 12,
        user_name: "ddd",
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