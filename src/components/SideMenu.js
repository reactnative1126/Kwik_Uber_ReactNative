import React from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation';
var { width, height } = Dimensions.get('window');

import { connect } from 'react-redux';
import { signOut } from '@modules/account/actions';

import { Loading } from '@components';
import SideMenuHeader from './SideMenuHeader';
import { colors } from '@constants/theme';
import API from '@services/API';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heightIphoneSix: false,
            sideMenuList:
                [
                    { key: 1, name: 'HOME', navigationName: 'Map', icon: 'home', type: 'font-awesome', child: 'firstChild' },
                    { key: 2, name: 'BOOK YOUR RIDE', navigationName: 'Booking', icon: 'ios-person-add', type: 'ionicon', child: 'secondChild' },
                    { key: 3, name: 'RIDE HISTORY', navigationName: 'Booking', icon: 'account-balance-wallet', type: 'MaterialIcons', child: 'thirdChild' },
                    { key: 4, name: 'NOTIFICATIONS', navigationName: 'About', icon: 'car-sports', type: 'material-community', child: 'fourthChild' },
                    { key: 5, name: 'PAYMENT', navigationName: 'wallet', icon: 'info', type: 'entypo', child: 'fifthChild' },
                    { key: 6, name: 'SUPPORT AND FAQ', navigationName: 'Contact', icon: 'sign-out', type: 'font-awesome', child: 'lastChild' },
                    { key: 7, name: 'ABOUT US', navigationName: 'About', icon: 'sign-out', type: 'font-awesome', child: 'lastChild' },
                    { key: 8, name: 'LOG OUT', icon: 'sign-out', type: 'font-awesome', child: 'lastChild' }
                ],
            profile_image: null,
            settings: {
                code: '',
                symbol: '',
                cash: false,
                wallet: false,
                braintree: false,
                stripe: false
            },
            loading: false
        }
    }

    componentDidMount() {
        this.heightReponsive();
        // this.tripSatusCheck();
        // this._retrieveSettings();

    }

    //check for device height(specially iPhone 6)
    heightReponsive() {
        if (height <= 667) {
            this.setState({ heightIphoneSix: true })
        }
    }

    //navigation to screens from side menu
    navigateToScreen = (route, name) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: name == 'BOOK YOUR RIDE' ? { tab: 1 } : name == 'RIDE HISTORY' ? { tab: 2 } :
                name == 'ABOUT US' ? { tab: 1 } : null
        });
        this.props.navigation.dispatch(navigateAction);
    }

    //sign out and clear all async storage
    async signOut() {
        AsyncStorage.setItem('LOGGED', 'false');
        this.props.navigation.navigate('Auth');
        this.setState({ loading: true });
        API.post('/user_logout', {
            user_id: this.props.userinfo.user_id,
            api_token: this.props.userinfo.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                AsyncStorage.setItem('LOGGED', 'false');
                AsyncStorage.setItem('USER', '');
                this.props.signOut('');
                this.props.navigation.navigate('Auth');
            } else {
                alert(resp.data.message);
                this.setState({ loading: false });
            }
        })
    }

    //CHECKING TRIP END OR START
    // tripSatusCheck() {
    //     var curuser = firebase.auth().currentUser;
    //     this.setState({ currentUser: curuser }, () => {
    //         const userData = firebase.database().ref('users/' + this.state.currentUser.uid);
    //         userData.on('value', userData => {
    //             if (userData.val()) {
    //                 var data = userData.val()
    //                 if (data['my-booking']) {
    //                     let bookingData = userData.val()['my-booking']
    //                     for (key in bookingData) {

    //                         bookingData[key].bookingKey = key
    //                         if (bookingData[key].payment_status) {
    //                             if (bookingData[key].payment_status == "WAITING" && bookingData[key].status == 'END' && bookingData[key].skip != true && bookingData[key].paymentstart != true) {
    //                                 bookingData[key].firstname = userData.val().firstName;
    //                                 bookingData[key].lastname = userData.val().lastName;
    //                                 bookingData[key].email = userData.val().email;
    //                                 bookingData[key].phonenumber = userData.val().mobile;
    //                                 this.props.navigation.navigate('CardDetails', { data: bookingData[key] });
    //                             }
    //                         }

    //                     }
    //                 }
    //             }
    //         })
    //     })
    // }

    // _retrieveSettings = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('settings');
    //         if (value !== null) {
    //             this.setState({ settings: JSON.parse(value) });
    //         }
    //     } catch (error) {
    //         console.log("Asyncstorage issue 3");
    //     }
    // };

    render() {
        return (
            <View style={styles.mainViewStyle}>
                <SideMenuHeader headerStyle={styles.myHeader} userPhoto={this.props.userinfo.profile_pic} userEmail={this.props.userinfo.email} userMobile={this.props.userinfo.mobno} userName={this.props.userinfo.user_name} navigation={this.props.navigation} />
                <View style={styles.compViewStyle}>
                    <FlatList
                        data={this.state.sideMenuList}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        renderItem={({ item, index }) => {
                            if (this.state.settings.wallet == false && item.navigationName == 'wallet') {
                                return null;
                            } else {
                                return (
                                    <TouchableOpacity
                                        onPress={
                                            (item.name == 'LOG OUT') ? () => this.signOut() :
                                                this.navigateToScreen(item.navigationName, item.name)
                                        }
                                        style={
                                            [styles.menuItemView, { marginTop: (index == this.state.sideMenuList.length - 1) ? height - (43 * 8) - 180 : 0, borderBottomWidth: (index == this.state.sideMenuList.length - 1) ? 0 : 1, borderTopWidth: (index == this.state.sideMenuList.length - 1) ? 1 : 0, borderTopColor: '#AAA' }]
                                        }>
                                        <Text style={styles.menuName}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        }} />
                </View>
                <Loading loading={this.state.loading} title={"Loading..."} />
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
        // marginBottom: 20,
        height: 40,
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#AAA',
        // borderTopWidth: 0.5,
        // borderTopColor: '#AAA'
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
        color: colors.BLACK,
        fontWeight: 'bold',
        marginLeft: 8,
        width: "100%"
    },
    mainViewStyle: {
        backgroundColor: "#FFF",
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

const mapStateToProps = state => {
    return {
        logged: state.account.logged,
        userinfo: state.account.userinfo
    }
}
const mapDispatchToProps = dispatch => {
    return {
        signOut: (data) => {
            dispatch(signOut(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)