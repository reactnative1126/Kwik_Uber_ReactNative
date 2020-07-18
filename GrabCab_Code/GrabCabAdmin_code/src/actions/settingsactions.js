import { settingsRef } from "../config/firebase";
import { 
    FETCH_SETTINGS,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_FAILED,
    EDIT_SETTINGS,
    CLEAR_SETTINGS_ERROR
} from "./types";

export const fetchSettings = () => dispatch => {
    dispatch({
      type: FETCH_SETTINGS,
      payload: null
    });
    settingsRef.on("value", snapshot => {
      if (snapshot.val()) {
        dispatch({
          type: FETCH_SETTINGS_SUCCESS,
          payload: snapshot.val()
        });
      } else {
        dispatch({
          type: FETCH_SETTINGS_FAILED,
          payload: "No settings available."
        });
      }
    });
  };

  export const editSettings = (settings) => dispatch =>{
    dispatch({
      type: EDIT_SETTINGS,
      payload: settings
    });
    settingsRef.set(settings);
  }

  export const clearSettingsViewError = () => dispatch => {
    dispatch({
      type: CLEAR_SETTINGS_ERROR,
      payload: null
    });  
  };