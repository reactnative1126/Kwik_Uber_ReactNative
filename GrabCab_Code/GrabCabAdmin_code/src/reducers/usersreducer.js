import { 
    FETCH_ALL_USERS,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_FAILED,
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    users:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_ALL_USERS:
        return {
          ...state,
          loading:true
        };
      case FETCH_ALL_USERS_SUCCESS:
        return {
          ...state,
          users:action.payload,
          loading:false
        };
      case FETCH_ALL_USERS_FAILED:
        return {
          ...state,
          users:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      default:
        return state;
    }
  };