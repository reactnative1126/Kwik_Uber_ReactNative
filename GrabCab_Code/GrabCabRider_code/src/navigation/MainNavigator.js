import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator} from 'react-navigation-drawer';
import { 
    DriverTripCompleteSreen, 
    ProfileScreen,
    CardDetailsScreen, 
    RideListPage, 
    MapScreen, 
    BookedCabScreen,
    RegistrationPage,
    LoginScreen,
    FareScreen,
    RideDetails,
    SearchScreen,
    EditProfilePage ,
    TrackNow,
    AboutPage,
    OnlineChat,
    WalletDetails,
    AddMoneyScreen,
    SelectGatewayPage
} from '../screens';
import SideMenu from '../components/SideMenu';

//app stack for user end
    export const AppStack = {
        ratingPage: {
            screen: DriverTripCompleteSreen,
            navigationOptions:{
                headerShown: false
            }
        },
        RideList:{
            screen: RideListPage,
            navigationOptions:{
            header:null,
            }
            
        },
        
        Profile: {
            screen: ProfileScreen,
            navigationOptions:{
                headerShown: false
            }
        },
        CardDetails: {
            screen: CardDetailsScreen,
            navigationOptions:{
                headerShown: false
            }
        },
        About: {
            screen: AboutPage,
            navigationOptions:{
                headerShown: false
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions:{
                headerShown: false
            }
        },
        onlineChat:{
            screen:OnlineChat,
            navigationOptions:{
                headerShown: false
            }
        },
        BookedCab: {
            screen: BookedCabScreen,
            navigationOptions:{
                headerShown: false
            }
        },
                
        FareDetails: {
            screen: FareScreen,
            navigationOptions:{
                header:null,
            }
        },
        RideDetails: {
            screen: RideDetails,
            navigationOptions: {
                headerShown: false
            }
        },
        
        Search: {
            screen:  SearchScreen,
            navigationOptions:{
                headerShown: false
            } 
        },
        editUser:{
            screen: EditProfilePage,
            navigationOptions:{
                headerShown: false
            } 

        },
        trackRide:{
            screen: TrackNow,
            navigationOptions:{
                headerShown: false
            } 

        },
        wallet:{
            screen: WalletDetails,
            navigationOptions:{
                headerShown: false
            } 

        },
        addMoney:{
            screen:AddMoneyScreen,
            navigationOptions:{
                headerShown: false
            }
        },
       
        paymentMethod:{
            screen:SelectGatewayPage,
            navigationOptions:{
                headerShown: false
            }
        }
        
        
        
    }

    //authentication stack for user before login
    export const AuthStack = createStackNavigator({
       
        Reg: {
            screen: RegistrationPage,
            navigationOptions:{
            header:null,
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions:{
                header:null,
            }
        }
           
    },{
        initialRouteName: 'Login',
    });

    //drawer routes, you can add routes here for drawer or sidemenu
    const DrawerRoutes = {
        
        'Map': {
            name: 'Map',
            screen: createStackNavigator(AppStack, {
                initialRouteName: 'Map', 
                navigationOptions:{
                    headerShown: false
                } 
            })
        },
        'RideList': {
            name: 'RideList',
            screen: createStackNavigator(AppStack, { initialRouteName: 'RideList',headerMode: 'none' })
        },
        'Profile': {
            name: 'Profile',
            screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
        },
        'About': {
            name: 'About',
            screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
        },
        'CardDetails': {
            name: 'CardDetails',
            screen: createStackNavigator(AppStack, { initialRouteName: 'CardDetails', headerMode: 'none' })
        },
        'wallet': {
            name: 'wallet',
            screen: createStackNavigator(AppStack, { initialRouteName: 'wallet', headerMode: 'none' })
        },
    };

    //main navigator for user end
    export const RootNavigator = createDrawerNavigator(
        DrawerRoutes,
        {
        drawerWidth: 180,
        initialRouteName:'Map',
        contentComponent: SideMenu,
      });



