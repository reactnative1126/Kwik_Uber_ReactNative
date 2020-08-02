import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { Notifications } from 'expo';
import { Audio } from 'expo-av';

import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';

import * as firebase from 'firebase';

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

class AuthStart extends Component {
  constructor(props) {
    super(props);

  }

  async componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    if (await AsyncStorage.getItem('LOGGED') === 'true') {
      let userinfo = await AsyncStorage.getItem('USER');
      this.props.setUser(userinfo);
      this.props.navigation.navigate('Root');
    } else {
      this.props.navigation.navigate('Auth');
    }
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

const mapDispatchToProps = dispatch => {
  return {
    setUser: (data) => {
      dispatch(setUser(data))
    }
  }
}
export default connect(undefined, mapDispatchToProps)(AuthStart)