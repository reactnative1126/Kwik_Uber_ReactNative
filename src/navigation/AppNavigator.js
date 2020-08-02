import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { AuthStack, RootNavigator } from './MainNavigator';
import { AuthStart } from '@screens/Auth';

const AppNavigator = createSwitchNavigator({
    AuthStart: AuthStart,
    Auth: AuthStack,
    Root: RootNavigator,
},
    {
        initialRouteName: 'AuthStart'
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
