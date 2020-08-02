import React from 'react';
import {
    SafeAreaView,
    ImageBackground,
    View,
    Text,
    Dimensions,
    Modal,
    Image,
    LayoutAnimation,
    Platform,
    TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Button, Input } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
var { height } = Dimensions.get('window');

import * as firebase from 'firebase';
import languageJSON from '../common/language';

import { colors } from '../common/theme';
import { Header } from '@components';
import MaterialButtonYellow from "../components/MaterialButtonYellow";


export default class DiverReg extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.reqData ? this.props.reqData.profile.first_name + this.props.reqData.profile.first_name : '',
            email: this.props.reqData ? this.props.reqData.profile.email : '',
            mobile: this.props.reqData ? this.props.reqData.profile.mobile : '',
            password: '',
            confirm: '',
            vehicleNum: '',
            vehicleName: '',
            image: null,

            nameValid: true,
            mobileValid: true,
            emailValid: true,
            passwordValid: true,
            confirmValid: true,
            vehicleNumValid: true,
            vehicleNameValid: true,
            imageValid: true,

            loadingModal: false
        }
    }

    // first name validation
    validateName() {
        const { name } = this.state
        const nameValid = name.length > 0
        LayoutAnimation.easeInEaseOut()
        this.setState({ nameValid })
        nameValid || this.nameInput.shake();
        return nameValid
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

    // vehicle name validation
    validateVehicleName() {
        const { vehicleName } = this.state;
        const vehicleNameValid = vehicleName.length >= 1
        LayoutAnimation.easeInEaseOut()
        this.setState({ vehicleNameValid })
        vehicleNameValid || this.vehicleNameInput.shake();
        return vehicleNameValid
    }

    // vehicle number validation
    validateVehicleNum() {
        const { vehicleNum } = this.state;
        var regx3 = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/
        // const vehicleNumValid = regx3.test(vehicleNum)
        const vehicleNumValid = vehicleNum.length >= 1
        LayoutAnimation.easeInEaseOut()
        this.setState({ vehicleNumValid })
        vehicleNumValid || this.vehicleNumInput.shake();
        return vehicleNumValid
    }

    // image upload validation
    validateImage() {
        const { image } = this.state;
        const imageValid = (image != null);
        LayoutAnimation.easeInEaseOut()
        this.setState({ imageValid })
        imageValid;
        return imageValid
    }

    //imagepicker for license upload
    CapturePhoto = async () => {
        //permission check
        const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA)
        const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                // base64: true,
                quality: 1.0
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
        } else {
            throw new Error('Camera permission not granted');
        }
    }

    //upload cancel
    cancelPhoto = () => {
        this.setState({ image: null });
    }

    //register button press for validation
    onPressRegister() {
        const { onPressRegister } = this.props;
        LayoutAnimation.easeInEaseOut();
        const nameValid = this.validateName();
        const mobileValid = this.validateMobile();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        const confirmValid = this.validateConfirm();
        const imageValid = this.validateImage();
        const vehicleNumValid = this.validateVehicleNum();
        const vehicleNameValid = this.validateVehicleName();

        if (nameValid && mobileValid && emailValid && passwordValid && confirmValid && vehicleNumValid && vehicleNameValid && imageValid) {
            this.setState({ loadingModal: true });
            this.setState({ mobile: "+" + this.state.mobile });
            const userRoot = firebase.database().ref('users');
            userRoot.once('value', userData => {
                if (userData.val()) {
                    let allUsers = userData.val();
                    var flag = false;
                    for (key in allUsers) {
                        if (this.state.email == allUsers[key].email || this.state.mobile == allUsers[key].mobile) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == true) {
                        this.setState({ loadingModal: false });
                        alert("Mobile or Email is already exist.");
                        // this.setState({ name: '', email: '', mobile: '', password: '', confirm: ''});
                    } else {
                        onPressRegister(this.state.name, this.state.mobile, this.state.email, this.state.password, this.state.vehicleNum, this.state.vehicleName, this.state.image);
                        this.setState({ loadingModal: false });
                    }
                }
            })
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
                                <Text style={{ color: "#000", fontSize: 16, }}>{languageJSON.refferal_code_validation_modal}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        const { navigation } = this.props;
        let { image } = this.state;
        return (
            <ImageBackground
                source={require("../../assets/images/background.png")}
                resizeMode="stretch"
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="Login" isStatus="back" navigation={navigation} />
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
                                    // editable={this.props.reqData.profile.first_name ? false : true}
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
                                    // editable={this.props.reqData.profile.email ? false : true}
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
                                    // editable={this.props.reqData.profile.mobile ? false : true}
                                    underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                    placeholder={"Phone"}
                                    placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                    value={this.state.mobile}
                                    keyboardType={'number-pad'}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onChangeText={(text) => { this.setState({ mobile: text }) }}
                                    errorMessage={this.state.mobileValid ? null : languageJSON.mobile_no_blank_error}
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
                                    // editable={this.props.reqData.profile.email ? false : true}
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
                                    onSubmitEditing={() => { this.validateConfirm(); this.vehicleNameInput.focus() }}
                                    errorMessage={this.state.confirmValid ? null : "Please enter confirm password correctly"}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                    inputStyle={styles.inputTextStyle}
                                    errorStyle={styles.errorMessageStyle}
                                />
                            </View>

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='ios-car'
                                    type={'ionicon'}
                                    color={'rgba(240, 240, 240, 0.8)'}
                                    size={20}
                                    containerStyle={{ marginTop: 20 }}
                                />
                                <Input
                                    ref={input => (this.vehicleNameInput = input)}
                                    editable={true}
                                    underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                    placeholder={"Vehicle Model Name"}
                                    placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                    returnKeyType={'next'}
                                    value={this.state.vehicleName}
                                    onChangeText={(text) => { this.setState({ vehicleName: text }) }}
                                    errorMessage={this.state.vehicleNameValid ? null : languageJSON.vehicle_model_name_blank_error}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateVehicleName();; this.vehicleNumInput.focus() }}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                    inputStyle={styles.inputTextStyle}
                                    errorStyle={styles.errorMessageStyle}
                                />
                            </View>

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='numeric'
                                    type={'material-community'}
                                    color={'rgba(240, 240, 240, 0.8)'}
                                    size={20}
                                    containerStyle={{ marginTop: 20 }}
                                />
                                <Input
                                    ref={input => (this.vehicleNumInput = input)}
                                    editable={true}
                                    underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                    placeholder={"Vehicle Registration Number"}
                                    placeholderTextColor={'rgba(240, 240, 240, 0.8)'}
                                    value={this.state.vehicleNum}
                                    onChangeText={(text) => { this.setState({ vehicleNum: text }) }}
                                    errorMessage={this.state.vehicleNumValid ? null : languageJSON.vehicle_number_blank_err}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateVehicleNum() }}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                    inputStyle={styles.inputTextStyle}
                                    errorStyle={styles.errorMessageStyle}
                                />
                            </View>

                            {
                                image ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={this.cancelPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: image }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                this.state.imageValid ?
                                                    <Text style={styles.capturePhotoTitle}>{languageJSON.upload_driving_lisence}</Text>
                                                    :
                                                    <Text style={styles.errorPhotoTitle}>{languageJSON.upload_driving_lisence}</Text>
                                            }

                                        </View>
                                        <View style={styles.capturePicClick}>
                                            <TouchableOpacity style={styles.flexView1} onPress={this.CapturePhoto}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{languageJSON.image_size_warning}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                            }

                            <MaterialButtonYellow
                                onPress={() => { this.onPressRegister() }}
                                style={styles.materialButtonYellow}
                            >{"SIGNUP"}</MaterialButtonYellow>
                            <View style={styles.gapView}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}>
                                    <Text style={{ color: '#FFFFFF' }}>Already register? Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.loading()}
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </ImageBackground>
        );
    }
};

