import { 
  FETCH_CAR_TYPES,
  FETCH_CAR_TYPES_SUCCESS,
  FETCH_CAR_TYPES_FAILED,
  EDIT_CAR_TYPE
} from "../actions/types";

export const INITIAL_STATE = {
  cars:null,
  loading: false,
  error:{
    flag:false,
    msg: null
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CAR_TYPES:
      return {
        ...state,
        loading:true
      };
    case FETCH_CAR_TYPES_SUCCESS:
      return {
        ...state,
        cars:action.payload,
        loading:false
      };
    case FETCH_CAR_TYPES_FAILED:
      return {
        ...state,
        cars:null,
        loading:false,
        error:{
          flag:true,
          msg:action.payload
        }
      };
    case EDIT_CAR_TYPE:
      return state;
    default:
      return state;
  }
};