import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import {
    EmptyNotificationPage,
    DriverTripCompleteSreen, 
    ProfileScreen, 
    TaskListIgnorePopup,
    RideListPage, 
    NotificationPage,
    LoginScreen,
    DriverStartTrip,
    DriverCompleteTrip,
    RideDetails,
    DriverTripAccept,
    DriverRegistrationPage,
    EditProfilePage,
    AboutPage,
    OnlineChat,
    DriverIncomePage
} from '../screens';
import SideMenu from '../components/SideMenu';
import  { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');

//app stack for user end
    export const AppStack = {
        DriverFare: {
            screen: DriverTripCompleteSreen,
            navigationOptions:{
                header: null
            }
        },
        TaskListIgnorePopUp: {
            screen: TaskListIgnorePopup            
        },
        RideList:{
            screen: RideListPage,
            navigationOptions:{
            header:null,
            }
            
        },
        Notifications:{
            screen:NotificationPage,
            navigationOptions:{
                header:null,
                }
        },
        EmptyNotification:{
            screen:EmptyNotificationPage,
            navigationOptions:{
                header:null,
            }
        },
       
        Profile: {
            screen: ProfileScreen,
            navigationOptions:{
                header: null
            }
        },
        MyEarning: {
            screen: DriverIncomePage,
            navigationOptions:{
                header: null
            }
        },
        DriverTripAccept: {
            screen: DriverTripAccept,
            navigationOptions:{
                header: null
            }
        },
        RideDetails: {
            screen: RideDetails,
            navigationOptions: {
                header: null
            }
        },
        DriverTripStart: {
            screen:  DriverStartTrip,
            navigationOptions:{
                header: null
            }
        },
        Chat:{
            screen:OnlineChat,
            // navigationOptions:{
            //     header: null
            // }
        },
        DriverTripComplete: {
            screen:  DriverCompleteTrip,
            navigationOptions:{
                header: null
            }
        },
        editUser:{
            screen: EditProfilePage,
            navigationOptions:{
                header: null
            } 
        },
        About: {
            screen: AboutPage,
            navigationOptions:{
                header: null
            }
        },
    }

    //authentication stack for user before login
    export const AuthStack = createStackNavigator({
        Login: {
            screen: LoginScreen,
            navigationOptions:{
                header:null,
            }
        },
        DriverReg: {
            screen:  DriverRegistrationPage,
            navigationOptions:{
                header:null,
            }
        },     
    },{
        initialRouteName: 'Login',
    });

    const DrawerRoutes = {
        'RideList': {
            name: 'RideList',
            screen: createStackNavigator(AppStack, { initialRouteName: 'RideList',headerMode: 'none' })
        },
        'Profile': {
            name: 'Profile',
            screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
        },
        
        'Notifications': {
            name: 'Notifications',
            screen: createStackNavigator(AppStack, { initialRouteName: 'Notifications', headerMode: 'none' })
        },
        'DriverTripAccept': {
            name: 'DriverTripAccept',
            screen: createStackNavigator(AppStack, { initialRouteName: 'DriverTripAccept',headerMode: 'none' })
        },
        'About': {
            name: 'About',
            screen: createStackNavigator(AppStack, { initialRouteName: 'About',headerMode: 'none' })
        },
        'MyEarning': {
            name: 'MyEarning',
            screen: createStackNavigator(AppStack, { initialRouteName: 'MyEarning', headerMode: 'none' })
        },
    };


    export const DriverRootNavigator = createDrawerNavigator(
        DrawerRoutes,
        {
        drawerWidth: width/1.9,
        initialRouteName:'DriverTripAccept',
        contentComponent: SideMenu,
    });

