import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
    Login, Signup, Forgot,
    Map, Search, Confirm, Accepts, Message,
    Booking,
    Profile, Password,
    Contact,
    About, Rating
} from '@screens';
import { SideMenu } from '@components';

export const AuthStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },
    Signup: {
        screen: Signup,
        navigationOptions: {
            header: null,
        }
    },
    Forgot: {
        screen: Forgot,
        navigationOptions: {
            header: null,
        }
    }
}, {
    initialRouteName: 'Login',
});


export const AppStack = {
    Map: {
        screen: Map,
        navigationOptions: {
            headerShown: false
        }
    },
    Search: {
        screen: Search,
        navigationOptions: {
            headerShown: false
        }
    },
    Confirm: {
        screen: Confirm,
        navigationOptions: {
            headerShown: false
        }
    },
    Accepts: {
        screen: Accepts,
        navigationOptions: {
            headerShown: false
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            headerShown: false
        }
    },

    Profile: {
        screen: Profile,
        navigationOptions: {
            headerShown: false
        }
    },
    Password: {
        screen: Password,
        navigationOptions: {
            headerShown: false
        }
    },

    Booking: {
        screen: Booking,
        navigationOptions: {
            headerShown: false
        }
    },
    Contact: {
        screen: Contact,
        navigationOptions: {
            headerShown: false
        }
    },
    About: {
        screen: About,
        navigationOptions: {
            headerShown: false
        }
    },
    Rating: {
        screen: Rating,
        navigationOptions: {
            headerShown: false
        }
    },
}

const DrawerRoutes = {
    'Map': {
        name: 'Map',
        screen: createStackNavigator(AppStack, {
            initialRouteName: 'Map',
            navigationOptions: {
                headerShown: false
            }
        })
    },
    'Profile': {
        name: 'Profile',
        screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
    },
    'Booking': {
        name: 'Booking',
        screen: createStackNavigator(AppStack, { initialRouteName: 'Booking', headerMode: 'none' })
    },
    'Contact': {
        name: 'Contact',
        screen: createStackNavigator(AppStack, { initialRouteName: 'Contact', headerMode: 'none' })
    },
    'About': {
        name: 'About',
        screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
    },
}
export const RootNavigator = createDrawerNavigator(
    DrawerRoutes,
    {
        drawerWidth: 300,
        initialRouteName: 'Map',
        contentComponent: SideMenu,
    }
);


// //app stack for user end
// export const AppStack = {
//     confirm: {
//         screen: ConfirmScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     detail: {
//         screen: DetailScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Booking: {
//         screen: BookingScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Aboutus: {
//         screen: AboutusScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Contactus: {
//         screen: ContactusScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     MyProfile: {
//         screen: MyProfileScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Password: {
//         screen: PasswordScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Rating: {
//         screen: RatingScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Message: {
//         screen: MessageScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },

//     ratingPage: {
//         screen: DriverTripCompleteSreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     RideList: {
//         screen: RideListPage,
//         navigationOptions: {
//             header: null,
//         }

//     },

//     Profile: {
//         screen: ProfileScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     CardDetails: {
//         screen: CardDetailsScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     Map: {
//         screen: MapScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     // onlineChat: {
//     //     screen: OnlineChat,
//     //     navigationOptions: {
//     //         headerShown: false
//     //     }
//     // },
//     BookedCab: {
//         screen: BookedCabScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },

//     FareDetails: {
//         screen: FareScreen,
//         navigationOptions: {
//             header: null,
//         }
//     },
//     RideDetails: {
//         screen: RideDetails,
//         navigationOptions: {
//             headerShown: false
//         }
//     },

//     Search: {
//         screen: SearchScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },
//     editUser: {
//         screen: EditProfilePage,
//         navigationOptions: {
//             headerShown: false
//         }

//     },
//     trackRide: {
//         screen: TrackNow,
//         navigationOptions: {
//             headerShown: false
//         }

//     },
//     wallet: {
//         screen: WalletDetails,
//         navigationOptions: {
//             headerShown: false
//         }

//     },
//     addMoney: {
//         screen: AddMoneyScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     },

//     paymentMethod: {
//         screen: SelectGatewayPage,
//         navigationOptions: {
//             headerShown: false
//         }
//     }
// }

//authentication stack for user before login

// //drawer routes, you can add routes here for drawer or sidemenu
// const DrawerRoutes = {
//     'Map': {
//         name: 'Map',
//         screen: createStackNavigator(AppStack, {
//             initialRouteName: 'Map',
//             navigationOptions: {
//                 headerShown: false
//             }
//         })
//     },
//     'MyProfile': {
//         name: 'MyProfile',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'MyProfile', headerMode: 'none' })
//     },
//     'Booking': {
//         name: 'Booking',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'Booking', headerMode: 'none' })
//     },
//     'Contactus': {
//         name: 'Contactus',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'Contactus', headerMode: 'none' })
//     },
//     'Aboutus': {
//         name: 'Aboutus',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'Aboutus', headerMode: 'none' })
//     },
//     'RideList': {
//         name: 'RideList',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'RideList', headerMode: 'none' })
//     },
//     'Profile': {
//         name: 'Profile',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
//     },
//     'About': {
//         name: 'About',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
//     },
//     'CardDetails': {
//         name: 'CardDetails',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'CardDetails', headerMode: 'none' })
//     },
//     'wallet': {
//         name: 'wallet',
//         screen: createStackNavigator(AppStack, { initialRouteName: 'wallet', headerMode: 'none' })
//     },
// };




