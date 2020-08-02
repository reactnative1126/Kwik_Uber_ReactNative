import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { Notifications } from 'expo';
import { Audio } from 'expo-av';

import * as firebase from 'firebase';
import GetPushToken from '@functions/GetPushToken';
import language from '@constants/language';

var firebaseConfig = {
  apiKey: "AIzaSyAUp82z2O05zrXAnH8IZ_Nc_NRFg-kPIe4",
  authDomain: "kwik-35758.firebaseapp.com",
  databaseURL: "https://kwik-35758.firebaseio.com",
  projectId: "kwik-35758",
  storageBucket: "kwik-35758.appspot.com",
  messagingSenderId: "823801675801",
  appId: "1:823801675801:web:ddbd391ba348d148a7aa88",
  measurementId: "G-KHE3P3DWD6"
};

firebase.initializeApp(firebaseConfig);

export class AuthStart extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  _setSettings = async () => {
    try {
      const settings = firebase.database().ref('settings');
      settings.once('value', settingsData => {
        if (settingsData.val()) {
          AsyncStorage.setItem('settings', JSON.stringify(settingsData.val()));
        }
      });
    } catch (error) {
      console.log("Asyncstorage issue 5");
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userData = firebase.database().ref('users/' + user.uid);
        userData.once('value', userData => {
          if (userData.val()) {
            if (userData.val().usertype == 'rider') {
              GetPushToken();
              this._setSettings();
              this.props.navigation.navigate('Root');
            }
            else {
              firebase.auth().signOut();
              alert(language.valid_rider);
            }
          } else {
            var data = {};
            data.profile = {
              name: user.name ? user.name : '',
              email: user.email ? user.email : '',
              mobile: user.phoneNumber ? user.phoneNumber.replace('"', '') : '',
            };
            this.props.navigation.navigate("Signup", { requireData: data })
          }
        })
      } else {
        this.props.navigation.navigate('Login');
      }
    })
  };


  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = async (notification) => {
    alert(notification.data.msg);

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('@assets/sounds/car_horn.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.log("Unable to play shound");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.IndicatorStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
  IndicatorStyle: {
    flex: 1,
    justifyContent: "center"
  }
})