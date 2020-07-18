import { 
    FETCH_BOOKINGS,
    FETCH_BOOKINGS_SUCCESS,
    FETCH_BOOKINGS_FAILED,
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    bookings:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_BOOKINGS:
        return {
          ...state,
          loading:true
        };
      case FETCH_BOOKINGS_SUCCESS:
        return {
          ...state,
          bookings:action.payload,
          loading:false
        };
      case FETCH_BOOKINGS_FAILED:
        return {
          ...state,
          bookings:null,
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