import { userRef, singleUserRef } from "../config/firebase";
import { 
    FETCH_ALL_USERS,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_USERS_FAILED,
    EDIT_USER,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILED,
    DELETE_USER,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILED,
} from "./types";

export const fetchUsers = () => dispatch => {
    dispatch({
      type: FETCH_ALL_USERS,
      payload: null
    });
    userRef.on("value", snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i
          return data[i]
        });
        dispatch({
          type: FETCH_ALL_USERS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_ALL_USERS_FAILED,
          payload: "No users available."
        });
      }
    });
  };

  export const editUser = (id,user) => dispatch =>{
    dispatch({
      type: EDIT_USER,
      payload: user
    });
    let editedUser = user;
    if(user.refferalBonus) editedUser.refferalBonus = parseFloat(editedUser.refferalBonus);
    delete editedUser.id;
    singleUserRef(id).set(editedUser).then(()=>{
      dispatch({
        type: EDIT_USER_SUCCESS,
        payload: null
      });  
    }).catch((error)=>{
      dispatch({
        type: EDIT_USER_FAILED,
        payload: error
      });        
    });
  }

  export const deleteUser = (id) => dispatch =>{
    dispatch({
      type: DELETE_USER,
      payload: id
    });

    singleUserRef(id).remove().then(()=>{
      dispatch({
        type: DELETE_USER_SUCCESS,
        payload: null
      });  
    }).catch((error)=>{
      dispatch({
        type: DELETE_USER_FAILED,
        payload: error
      });        
    });

  }