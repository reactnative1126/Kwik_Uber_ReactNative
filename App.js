import React from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppContainer from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './store';

export default class App extends React.Component {
  constructor() {
    super();
    console.disableYellowBox = true;
    this.state = {
      assetsLoaded: false,
    };
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('@assets/images/splash.png'),
        require('@assets/images/applogo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('@assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('@assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('@assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('@assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };

  render() {
    return (
      this.state.assetsLoaded ?
        <Provider store={store}>
          <AppContainer />
        </Provider>
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
