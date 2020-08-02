import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    LayoutAnimation,
    TouchableOpacity,
    View,
    Text,
    Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements'

import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            mobile: '',
            password: '',
            confirm: '',

            nameValid: true,
            emailValid: true,
            mobileValid: true,
            passwordValid: true,
            confirmValid: true,
        }
    }

    validateName() {
        const { name } = this.state
        const nameValid = (name.length > 0)
        LayoutAnimation.easeInEaseOut()
        this.setState({ nameValid })
        nameValid || this.nameInput.shake();
        return nameValid
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

    // mobile number validation
    validateMobile() {
        const { mobile } = this.state
        const mobileValid = (mobile.length > 0)
        LayoutAnimation.easeInEaseOut()
        this.setState({ mobileValid })
        mobileValid || this.mobileInput.shake();
        return mobileValid
    }

    // password validation
    validatePassword() {
        const { password } = this.state
        const passwordValid = (password.length > 5)
        LayoutAnimation.easeInEaseOut()
        this.setState({ passwordValid })
        passwordValid || this.passwordInput.shake()
        return passwordValid
    }

    // confirm validation
    validateConfirm() {
        const { password, confirm } = this.state
        const confirmValid = (password == confirm)
        LayoutAnimation.easeInEaseOut()
        this.setState({ confirmValid })
        confirmValid || this.confirmInput.shake()
        return confirmValid
    }

    //register button press for validation
    onRegister() {
        const { onRegister } = this.props;
        LayoutAnimation.easeInEaseOut();
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const mobileValid = this.validateMobile();
        const passwordValid = this.validatePassword();
        const confirmValid = this.validateConfirm();

        if (nameValid && emailValid && mobileValid && passwordValid && confirmValid) {
            this.setState({ mobile: "+" + this.state.mobile });
            onRegister(this.state.name, this.state.email, this.state.mobile, this.state.password);
        }
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                    <TouchableOpacity style={{ width: 20, height: 20 }} onPress={() => this.props.navigation.pop()}>
                        <Image style={{ width: 20, height: 20, tintColor: 'rgba(255, 255, 255, 1)' }} source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 14 }} />
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
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFF' }}>SIGN UP</Text>
                        </View>
                        <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? "padding" : "padding"}>
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
                                        ref={input => (this.nameInput = input)}
                                        editable={true}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Name"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.name}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ name: text }) }}
                                        errorMessage={this.state.nameValid ? null : "Please enter your name."}
                                        onSubmitEditing={() => { this.validateName(); this.emailInput.focus() }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
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
                                        ref={input => (this.emailInput = input)}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Email"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.email}
                                        keyboardType={'email-address'}
                                        secureTextEntry={false}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                        errorMessage={this.state.emailValid ? null : "Please enter your email correctly"}
                                        onSubmitEditing={() => { this.validateEmail(); this.mobileInput.focus() }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
                                    />
                                </View>

                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='phone'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.mobileInput = input)}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Phone"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.mobile}
                                        keyboardType={'number-pad'}
                                        secureTextEntry={false}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ mobile: text }) }}
                                        errorMessage={this.state.mobileValid ? null : language.mobile_no_blank_error}
                                        onSubmitEditing={() => { this.validateMobile(); this.passwordInput.focus() }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
                                    />
                                </View>

                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='unlock-alt'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.passwordInput = input)}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Password"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.password}
                                        secureTextEntry={true}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ password: text }) }}
                                        errorMessage={this.state.passwordValid ? null : "Please enter more 6 character"}
                                        onSubmitEditing={() => { this.validatePassword(); this.confirmInput.focus() }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
                                    />
                                </View>
                                <View style={styles.textInputContainerStyle}>
                                    <Icon
                                        name='unlock-alt'
                                        type='font-awesome'
                                        color={'rgba(240, 240, 240, 0.8)'}
                                        size={20}
                                        containerStyle={{ marginTop: 20 }}
                                    />
                                    <Input
                                        ref={input => (this.confirmInput = input)}
                                        editable={true}
                                        underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                        placeholder={"Confirm Password"}
                                        placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                        value={this.state.confirm}
                                        secureTextEntry={true}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => { this.setState({ confirm: text }) }}
                                        errorMessage={this.state.confirmValid ? null : "Please enter confirm password correctly"}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        inputStyle={styles.inputTextStyle}
                                        errorStyle={styles.errorMessageStyle}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.onRegister()} style={[styles.button, { width: wp('85.0%') }]}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>SIGNUP</Text>
                                </TouchableOpacity>
                                <View style={styles.gapView}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.pop()}>
                                        <Text style={{ color: '#FFFFFF' }}>Already register? Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        );
    }
};

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
    titleView: {
        width: '100%',
        marginTop: hp('5.0%'),
        marginBottom: hp('8.0%'),
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
    button: {
        backgroundColor: "#FDF75C",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        height: 45,
        borderRadius: 10,
        shadowColor: colors.BLACK,
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5
    },
    textInputStyle: {
        marginLeft: 10,
    },
    gapView: {
        height: 40,
        width: '100%',
        marginTop: 20,
        alignItems: 'center'
    },
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
});