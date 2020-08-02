import { 
    FETCH_PROMOS,
    FETCH_PROMOS_SUCCESS,
    FETCH_PROMOS_FAILED,
    EDIT_PROMOS
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    promos:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_PROMOS:
        return {
          ...state,
          loading:true
        };
      case FETCH_PROMOS_SUCCESS:
        return {
          ...state,
          promos:action.payload,
          loading:false
        };
      case FETCH_PROMOS_FAILED:
        return {
          ...state,
          promos:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case EDIT_PROMOS:
        return state;
      default:
        return state;
    }
  };