import React, { Component } from "react";
import {
    StyleSheet,
    View,
    LayoutAnimation,
    ImageBackground,
    Text,
    SafeAreaView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements';

import * as firebase from 'firebase';
import { Header } from '@components';
import MaterialButtonYellow from "@components/MaterialButtonYellow";


export default class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            emailValid: true,
            loadingModal: false
        }
    }

    onPressLogin = async () => {
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();
        if (emailValid) {
            this.setState({ loadingModal: true });
            firebase.auth().sendPasswordResetEmail(this.state.email)
                .then((user) => {
                    alert("Please check your email...");
                }).catch((e) => {
                    alert(e);
                })

        }

    }

    // email validation
    validateEmail() {
        const { email } = this.state
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email)
        LayoutAnimation.easeInEaseOut()
        this.setState({ emailValid })
        emailValid || this.emailInput.shake()
        return emailValid
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("@assets/images/background.png")}
                    resizeMode="stretch"
                    style={styles.imagebg}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header title="" isStatus="back" navigation={this.props.navigation} />
                        <KeyboardAwareScrollView>
                            <View style={styles.titleView}>
                                <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFF' }}>FORGOT PASSWORD?</Text>
                            </View>
                            <View style={styles.descriptionView}>
                                <Text style={{ fontSize: 17, color: 'rgba(240, 240, 240, 0.8)' }}>Vestibulum rutrum quam vitae fringilla tincidunt. quam vitae fringilla tincidun uspendisse nec tortor urna.</Text>
                            </View>
                            <View style={styles.containerStyle}>
                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='envelope-o'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.emailInput = input)}
                                        // editable={this.props.reqData.profile.email ? false : true}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Enter your Email id"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.email}
                                        keyboardType={'email-address'}
                                        secureTextEntry={false}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                        errorMessage={this.state.emailValid ? null : "Please enter your email correctly"}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
                                    />
                                </View>
                            </View>
                            <MaterialButtonYellow
                                onPress={() => this.onPressLogin()}
                                style={styles.materialButtonYellow}>
                                {"SUBMIT"}
                            </MaterialButtonYellow>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imagebg: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('100.0%'),
        paddingLeft: 20,
        paddingRight: 20
    },
    titleView: {
        marginTop: hp('5.0%'),
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center"
    },
    descriptionView: {
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center"
    },
    containerStyle: {
        flexDirection: 'column',
        marginTop: 50,
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
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30
    },
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
});
