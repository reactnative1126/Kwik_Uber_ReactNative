import { 
  FETCH_BOOKING_DISCOUNT,
  FETCH_BOOKING__DISCOUNT_SUCCESS,
  FETCH_BOOKING__DISCOUNT_FAILED,
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    Earningreportss:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_BOOKING_DISCOUNT:
        return {
          ...state,
          loading:true
        };
      case FETCH_BOOKING__DISCOUNT_SUCCESS:
        return {
          ...state,
          Earningreportss:action.payload,
          loading:false
        };
      case FETCH_BOOKING__DISCOUNT_FAILED:
        return {
          ...state,
          Earningreportss:null,
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