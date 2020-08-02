import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';
import { Register, Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API, { setClientToken } from '@services/API';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    async onRegister(name, email, mobile, password) {
        this.setState({ loading: true });
        await Geolocation.getCurrentPosition((position) => {
            Geocoder.init(configs.google_map_key);
            Geocoder.from({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }).then(json => {
                firebase.auth().createUserWithEmailAndPassword(email, password).then((resp) => {
                    API.post('/user_register', {
                        user_type: 'C',
                        user_name: name,
                        user_uid: resp.user.uid,
                        email: email,
                        mobno: mobile,
                        password: password,
                        gender: 1,
                        address: json.results[0].formatted_address,
                        mode: Platform.OS,
                        fcm_id: this.props.device_token,
                        device_token: this.props.device_token
                    }).then((resp) => {
                        if (resp.data.success == 1) {
                            // console.log(JSON.stringify(resp));
                            // setClientToken(resp.data.data.userinfo.api_token);
                            AsyncStorage.setItem('logged', 'true');
                            this.setState({ loading: false });
                            AsyncStorage.setItem('user_info', JSON.stringify(resp.data.data.userinfo));
                            this.props.setUser(resp.data.data.userinfo);
                            this.props.navigation.navigate('App');
                        } else {
                            this.setState({ loading: false });
                            this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                        }
                    }).catch((error) => {
                        this.setState({ loading: false });
                        this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                    });
                }).catch((error) => {
                    this.setState({ loading: false });
                    this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                });
            }).catch((error) => {
                this.setState({ loading: false });
                this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
            });
        }).catch((error) => {
            this.setState({ loading: false });
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    render() {
        return (
            <View style={styles.container} >
                <Register onRegister={(name, email, mobile, password) => this.onRegister(name, email, mobile, password)} navigation={this.props.navigation} />
                <Loading loading={this.state.loading} />
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={20}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    textContainer: { textAlign: "center" },
});

const mapStateToProps = state => {
    return {
        device_token: state.account.device_token
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(setUser(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)