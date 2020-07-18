import { authRef,singleUserRef, FIREBASE_AUTH_PERSIST} from "../config/firebase";
import { 
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILED,
  USER_SIGN_IN,
  USER_SIGN_IN_FAILED,
  USER_SIGN_OUT,
  CLEAR_LOGIN_ERROR
} from "./types";

export const fetchUser = () => dispatch => {
  dispatch({
    type: FETCH_USER,
    payload: null
  });
  authRef.onAuthStateChanged(user => {
    if (user) {
        singleUserRef(user.uid).once("value", snapshot => {
          if(snapshot.val() && snapshot.val().isAdmin){
            dispatch({
              type: FETCH_USER_SUCCESS,
              payload: user
            });
          }else{
            authRef
            .signOut()
            .then(() => {
              dispatch({
                type: USER_SIGN_IN_FAILED,
                payload: "This login is a valid user but not Admin"
              });     
            })
            .catch(error => {
              dispatch({
                type: USER_SIGN_IN_FAILED,
                payload: error
              });
            });
          }
        });
    }else{
      dispatch({
        type: FETCH_USER_FAILED,
        payload: null
      });
    }
  });
};

export const signIn = (username,password) => dispatch => {
  authRef.setPersistence(FIREBASE_AUTH_PERSIST)
  .then(function() {
    authRef
    .signInWithEmailAndPassword(username,password)
    .then(user=>{
      dispatch({
        type: USER_SIGN_IN,
        payload: null
      });      
    })
    .catch(error => {
      dispatch({
        type: USER_SIGN_IN_FAILED,
        payload: error
      });
    });
  })
  .catch(function(error) {
    dispatch({
      type: USER_SIGN_IN_FAILED,
      payload: "Firebase Auth Error"
    });
  });
};

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      dispatch({
        type: USER_SIGN_OUT,
        payload: null
      });       
    })
    .catch(error => {
      //console.log(error);
    });
};

export const clearLoginError = () => dispatch => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });  
};