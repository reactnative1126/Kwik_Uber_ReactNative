import { 
    FETCH_REFERRAL_BONUS,
    FETCH_REFERRAL_BONUS_SUCCESS,
    FETCH_REFERRAL_BONUS_FAILED,
    EDIT_REFERRAL_BONUS,
    CLEAR_REFERRAL_ERROR
  } from "../actions/types";
  
  export const INITIAL_STATE = {
    bonus:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_REFERRAL_BONUS:
        return {
          ...state,
          loading:true
        };
      case FETCH_REFERRAL_BONUS_SUCCESS:
        return {
          ...state,
          bonus:action.payload,
          loading:false
        };
      case FETCH_REFERRAL_BONUS_FAILED:
        return {
          ...state,
          bonus:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case EDIT_REFERRAL_BONUS:
        return state;
      case CLEAR_REFERRAL_ERROR:
        return {
            ...state,
            error:{
                flag:false,
                msg:null
            }            
        };
      default:
        return state;
    }
  };