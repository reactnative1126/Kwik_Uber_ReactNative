import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    LayoutAnimation,
    ImageBackground,
    TouchableOpacity,
    View,
    Text,
    Image
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Input } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import { Loading } from '@components';
import { theme, colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

export default class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            emailValid: true,
            loading: false
        }
    }

    validateEmail() {
        const { email } = this.state
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email)
        LayoutAnimation.easeInEaseOut()
        this.setState({ emailValid })
        emailValid || this.emailInput.shake()
        return emailValid
    }

    onForgot = async () => {
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();
        if (emailValid) {
            this.setState({ loading: true });
            API.post('/forgot_password', {
                email: this.state.email
            }).then((resp) => {
                if (resp.data.success == 1) {
                    this.setState({ loading: false });
                    this.props.navigation.pop();
                } else {
                    this.setState({ loading: false });
                    this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                }
            }).catch((error) => {
                this.setState({ loading: false });
                this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
            });
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
                        <KeyboardAwareScrollView contentContainerStyle={{ alignItems: 'center' }}>
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
                            <TouchableOpacity onPress={() => this.onForgot()} style={[styles.button, { width: wp('85.0%') }]}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>SUBMIT</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
                <Loading loading={this.state.loading}/>
                <Toast ref="toast" position='top' positionValue={50} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8} />
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
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('100.0%'),
        paddingLeft: 20,
        paddingRight: 20
    },
    titleView: {
        width: wp('100.0%'),
        marginTop: hp('5.0%'),
        paddingLeft: 30,
        paddingRight: 30
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
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
});
