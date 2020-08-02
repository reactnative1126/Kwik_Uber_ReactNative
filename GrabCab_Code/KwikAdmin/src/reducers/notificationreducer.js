import { 
    FETCH_NOTIFICATIONS,
    FETCH_NOTIFICATIONS_SUCCESS,
    FETCH_NOTIFICATIONS_FAILED,
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    notifications:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_NOTIFICATIONS:
        return {
          ...state,
          loading:true
        };
      case FETCH_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          notifications:action.payload,
          loading:false
        };
      case FETCH_NOTIFICATIONS_FAILED:
        return {
          ...state,
          notifications:null,
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
