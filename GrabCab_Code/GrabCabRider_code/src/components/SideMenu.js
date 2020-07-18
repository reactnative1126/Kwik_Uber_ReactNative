import React from 'react';
import { Text, View, Dimensions, StyleSheet, FlatList, Image, TouchableOpacity,AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase'; //Database
import SideMenuHeader from './SideMenuHeader';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import languageJSON from '../common/language';

export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heightIphoneSix: false,
            sideMenuList:
                [
                    { key: 1, name: languageJSON.book_your_ride_menu, navigationName: 'Map', icon: 'home', type: 'font-awesome', child: 'firstChild' },
                    { key: 2, name: languageJSON.profile_setting_menu, navigationName: 'Profile', icon: 'ios-person-add', type: 'ionicon', child: 'secondChild' },
                    { key: 3, name: languageJSON.my_wallet_menu, icon: 'account-balance-wallet', navigationName: 'wallet', type: 'MaterialIcons', child: 'thirdChild' },
                    { key: 4, name: languageJSON.my_rides_menu, navigationName: 'RideList', icon: 'car-sports', type: 'material-community', child: 'fourthChild' },
                    { key: 5, name: languageJSON.about_us_menu, navigationName: 'About', icon: 'info', type: 'entypo', child: 'fifthChild' },
                    { key: 6, name: languageJSON.logout, icon: 'sign-out', type: 'font-awesome', child: 'lastChild' }
                ],
            profile_image: null,
            settings: {
                code: '',
                symbol: '',
                cash: false,
                wallet: false,
                braintree: false,
                stripe: false
            }
        }

    }

    _retrieveSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('settings');
            if (value !== null) {
                this.setState({ settings: JSON.parse(value) });
            }
        } catch (error) {
            console.log("Asyncstorage issue 3");
        }
    };

    componentDidMount() {
        this.heightReponsive();
        var curuser = firebase.auth().currentUser.uid;
        const userRoot = firebase.database().ref('users/' + curuser);
        userRoot.on('value', userData => {
            if (userData.val()) {
                this.setState(userData.val());
            }

        })
        this.tripSatusCheck();
        this._retrieveSettings();

    }

    //check for device height(specially iPhone 6)
    heightReponsive() {
        if (height <= 667) {
            this.setState({ heightIphoneSix: true })
        }
    }

    //navigation to screens from side menu
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    //sign out and clear all async storage
    async signOut() {
        firebase.auth().signOut();
    }

    //CHECKING TRIP END OR START
    tripSatusCheck() {
        var curuser = firebase.auth().currentUser;
        this.setState({ currentUser: curuser }, () => {
            const userData = firebase.database().ref('users/' + this.state.currentUser.uid);
            userData.on('value', userData => {
                if (userData.val()) {
                    var data = userData.val()
                    if (data['my-booking']) {
                        let bookingData = userData.val()['my-booking']
                        for (key in bookingData) {

                            bookingData[key].bookingKey = key
                            if (bookingData[key].payment_status) {
                                if (bookingData[key].payment_status == "WAITING" && bookingData[key].status == 'END' && bookingData[key].skip != true && bookingData[key].paymentstart != true) {
                                    bookingData[key].firstname = userData.val().firstName;
                                    bookingData[key].lastname = userData.val().lastName;
                                    bookingData[key].email = userData.val().email;
                                    bookingData[key].phonenumber = userData.val().mobile;
                                    this.props.navigation.navigate('CardDetails', { data: bookingData[key] });
                                }
                            }

                        }
                    }
                }
            })
        })
    }




    render() {
        return (
            <View style={styles.mainViewStyle}>
                <SideMenuHeader headerStyle={styles.myHeader} userPhoto={this.state.profile_image} userEmail={this.state.email} userName={this.state.firstName + ' ' + this.state.lastName} ></SideMenuHeader>

                <View style={styles.compViewStyle}>
                    <View style={[styles.vertialLine, { height: (width <= 320) ? width / 1.53 : width / 1.68 }]}></View>
                    <FlatList
                        data={this.state.sideMenuList}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ marginTop: 20 }}
                        bounces={false}
                        renderItem={({ item, index }) => {
                            if (this.state.settings.wallet == false && item.navigationName == 'wallet'  ) {
                                return null;
                            }else{
                                return(
                                <TouchableOpacity
                                    onPress={
                                        (item.name == languageJSON.logout) ? () => this.signOut() :
                                            this.navigateToScreen(item.navigationName)
                                    }
                                    style={
                                        [styles.menuItemView, { marginTop: (index == this.state.sideMenuList.length - 1) ? width / 7 : 0 }]
                                    }>
                                    <View style={styles.viewIcon}>
                                        <Icon
                                            name={item.icon}
                                            type={item.type}
                                            color={colors.WHITE}
                                            size={16}
                                            containerStyle={styles.iconStyle}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>{item.name}</Text>
                                </TouchableOpacity>
                                )
                            
                            }
                        }
                        } />
                </View>
                <View style={{ opacity: 0.6 }}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{ width: '100%' }}
                    />
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    myHeader: {
        marginTop: 0,
    },
    vertialLine: {
        width: 1,
        backgroundColor: colors.GREY.btnPrimary,
        position: 'absolute',
        left: 22,
        top: 24
    },
    menuItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 18,
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    viewIcon: {
        width: 24,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.btnPrimary,
        left: 1
    },
    menuName: {
        color: colors.WHITE,
        fontWeight: 'bold',
        marginLeft: 8,
        width: "100%"
    },
    mainViewStyle: {
        backgroundColor: colors.BLUE.dark,
        height: '100%',
    },
    compViewStyle: {
        position: 'relative',
        flex: 3
    },
    iconStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },

})