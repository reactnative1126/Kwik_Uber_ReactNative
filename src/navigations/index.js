import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash } from '@screens';
import AuthStack from './StackNavigator/AuthStackNavigator';
import DrawerNavigator from './DrawerNavigator';
import { navOptionHandler } from '@constants/functions';

const StackApp = createStackNavigator();
export default class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    render() {
        return (
            <NavigationContainer>
                <StackApp.Navigator initialRouteName={"Splash"}>
                    <StackApp.Screen name="Splash" component={Splash} options={navOptionHandler} />
                    <StackApp.Screen name="Auth" component={AuthStack} options={navOptionHandler} />
                    <StackApp.Screen name="App" component={DrawerNavigator} options={navOptionHandler} />
                </StackApp.Navigator>
            </NavigationContainer>
        );
    }
}