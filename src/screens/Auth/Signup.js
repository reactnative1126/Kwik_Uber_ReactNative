import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    AsyncStorage
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Geolocation from 'react-native-geolocation-service';
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
        Geocoder.init(configs.google_map_key);
        this.state = {
            loading: false,
        }
    }

    async onRegister(name, email, mobile, password, image) {
        this.setState({ loading: true });
        if (Platform.OS === "ios") {
            const authorizationLevel = "always";
            let { status } = await Geolocation.requestAuthorization(authorizationLevel);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
            }
        }
        // alert(JSON.stringify(image))

        let formData = new FormData();
        formData.append("license_image", {
          name: image.filename,
          type: image.mime,
          uri: Platform.OS === "android" ? image.uri : image.path
        })

        var image_name = '';
        API.post('/upload_image',
          formData
        ).then(response => {
            image_name = response.request._response;
        })
        
        Geolocation.getCurrentPosition((position) => {
            this.refs.toast.show("GeoLocation", DURATION.LENGTH_LONG);
            Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
                this.refs.toast.show("GeoCorder", DURATION.LENGTH_LONG);
                API.post('/user_register', {
                    user_type: 'D',
                    user_name: name,
                    user_uid: this.props.device_token,
                    email: email,
                    mobno: mobile,
                    password: password,
                    license_image: image_name,
                    gender: 1,
                    address: json.results[0].formatted_address,
                    mode: Platform.OS,
                    fcm_id: this.props.device_token,
                    device_token: this.props.device_token
                }).then((resp) => {
                    this.refs.toast.show("UserRegister", DURATION.LENGTH_LONG);
                    if (resp.data.success == 1) {
                        this.setState({ loading: false });
                        AsyncStorage.setItem('logged', 'true');
                        AsyncStorage.setItem('user_info', JSON.stringify(resp.data.data.userinfo));
                        this.props.setUser(resp.data.data.userinfo);
                        this.props.navigation.pop();
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
        }, (error) => {
            this.setState({ loading: false });
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        }, {
            enableHighAccuracy: true, timeout: 30000, maximumAge: 1000
        });
    }

    render() {
        return (
            <View style={styles.container} >
                <Register onRegister={(name, email, mobile, password, image) => this.onRegister(name, email, mobile, password, image)} navigation={this.props.navigation} />
                <Loading loading={this.state.loading} />
                <Toast ref="toast" position='top' positionValue={50} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8} />
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