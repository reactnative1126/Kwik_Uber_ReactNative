import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
    AsyncStorage
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements';
import * as Facebook from 'expo-facebook';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';

import { Header, Loading } from '@components';
import MaterialButtonYellow from "@components/MaterialButtonYellow";
import { verifyEmail, verifyLength } from '@constants/functions';
import images from '@constants/images';
import language from '@constants/language';
import API from '@services/API';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            emailMsg: null,
            passwordMsg: null,
            token: '',
            loading: false,
        }
    }

    async FbLogin() {
        try {
            await Facebook.initializeAsync('1643080409184364');
            const {
                type,
                token
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', "email"],
            });
            alert( type + token)

        } catch ({ message }) {
            alert(language.facebook_login_auth_error`${message}`);
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

                        await API.post('/user_login', {
                            email: email,
                            password: password,
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
                    }
                }
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <ImageBackground
                    source={require("@assets/images/background.png")}
                    resizeMode="stretch"
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header title="" isStatus="login" navigation={this.props.navigation} />
                        <KeyboardAwareScrollView>
                            <View style={styles.applogoframe}>
                                <Image source={require('@assets/images/applogo.png')}
                                    style={styles.applogo}></Image>
                            </View>
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
                            <MaterialButtonYellow
                                onPress={() => this.onLogin()}
                                style={styles.materialButtonYellow}>
                                {language.login_button}
                            </MaterialButtonYellow>
                            <View style={styles.pairButton}>
                                <MaterialButtonYellow
                                    onPress={() => this.props.navigation.navigate("Signup")}
                                    style={styles.SignupStyle}>
                                    {language.signup_button}
                                </MaterialButtonYellow>
                                <TouchableOpacity
                                    onPress={() => this.FbLogin()}
                                    style={styles.FBStyle}>
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
                <Loading loading = {this.state.loading} title={"Loading..."}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    applogoframe: {
        marginTop: hp('15.0%'),
        alignSelf: "center"
    },
    applogo: {
        width: 130,
        height: 135,
        marginBottom: 20
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
        borderBottomColor: '#FFF'
    },

    materialButtonYellow: {
        height: 45,
        marginLeft: 30,
        marginRight: 30
    },
    pairButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        backgroundColor: "rgba(255,255,255,0)",
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    SignupStyle: {
        width: '48%',
        height: 45,
        borderRadius: 10,
    },
    FBStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '48%',
        height: 45,
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

const mapDispatchToProps = dispatch => {
    return {
        setUser: (data) => {
            dispatch(setUser(data))
        }
    }
}
export default connect(undefined, mapDispatchToProps)(Login)
