import React from 'react';
import AppContainer from './src/navigation/AppNavigator';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyB13NA8kQ3vb-cUJulPK-ijhtlCuO1sKGM",
  authDomain: "taivla.firebaseapp.com",
  databaseURL: "https://taivla.firebaseio.com",
  projectId: "taivla",
  storageBucket: "taivla.appspot.com",
  messagingSenderId: "778113025957",
  appId: "1:778113025957:web:7efb26e779cec17a7c4a4c",
  measurementId: "G-RQM0MH8TYS"
};


firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
  };

  constructor(){
    super();
    console.disableYellowBox = true;
  }

//resource load at the time of app loading
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/splash.png'),
        require('./assets/images/applogo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };
  
  render() {
    return (
        this.state.assetsLoaded ? 
          <AppContainer/>
          :         
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onFinish={() => this.setState({ assetsLoaded: true })}
            onError={console.warn}
            autoHideSplash={true}
          />
    );
  }
}