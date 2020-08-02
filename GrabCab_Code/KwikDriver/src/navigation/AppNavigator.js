import { createSwitchNavigator,createAppContainer } from 'react-navigation';
import { AuthStack,  DriverRootNavigator } from './MainNavigator';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';

const AppNavigator= createSwitchNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
            AuthLoading: AuthLoadingScreen,
            Auth: AuthStack,
            DriverRoot: DriverRootNavigator
        },
        {
            initialRouteName: 'AuthLoading'
        }
    );
    const AppContainer = createAppContainer(AppNavigator);
    export default AppContainer;
  