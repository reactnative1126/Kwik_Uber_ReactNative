import { Platform } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase';
import language from '@constants/language';

export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }
  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('messages', {
      name: language.android_channel,
      sound: true,
      vibrate: true
    });
  }

  let token = await Notifications.getExpoPushTokenAsync();
  if (token) {
    console.log(token);
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/').update({
      pushToken: token,
      userPlatform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
    })
  }
}