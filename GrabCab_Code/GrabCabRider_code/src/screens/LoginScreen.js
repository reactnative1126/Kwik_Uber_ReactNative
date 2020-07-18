import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Platform
} from "react-native";
import MaterialButtonDark from "../components/MaterialButtonDark";
import MaskedInput from 'react-native-masked-input-text'
import * as firebase from 'firebase'
import * as Facebook from 'expo-facebook';
import languageJSON from '../common/language';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from "expo-crypto";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";



export default class LoginScreen extends Component {

    recaptchaVerifier = null;
    firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber:null,
            verificationId:null,
            verificationCode:null,
        }
    }

    async FbLogin() {

        try {
            await Facebook.initializeAsync('XXXXXXXXXXXXXXXXXXXXX');
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
                                this.props.navigation.navigate("Reg", { requireData: data })
                            } else {
                                this.props.navigation.navigate('Root');
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

    appleSigin = async () => {

        const csrf = Math.random().toString(36).substring(2, 15);
        const nonce = Math.random().toString(36).substring(2, 10);
        const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
        try {
            const applelogincredentials = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                state: csrf,
                nonce: hashedNonce
            });
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: applelogincredentials.identityToken,
                rawNonce: nonce,
            });
            firebase.auth().signInWithCredential(credential)
                .then((user) => {
                    if (user) {
                        if (user.additionalUserInfo.isNewUser == true) {
                            var data = user.additionalUserInfo;
                            this.props.navigation.navigate("Reg", { requireData: data })
                        } else {
                            this.props.navigation.navigate('Root');
                        }
                    }
                })
                .catch((error) => {
                    alert(languageJSON.apple_signin_error);
                    console.log(error);
                });

        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                console.log("Cencelled");
            } else {
                console.log(e);
                alert(languageJSON.apple_signin_error);
            }
        }
    }
    
    onPressLogin = async () => {
        let formattedNum = this.state.phoneNumber.replace(/ /g,'');
        formattedNum = formattedNum.replace(/-/g,'');
        if(formattedNum.length>8){
            try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                const verificationId = await phoneProvider.verifyPhoneNumber(
                    formattedNum,
                    this.recaptchaVerifier
                );
                this.setState({verificationId:verificationId});
              } catch (err) {
                    alert(languageJSON.firebase_otp_error)
              }
        }else{
            alert(languageJSON.mobile_no_blank_error);
        }
    }


    onSignIn = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              this.state.verificationId,
              this.state.verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            this.setState({
                phoneNumber:null,
                verificationId:null,
                verificationCode:null
            });
          } catch (err) {
                alert(languageJSON.otp_error);
          }
    }

    async CancelLogin(){
        this.setState({
            phoneNumber:null,
            verificationId:null,
            verificationCode:null
        });
    }

    async openTerms(){
        Linking.openURL("https://exicube.com/privacy_policy.html").catch(err => console.error("Couldn't load page", err));
    }


    render() {
        
        return (
            <View style={styles.container}>
                <FirebaseRecaptchaVerifierModal
                    ref={ref => (this.recaptchaVerifier = ref)}
                    firebaseConfig={this.firebaseConfig}
                />
                <ImageBackground
                    source={require("../../assets/images/bg.png")}
                    resizeMode="stretch"
                    style={styles.imagebg}
                >
                    <KeyboardAvoidingView behavior={"position"}>
                        <Text style={styles.logintext}>{languageJSON.login_title}</Text>
                        <View style={styles.blackline}></View>
                        <View style={styles.box1}>
                            <MaskedInput 
                                style={styles.textInput} 
                                //mask={'+38\\0 00 000-00-00'} 
                                mask={'+00000000?0?0?0?0?0?0?0?0?0'} 
                                placeholder={languageJSON.mobile_no_placeholder} 
                                onChangeText={(value) => this.setState({phoneNumber:value})}
                                value={this.state.phoneNumber}
                                editable={!!this.state.verificationId?false:true}
                            />
                        </View>
                        {this.state.verificationId?null:
                            <MaterialButtonDark 
                                onPress={()=>this.onPressLogin()}
                                style={styles.materialButtonDark}
                            >{languageJSON.request_otp}</MaterialButtonDark>
                        }
                        {!!this.state.verificationId?
                            <View style={styles.box2}>
                                <MaskedInput 
                                    style={styles.textInput} 
                                    mask={'000000'} 
                                    placeholder={languageJSON.otp_here} 
                                    onChangeText={(value) => this.setState({verificationCode:value})}
                                    value={this.state.verificationCode}
                                    editable={!!this.state.verificationId}
                                />
                            </View>
                        :null}
                        {!!this.state.verificationId?
                            <MaterialButtonDark 
                                onPress={this.onSignIn}
                                style={styles.materialButtonDark}
                            >{languageJSON.authorize}</MaterialButtonDark>
                        :null}
                        {this.state.verificationId?
                            <View style={styles.actionLine}>
                                <TouchableOpacity style={styles.actionItem} onPress={()=>this.CancelLogin()}>
                                    <Text style={styles.actionText}>{languageJSON.cancel}</Text>
                                </TouchableOpacity>
                            </View>                    
                        :null}
                        {this.state.verificationId?null:
                            <View style={styles.seperator}>
                                <View style={styles.lineLeft}></View>
                                <View style={styles.lineLeftFiller}>
                                    <Text style={styles.sepText}>{languageJSON.spacer_message}</Text>
                                </View>
                                <View style={styles.lineRight}></View>
                            </View>
                        }
                        {this.state.verificationId?null:
                            <View style={styles.socialBar}>
                                <TouchableOpacity style={styles.socialIcon} onPress={() => { this.FbLogin() }}>
                                    <Image
                                        source={require("../../assets/images/image_fb.png")}
                                        resizeMode="contain"
                                        style={styles.socialIconImage}
                                    ></Image>
                                </TouchableOpacity>
                                {Platform.OS=='ios'?
                                <TouchableOpacity style={styles.socialIcon} onPress={() => { this.appleSigin() }}>
                                    <Image
                                        source={require("../../assets/images/image_apple.png")}
                                        resizeMode="contain"
                                        style={styles.socialIconImage}
                                    ></Image>
                                </TouchableOpacity>
                                :null}
                            </View>
                        }
                        {this.state.verificationId?null:
                            <View>
                                <TouchableOpacity style={styles.terms} onPress={()=> this.openTerms()}>
                                    <Text style={styles.actionText}>{languageJSON.terms}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imagebg: {
        flex: 1
    },
    logintext: {
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        marginTop: Dimensions.get('window').height / 2,
        alignSelf: "center"
    },
    blackline: {
        width: 140,
        height: 1,
        backgroundColor: "rgba(0,0,0,1)",
        marginTop: 12,
        alignSelf: "center"
    },
    box1: {
        height: 35,
        backgroundColor: "rgba(255,255,255,1)",
        marginTop: 26,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 1,
        borderColor: "#c2bbba",
    },
    box2: {
        height: 35,
        backgroundColor: "rgba(255,255,255,1)",
        marginTop: 12,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 1,
        borderColor: "#c2bbba",
    },

    textInput: {
        color: "#121212",
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        textAlign: "left",
        marginTop: 8,
        marginLeft: 5
    },
    materialButtonDark: {
        height: 35,
        marginTop: 22,
        marginLeft: 35,
        marginRight: 35
    },
    actionLine:{
        height: 20,
        flexDirection: "row",
        marginTop: 20,
        alignSelf:'center'
    },
    actionItem:{
        height: 20,
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center"
    },
    actionText:{
        fontSize: 15,
        fontFamily: "Roboto-Regular",
        fontWeight:'bold'
    },
    seperator: {
        width: 250,
        height: 20,
        flexDirection: "row",
        marginTop: 40,
        alignSelf: 'center'
    },
    lineLeft: {
        width: 40,
        height: 1,
        backgroundColor: "rgba(113,113,113,1)",
        marginTop: 9
    },
    sepText: {
        color: "rgba(255,255,255,1)",
        fontSize: 16,
        fontFamily: "Roboto-Regular"
    },
    lineLeftFiller: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    lineRight: {
        width: 40,
        height: 1,
        backgroundColor: "rgba(113,113,113,1)",
        marginTop: 9
    },
    socialBar:{
        height: 40,
        flexDirection: "row",
        marginTop: 20,
        alignSelf:'center'
    },
    socialIcon: {
        width: 40,
        height: 40,
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center"
    },
    socialIconImage:{
        width: 40,
        height: 40
    },
    terms:{
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        opacity:.54
    }
});
