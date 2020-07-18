import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Payment, Stripe } from '@screens';
import { navOptionHandler } from '@constants/functions';

const StactPayment = createStackNavigator();
export default function PaymentStack() {
  return (
    <StactPayment.Navigator initialRouteName="Payment">
      <StactPayment.Screen name="Payment" component={Payment} options={navOptionHandler} />
      <StactPayment.Screen name="Stripe" component={Stripe} options={navOptionHandler} />
    </StactPayment.Navigator>
  )
}