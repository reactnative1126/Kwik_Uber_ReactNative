import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { AuthStack, RootNavigator } from './MainNavigator';
import { AuthStart } from '@screens';

const  AppNavigator =  createSwitchNavigator({
    Start: AuthStart,
    Auth: AuthStack,
    Root: RootNavigator,
},
    {
        initialRouteName: 'Start'
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
