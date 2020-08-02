import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
    View,
    Image,
    Text,
    Alert,
    AsyncStorage
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';
import { Loading } from '@components';
import { verifyEmail, verifyLength } from '@constants/functions';
import { theme, colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API, { setClientToken } from '@services/API';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            emailMsg: null,
            passwordMsg: null,
            loading: false,
        }
    }

    async FbLogin() {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                throw 'User cancelled the login process';
            }
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                throw 'Something went wrong obtaining access token';
            } else {
                this.setState({ loading: true });
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                firebase.auth().signInWithCredential(credential)
                    .then((resp) => {
                        if (resp && resp.additionalUserInfo.isNewUser == true) {
                            Geolocation.getCurrentPosition((position) => {
                                Geocoder.init(configs.google_map_key);
                                Geocoder.from({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }).then(json => {
                                    API.post('/user_register', {
                                        user_type: 'D',
                                        user_name: resp.user.displayName,
                                        user_uid: resp.user.uid,
                                        email: resp.user.email,
                                        mobno: resp.user.phoneNumber == null ? '123456789' : resp.user.phoneNumber,
                                        password: '123456',
                                        licence_image: '',
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
                                            AsyncStorage.setItem('user_info', JSON.stringify(resp.data.data.userinfo));
                                            this.props.setUser(resp.data.data.userinfo);
                                            this.props.navigation.reset({ routes: [{ name: 'App' }] });
                                        } else {
                                            this.setState({ loading: false });
                                            this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                                        }
                                    }).catch((error) => {
                                        this.setState({ loading: false });
                                        this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                                    })
                                }).catch((error) => {
                                    this.setState({ loading: false });
                                    this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                                })
                            });
                        } else {
                            API.post('/user_login', {
                                user_type: 'D',
                                email: resp.user.email,
                                password: '123456',
                                fcm_id: this.props.device_token,
                                device_token: this.props.device_token
                            }).then((resp) => {
                                if (resp.data.success == 1) {
                                    if (resp.data.data.userinfo.vehicle_info == null) {
                                        this.refs.toast.show("Please register vehicle type from Adminitrator.", DURATION.LENGTH_LONG);
                                        this.setState({ loading: false });
                                    } else {
                                        // console.log(JSON.stringify(resp));
                                        // setClientToken(resp.data.data.userinfo.api_token);
                                        AsyncStorage.setItem('logged', 'true');
                                        AsyncStorage.setItem('user_info', JSON.stringify(resp.data.data.userinfo));
                                        this.props.setUser(resp.data.data.userinfo);
                                        this.props.navigation.reset({ routes: [{ name: 'App' }] });
                                    }
                                } else {
                                    this.setState({ loading: false });
                                    this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                                }
                            }).catch((error) => {
                                this.setState({ loading: false });
                                this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                            })
                        }
                    }).catch(error => {
                        this.setState({ loading: false });
                        this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                    })
            }
        } catch ({ error }) {
            this.setState({ loading: false });
            this.refs.toast.show(language.facebook_login_auth_error`${error.message}`, DURATION.LENGTH_LONG);
        }
    }

    async onLogin() {
        let { email, password } = this.state;
        if (!email) {
            this.setState({ emailMsg: "Should not be empty" });
        } else {
            this.setState({ emailMsg: null })
            if (!verifyEmail(email)) {
                this.setState({ emailMsg: "Email is invailed" });
            } else {
                if (!password) {
                    this.setState({ passwordMsg: "Should not be empty" });
                } else {
                    if (!verifyLength(password, 6)) {
                        this.setState({ passwordMsg: "Enter more 6 character" });
                    } else {
                        this.setState({ passwordMsg: null, loading: true });
                        firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
                            API.post('/user_login', {
                                user_type: 'D',
                                email: email,
                                password: password,
                                fcm_id: this.props.device_token,
                                device_token: this.props.device_token
                            }).then((resp) => {
                                if (resp.data.success == 1) {
                                    if (resp.data.data.userinfo.vehicle_info == null) {
                                        this.refs.toast.show("Please register vehicle type from Adminitrator.", DURATION.LENGTH_LONG);
                                        this.setState({ loading: false });
                                    } else {
                                        // console.log(JSON.stringify(resp));
                                        // setClientToken(resp.data.data.userinfo.api_token);
                                        AsyncStorage.setItem('logged', 'true');
                                        AsyncStorage.setItem('user_info', JSON.stringify(resp.data.data.userinfo));
                                        this.props.setUser(resp.data.data.userinfo);
                                        this.props.navigation.reset({ routes: [{ name: 'App' }] });
                                    }
                                } else {
                                    this.setState({ loading: false });
                                    this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                                }
                            }).catch((error) => {
                                this.setState({ loading: false });
                                this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                            })
                        }).catch((error) => {
                            this.setState({ loading: false });
                            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
                        })
                    }
                }
            }
        }
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={{ flex: 6 }} />
                <View style={{ flex: 4, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.push('Forgot')}>
                        <Text style={{ color: colors.WHITE }}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent backgroundColor={colors.TRANSPARENT} />
                <ImageBackground source={images.img_background} resizeMode="stretch" style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderHeader()}
                        <KeyboardAwareScrollView contentContainerStyle={{ alignItems: 'center' }}>
                            <Image source={images.img_logo} style={{ marginTop: 100, marginBottom: 20, width: 130, height: 150 }} />
                            <View style={styles.containerStyle}>
                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='user-o'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.userInput = input)}
                                        editable={true}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Email Address"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        keyboardType={'email-address'}
                                        secureTextEntry={false}
                                        blurOnSubmit={false}
                                        value={this.state.email}
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                        errorMessage={this.state.emailMsg == null ? null : this.state.emailMsg}
                                        onSubmitEditing={() => { this.passwordInput.focus() }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                    />
                                </View>
                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='envelope-o'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.passwordInput = input)}
                                        editable={true}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Password"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.password}
                                        secureTextEntry={true}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ password: text }) }}
                                        errorMessage={this.state.passwordMsg == null ? null : this.state.passwordMsg}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => this.onLogin()} style={[styles.button, { width: wp('85.0%') }]}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{language.login_button}</Text>
                            </TouchableOpacity>
                            <View style={styles.pairButton}>
                                <TouchableOpacity onPress={() => this.props.navigation.push("Signup")} style={[styles.button, { width: wp('40.0%') }]}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{language.signup_button}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.FbLogin()} style={styles.FBStyle}>
                                    <Text style={{ color: '#FFF', width: '80%', textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>CONNECT</Text>
                                    <View style={styles.FBIconStyle}>
                                        <Image
                                            style={{ width: 15, height: 20, tintColor: 'rgba(255, 255, 255, 1)' }}
                                            source={images.icon_FB} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
                <Loading loading={this.state.loading} />
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={50}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        width: wp('100.0%'),
        paddingLeft: 20,
        paddingRight: 20,
        height: Platform.OS === 'ios' ? 40 : 70
    },

    containerStyle: {
        flexDirection: 'column',
        paddingLeft: 30,
        paddingRight: 30,
        marginBottom: 20
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 240, 240, 0.8)'
    },
    inputTextStyle: {
        color: 'rgba(240, 240, 240, 0.8)',
        fontSize: 15,
        height: 32,
        marginTop: 10
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        borderBottomColor: colors.WHITE
    },
    pairButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wp('85.0%'),
        height: 50,
        backgroundColor: "rgba(255,255,255,0)",
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        backgroundColor: "#FDF75C",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 45,
        shadowColor: colors.BLACK,
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5
    },
    FBStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('40.0%'),
        height: 48,
        backgroundColor: "rgba(61,96,182,1)",
        borderRadius: 10,
    },
    FBIconStyle: {
        width: '20%',
        height: '100%',
        color: "#FFFFFF",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'rgba(22, 61, 155, 1)',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(Login)
