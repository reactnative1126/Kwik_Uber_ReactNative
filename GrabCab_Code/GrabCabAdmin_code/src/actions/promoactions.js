import { promoRef, promoEditRef} from "../config/firebase";
import { 
    FETCH_PROMOS,
    FETCH_PROMOS_SUCCESS,
    FETCH_PROMOS_FAILED,
    EDIT_PROMOS
} from "./types";

export const fetchPromos = () => dispatch => {
    dispatch({
      type: FETCH_PROMOS,
      payload: null
    });
    promoRef.on("value", snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i
          if(data[i].user_avail){
            data[i].promo_used_by = data[i].user_avail.count;
          }
          return data[i]
        });
        dispatch({
          type: FETCH_PROMOS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_PROMOS_FAILED,
          payload: "No promos available."
        });
      }
    });
  };

  export const editPromo = (promos,method) => dispatch =>{
    dispatch({
      type: EDIT_PROMOS,
      payload: method
    });
    if(method === 'Add' ){
      promoRef.push(promos);
    }else if(method === 'Delete'){
      console.log(promos)
      promoEditRef(promos.id).remove();
    }else{
      console.log(promos)
      promoEditRef(promos.id).set(promos);
    }
  }