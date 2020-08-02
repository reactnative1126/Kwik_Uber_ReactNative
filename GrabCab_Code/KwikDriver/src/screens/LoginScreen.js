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
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements'

import MaterialButtonYellow from "../components/MaterialButtonYellow";
import languageJSON from '../common/language';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';

import { Header } from '@components';
import { colors } from '../common/theme';
import { verifyEmail, verifyPhone, verifyLength } from '@constants/functions';
import images from '@constants/images';

export default class LoginScreen extends Component {

    // recaptchaVerifier = null;
    // firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

    constructor(props) {
        super(props);
        this.state = {
            loadingModal: false,
            userId: null,
            password: null,
            userIdMsg: null,
            passwordMsg: null,
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
            if (type === 'success') {
                const credential = firebase.auth.FacebookAuthProvider.credential(token);
                firebase.auth().signInWithCredential(credential)
                    .then((user) => {
                        if (user) {
                            if (user.additionalUserInfo.isNewUser == true) {
                                var data = user.additionalUserInfo;
                                data.profile.mobile = "";
                                this.props.navigation.navigate("DriverReg", { requireData: data })
                            } else {
                                this.props.navigation.navigate('DriverRoot');
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                        alert(languageJSON.facebook_login_error);
                    }
                    )
            }
            else {
                alert(languageJSON.facebook_login_error);
            }
        } catch ({ message }) {
            alert(languageJSON.facebook_login_auth_error`${message}`);
        }
    }

    onPressLogin = async () => {
        let { userId, password } = this.state;
        const { navigation } = this.props;
        if (!userId) {
            this.setState({ userIdMsg: "Should not be empty" });
        } else {
            this.setState({ userIdMsg: null })
            if (userId[0] == "+") {
                if (!verifyPhone(userId)) {
                    this.setState({ userIdMsg: "Email is invailed" });
                } else {
                    if (!password) {
                        this.setState({ passwordMsg: "Should not be empty" });
                    } else {
                        if (!verifyLength(password, 6)) {
                            this.setState({ passwordMsg: "Enter more 6 character" });
                        } else {
                            this.setState({ passwordMsg: null });
                            firebase.database().ref("users").on('value', (snapshot) => {
                                snapshot.forEach((item) => {
                                    snapshot.forEach((item) => {
                                        if (item.val().usertype == "driver" && item.val().mobile == userId) {
                                            firebase.auth().signInWithEmailAndPassword(item.val().email, password)
                                                .then((result) => {
                                                    navigation.navigate('DriverRoot')
                                                }, (error) => {
                                                    alert(error)
                                                })
                                        }
                                    });
                                });
                            });
                        }
                    }
                }
            } else {
                if (!verifyEmail(userId)) {
                    this.setState({ userIdMsg: "Email is invailed" });
                } else {
                    if (!password) {
                        this.setState({ passwordMsg: "Should not be empty" });
                    } else {
                        if (!verifyLength(password, 6)) {
                            this.setState({ passwordMsg: "Enter more 6 character" });
                        } else {
                            this.setState({ passwordMsg: null });
                            firebase.database().ref("users").once('value')
                                .then(function (snapshot) {
                                    snapshot.forEach((item) => {
                                        if (item.val().usertype == "driver" && item.val().email == userId) {
                                            firebase.auth().signInWithEmailAndPassword(userId, password)
                                                .then((result) => {
                                                    navigation.navigate('DriverRoot')
                                                }, (error) => {
                                                    alert(error)
                                                })
                                        }
                                    });
                                });
                        }
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
                                source={require('../../assets/images/loader.gif')}
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
                <FirebaseRecaptchaVerifierModal
                    ref={ref => (this.recaptchaVerifier = ref)}
                    firebaseConfig={this.firebaseConfig}
                />
                <ImageBackground
                    source={require("../../assets/images/background.png")}
                    resizeMode="stretch"
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header title="Login" isStatus="forgot" navigation={this.props.navigation} />
                        <KeyboardAwareScrollView>
                            <View style={styles.applogoframe}>
                                <Image source={require('../../assets/images/applogo.png')}
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
                                        placeholder={"Email or Phone Number"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        keyboardType={'email-address'}
                                        secureTextEntry={false}
                                        blurOnSubmit={false}
                                        value={this.state.userId}
                                        onChangeText={(text) => { this.setState({ userId: text }) }}
                                        errorMessage={this.state.userIdMsg == null ? null : this.state.userIdMsg}
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
                                {"LOGIN"}
                            </MaterialButtonYellow>
                            <View style={styles.pairButton}>
                                <MaterialButtonYellow
                                    onPress={() => this.props.navigation.navigate("DriverReg")}
                                    style={styles.SignupStyle}>
                                    {"SIGN UP"}
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
