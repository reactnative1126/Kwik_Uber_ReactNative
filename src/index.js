import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppContainer from '@navigations';
// navigator.geolocation = require('@react-native-community/geolocation');
import Geocoder from 'react-native-geocoding';
import configs from '@constants/configs';
Geocoder.init(configs.google_map_key);
import * as firebase from 'firebase';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAUp82z2O05zrXAnH8IZ_Nc_NRFg-kPIe4",
    authDomain: "kwik-35758.firebaseapp.com",
    databaseURL: "https://kwik-35758.firebaseio.com",
    projectId: "kwik-35758",
    storageBucket: "kwik-35758.appspot.com",
    messagingSenderId: "823801675801",
    appId: "1:823801675801:web:957693dfffe871d0a7aa88",
    measurementId: "G-DR0CT23XH9"
  })
}
export default class App extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Provider store={store} >
                    <PersistGate loading={null} persistor={persistor}>
                        <AppContainer />
                    </PersistGate>
                </Provider>
            </View>
        );
    }
}