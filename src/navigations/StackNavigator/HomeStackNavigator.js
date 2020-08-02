import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Map, Track, Rating, Confirm, Accepts, Message } from '@screens';
import { navOptionHandler } from '@constants/functions';

const StactHome = createStackNavigator();
export default function HomeStack() {
  return (
    <StactHome.Navigator initialRouteName="Map">
      <StactHome.Screen name="Map" component={Map} options={navOptionHandler} />
      <StactHome.Screen name="Track" component={Track} options={navOptionHandler} />
      <StactHome.Screen name="Rating" component={Rating} options={navOptionHandler} />
      <StactHome.Screen name="Confirm" component={Confirm} options={navOptionHandler} />
      <StactHome.Screen name="Accepts" component={Accepts} options={navOptionHandler} />
      <StactHome.Screen name="Message" component={Message} options={navOptionHandler} />
    </StactHome.Navigator>
  )
}