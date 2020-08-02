import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    ImageBackground,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';

import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { setUser, setCustomer, setDeviceToken } from '@modules/account/actions';
import { setBooking, setNotification } from '@modules/booking/actions';
import { theme, colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API, { setClientToken } from '@services/API';

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async UNSAFE_componentWillMount() {
        this.checkPermission();
        this.messageListener();
    }

    checkPermission = async () => {
        await firebase.messaging().hasPermission()
            .then(enable => {
                if (enable) {
                    this.getToken();
                } else {
                    this.requestPermission();
                }
            }).catch(error => {
                console.log("Permission rejected ", error);
            })
    }

    requestPermission = async () => {
        await firebase.messaging().requestPermission()
            .then(() => {
                this.getToken();
            }).catch(error => {
                this.getToken();
                console.log("Request Permission rejected ", error);
            })
    }

    getToken = async () => {
        await firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    this.props.setDeviceToken(fcmToken);
                    setTimeout(() => {
                        AsyncStorage.getItem('logged').then((logged) => {
                            if (logged === 'true') {
                                AsyncStorage.getItem('user_info').then((user_info) => {
                                    // setClientToken(userinfo.api_token);
                                    this.props.setUser(JSON.parse(user_info));
                                    this.props.navigation.navigate('App');
                                });
                            } else {
                                this.props.navigation.navigate('Auth');
                            }
                        });
                    }, 2000);
                } else {
                    console.log("User does not have a device token");
                }
            }).catch(error => {
                console.log("getToken rejected ", error);
            });
    }

    messageListener = async () => {

        // This listener triggered when notification has been received in foreground
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;
            this.displayNotification(title, body, data);
        });
        // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body, data } = notificationOpen;
            this.displayNotification(title, body, data);
        });
        // This listener triggered when app is closed and we click,tapped and opened notification 
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body, data } = notificationOpen;
            this.displayNotification(title, body, data);
        }
    }

    displayNotification(title, body, data) {
        // we display notification in alert box with title and body
        if (data.key == 'book_now_notification' || data.key == 'book_later_notification') {
            this.props.setNotification(data.key);
            this.props.setBooking(JSON.parse(data.booking_info));
            this.props.setCustomer(JSON.parse(data.customer_info));
            this.props.navigation.navigate('App');
            // this.props.navigation.reset({ routes: [{ name: 'App'}] });
        }
    }

    render() {
        return (
            <ImageBackground style={style.container} source={images.img_background}>
                <StatusBar hidden />
                <Image source={images.img_logo} style={{ width: 150, height: 150 }} />
            </ImageBackground>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const mapDispatchToProps = dispatch => {
    return {
        setDeviceToken: (data) => {
            dispatch(setDeviceToken(data))
        },
        setUser: (data) => {
            dispatch(setUser(data))
        },
        setCustomer: (data) => {
            dispatch(setCustomer(data))
        },
        setBooking: (data) => {
            dispatch(setBooking(data))
        },
        setNotification: (data) => {
            dispatch(setNotification(data))
        }
    }
}
export default connect(undefined, mapDispatchToProps)(Splash)