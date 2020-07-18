import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './Content.js';

import HomeStack from '../StackNavigator/HomeStackNavigator';
import ProfileStack from '../StackNavigator/ProfileStackNavigator';
import PaymentStack from '../StackNavigator/PaymentStackNavigator';
import { Booking, Contact, About, Logout } from '@screens';

const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName="Home" >
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Profile" component={ProfileStack} />
            <Drawer.Screen name="Booking" component={Booking} />
            <Drawer.Screen name="Payment" component={PaymentStack} />
            <Drawer.Screen name="Contact" component={Contact} />
            <Drawer.Screen name="About" component={About} />
            <Drawer.Screen name="Logout" component={Logout} />
        </Drawer.Navigator>
    )
}
