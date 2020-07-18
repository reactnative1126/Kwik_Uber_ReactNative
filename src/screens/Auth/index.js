import React, { Component } from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    ImageBackground,
    Image,
    AsyncStorage,
    Alert,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Geolocation from 'react-native-geolocation-service';

import firebase, { crashlytics } from 'react-native-firebase';
import { connect } from 'react-redux';
import { setUser, setDriver, setDeviceToken } from '@modules/account/actions';
import { setBooking } from '@modules/booking/actions';
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
        crashlytics().log('Auth - UNSAFE_componentWillMount');
        if (Platform.OS === "ios") {
            const authorizationLevel = "always";
            let { status } = await Geolocation.requestAuthorization(authorizationLevel);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
            }
        }
        this.checkPermission();
        this.messageListener();
    }

    checkPermission = async () => {
        crashlytics().log('Auth - checkPermission');
        firebase.messaging().hasPermission().then(enable => {
            if (enable) {
                this.getToken();
            } else {
                this.requestPermission();
            }
        }).catch(error => {
            crashlytics().recordError(error);
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    requestPermission = async () => {
        crashlytics().log('Auth - requestPermission');
        firebase.messaging().requestPermission().then(() => {
            this.getToken();
        }).catch(error => {
            crashlytics().recordError(error);
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    getToken = async () => {
        crashlytics().log('Auth - getToken');
        firebase.messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                this.props.setDeviceToken(fcmToken);
                setTimeout(() => {
                    AsyncStorage.getItem('logged').then((logged) => {
                        if (logged === 'true') {
                            AsyncStorage.getItem('user_info').then((user_info) => {
                                this.props.setUser(JSON.parse(user_info));
                                this.props.navigation.navigate('App');
                            });
                        } else {
                            this.props.navigation.navigate('Auth');
                        }
                    });
                }, 2000);
            } else {
                this.refs.toast.show("User does not have a device token", DURATION.LENGTH_LONG);
            }
        }).catch(error => {
            crashlytics().recordError(error);
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    messageListener = async () => {
        crashlytics().log('Auth - messageListener');
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
        };
    }

    displayNotification(title, body, data) {
        crashlytics().log('Auth - displayNotification');
        if (data.key == 'accept_ride_notification') {
            Alert.alert(
                title,
                body,
                [
                    {
                        text: 'GOT IT',
                        onPress: () => {
                            this.props.setBooking(JSON.parse(data.data).riderequest_info);
                            this.props.setDriver(JSON.parse(data.data).driver_details);
                            this.props.navigation.navigate('Track');
                        },
                        style: 'cancel'
                    }
                ],
            )
        } else if (data.key == 'ride_completed_notification') {
            Alert.alert(
                title,
                body,
                [
                    {
                        text: 'GOT IT',
                        onPress: () => {
                            this.props.setBooking(JSON.parse(data.data).riderequest_info);
                            this.props.setDriver(JSON.parse(data.data).driver_details);
                            this.props.navigation.navigate('Rating');
                        },
                        style: 'cancel'
                    }
                ],
            )
        } else {
            Alert.alert(
                title,
                body,
                [
                    {
                        text: 'GOT IT',
                        style: 'cancel'
                    }
                ],
            )
        }
    }

    render() {
        return (
            <ImageBackground style={style.container} source={images.img_background}>
                <StatusBar hidden />
                <Image source={images.img_logo} style={{ width: 150, height: 150 }} />
                <Toast ref="toast" position='top' positionValue={50} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8} />
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
        setDriver: (data) => {
            dispatch(setDriver(data))
        },
        setBooking: (data) => {
            dispatch(setBooking(data))
        }
    }
}
export default connect(undefined, mapDispatchToProps)(Splash)