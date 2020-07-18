import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Login, Signup, Forgot } from '@screens';
import { navOptionHandler } from '@constants/functions';

const StactAuth = createStackNavigator();
export default function SettingsStack() {
  return (
    <StactAuth.Navigator initialRouteName="Login">
      <StactAuth.Screen name="Login" component={Login} options={navOptionHandler} />
      <StactAuth.Screen name="Signup" component={Signup} options={navOptionHandler} />
      <StactAuth.Screen name="Forgot" component={Forgot} options={navOptionHandler} />
    </StactAuth.Navigator>
  )
}