//style for this component
const styles = {
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
    materialButtonYellow: {
        height: 45,
        marginTop: 20
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
    imagePosition: {
        position: 'relative'
    },


    capturePhoto: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: colors.WHITE,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 15,
        paddingBottom: 10,
        marginTop: 15
    },
    capturePhotoTitle: {
        color: colors.BLACK,
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 15,

    },
    errorPhotoTitle: {
        color: colors.RED,
        fontSize: 13,
        textAlign: 'center',
        paddingBottom: 15,
    },
    photoResult: {
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 15,
        paddingBottom: 10,
        marginTop: 15,
        width: '80%',
        height: height / 4
    },
    photoClick: {
        paddingRight: 48,
        position: 'absolute',
        zIndex: 1,
        marginTop: 18,
        alignSelf: 'flex-end'
    },
    capturePicClick: {
        backgroundColor: colors.WHITE,
        flexDirection: 'row',
        position: 'relative',
        zIndex: 1
    },
    imageStyle: {
        width: 30,
        height: height / 15
    },
    flexView1: {
        flex: 12
    },
    imageFixStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle2: {
        width: 150,
        height: height / 15
    },
    myView: {
        flex: 2,
        height: 50,
        width: 1,
        alignItems: 'center'
    },
    myView1: {
        height: height / 18,
        width: 1.5,
        backgroundColor: colors.GREY.btnSecondary,
        alignItems: 'center',
        marginTop: 10
    },
    myView2: {
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    myView3: {
        flex: 2.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: colors.GREY.btnPrimary,
        fontFamily: 'Roboto-Bold',
        fontSize: 13
    }
}