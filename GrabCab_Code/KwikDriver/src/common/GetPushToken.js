import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase'
import {Platform} from 'react-native';
import  languageJSON  from '../common/language';
export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }
  if (Platform.OS === 'android'){
    Notifications.createChannelAndroidAsync('messages', {
      name: languageJSON.android_channel,
      sound: true,
      vibrate: true
    });
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  if(token){
    console.log(token);
    firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/').update({
      pushToken:token,
      userPlatform:Platform.OS == 'ios'?'IOS':'ANDROID'
    })
  }

  // POST the token to your backend server from where you can retrieve it to send push notifications.

}