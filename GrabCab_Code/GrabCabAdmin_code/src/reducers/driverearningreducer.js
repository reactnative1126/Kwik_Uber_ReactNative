import { 
    FETCH_DRIVERS_EARNING,
    FETCH_DRIVERS__EARNING_SUCCESS,
    FETCH_DRIVERS__EARNING_FAILED,
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    driverearnings:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_DRIVERS_EARNING:
        return {
          ...state,
          loading:true
        };
      case FETCH_DRIVERS__EARNING_SUCCESS:
        return {
          ...state,
          driverearnings:action.payload,
          loading:false
        };
      case FETCH_DRIVERS__EARNING_FAILED:
        return {
          ...state,
          driverearnings:null,
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