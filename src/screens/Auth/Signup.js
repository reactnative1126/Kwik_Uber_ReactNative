import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    AsyncStorage
} from 'react-native';

import { Notifications } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';

import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';

import { Register, Loading } from '@components';
import configs from '@constants/configs';
import API from '@services/API';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            loading: false,
        }
    }

    async onRegister(name, email, mobile, password) {
        this.setState({ loading: true });
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            let token = await Notifications.getExpoPushTokenAsync();
            this.setState({ token: token });
        } else {
            alert('Must use physical device for Push Notifications');
        }

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({})
        Geocoder.init(configs.google_map_key);
        Geocoder.from({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }).then(json => {
            API.post('/user_register', {
                user_type: 'C',
                user_name: name,
                email: email,
                mobno: mobile,
                password: password,
                gender: 1,
                address: json.results[0].formatted_address,
                mode: Platform.OS,
                fcm_id: null,
                device_token: this.state.token
            }).then((resp) => {
                if (resp.data.success == 1) {
                    AsyncStorage.setItem('LOGGED', 'true');
                    AsyncStorage.setItem('USER', JSON.stringify(resp.data.data.userinfo));
                    this.props.setUser(resp.data.data.userinfo);
                    this.props.navigation.navigate('Root');
                } else {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                }
            })
        })
    }

    render() {
        const data = this.props.navigation.getParam("requireData");
        return (
            <View style={styles.container}>
                <Register reqData={data ? data : ""} onRegister={(name, email, mobile, password) => this.onRegister(name, email, mobile, password)} navigation={this.props.navigation} />
                <Loading loading={this.state.loading} title={"Loading..."} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    textContainer: { textAlign: "center" },
});

const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(setUser(data))
        }
    }
}
export default connect(undefined, mapDispatchToProps)(Signup)