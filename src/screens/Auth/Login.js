import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    View,
    Image,
    Text,
    Modal,
    TouchableOpacity,
    StatusBar,
    AsyncStorage
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements';
// import firebase from "react-native-firebase";
import * as Facebook from 'expo-facebook';

import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';

import { Header } from '@components';
import MaterialButtonYellow from "@components/MaterialButtonYellow";
import { verifyEmail, verifyLength } from '@constants/functions';
import { colors } from '@constants/theme';
import images from '@constants/images';
import language from '@constants/language';
import API from '@services/API';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingModal: false,
            email: null,
            password: null,
            emailMsg: null,
            passwordMsg: null,
        }
    }

    // async componentDidMount() {
    //     //we check if user has granted permission to receive push notifications.
    //     this.checkPermission();
    //     // Register all listener for notification 
    //     // this.createNotificationListeners();
    // }

    // async checkPermission() {
    //     const enabled = await firebase.messaging().hasPermission();
    //     // If Premission granted proceed towards token fetch
    //     if (enabled) {
    //         this.getToken();
    //     } else {
    //         // If permission hasn’t been granted to our app, request user in requestPermission method. 
    //         this.requestPermission();
    //     }
    // }

    // async getToken() {
    //     let fcmToken = await AsyncStorage.getItem('fcmToken');
    //     if (!fcmToken) {
    //         fcmToken = await firebase.messaging().getToken();
    //         if (fcmToken) {
    //             // user has a device token
    //             await AsyncStorage.setItem('fcmToken', fcmToken);
    //         }
    //     }
    // }

    // async requestPermission() {
    //     try {
    //         await firebase.messaging().requestPermission();
    //         // User has authorised
    //         this.getToken();
    //     } catch (error) {
    //         // User has rejected permissions
    //         console.log('permission rejected');
    //     }
    // }

    async FbLogin() {
        try {
            await Facebook.initializeAsync('1643080409184364');
            const {
                type,
                token
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', "email"],
            });

        } catch ({ message }) {
            alert(language.facebook_login_auth_error`${message}`);
        }
    }

    onPressLogin() {
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
                        this.setState({ passwordMsg: null });
                        // alert(await AsyncStorage.getItem('fcmToken'));
                        API.post('/user_login', {
                            email: email,
                            password: password,
                        }).then((resp) => {
                            if (resp.data.success == 1) {
                                AsyncStorage.setItem('LOGGED', 'true');
                                AsyncStorage.setItem('USER', JSON.stringify(resp.data.data.userinfo));
                                this.props.setUser(resp.data.data.userinfo);
                                this.props.navigation.navigate('Root');
                            } else (
                                alert(resp.data.message)
                            )
                        })
                    }
                }
            }
        }
    }

    loading() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.loadingModal}
                onRequestClose={() => {
                    this.setState({ loadingModal: false })
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
                            <Image
                                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                                source={require('@assets/images/loader.gif')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#000", fontSize: 16, }}>{"Loading..."}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
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
                                onPress={() => this.onPressLogin()}
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
                {this.loading()}
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
