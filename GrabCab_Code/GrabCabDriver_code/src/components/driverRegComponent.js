import React from 'react';
import {View, Text, Dimensions, ScrollView, StatusBar, KeyboardAvoidingView, Image, TouchableWithoutFeedback, LayoutAnimation, Platform, TouchableOpacity} from 'react-native';
import Background from './Background';
import { Icon, Button, Header, Input } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';
var { height } = Dimensions.get('window');

export default class DiverReg extends React.Component {
    
     constructor(props){
        super(props);
        this.state={
          fname:'',
          lname:'',
          email:'',
          mobile:this.props.reqData?this.props.reqData.profile.mobile:'',
          vehicleNum:'',
          vehicleName: '',
          image: null,

          fnameValid: true,
          lnameValid: true,
          mobileValid: true,
          emailValid: true,
          vehicleNumValid: true,
          vehicleNameValid: true,
          imageValid: true,
        } 
      }

    // first name validation
    validateFirstName() {
        const { fname } = this.state
        const fnameValid = fname.length > 0
        LayoutAnimation.easeInEaseOut()
        this.setState({ fnameValid })
        fnameValid || this.fnameInput.shake();
        return fnameValid
    }

    // last name validation
    validateLastname() {
        const { lname } = this.state
        const lnameValid = lname.length > 0
        LayoutAnimation.easeInEaseOut()
        this.setState({ lnameValid })
        lnameValid || this.lnameInput.shake();
        return lnameValid
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

    // vehicle name validation
    validateVehicleName() {
        const { vehicleName } = this.state;
        const vehicleNameValid = vehicleName.length >=1
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
        const vehicleNumValid = vehicleNum.length >=1
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
    CapturePhoto = async () =>{
        //permission check
        const { status:cameraStatus } =  await Permissions.askAsync(Permissions.CAMERA)
        const { status:cameraRollStatus } =  await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
            let result =  await ImagePicker.launchImageLibraryAsync({
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
    cancelPhoto = ()=>{
        this.setState({ image: null });
    }

    //register button press for validation
    onPressRegister(){
        const { onPressRegister } = this.props;
        LayoutAnimation.easeInEaseOut();
        const fnameValid = this.validateFirstName();
        const lnameValid = this.validateLastname();
        const mobileValid = this.validateMobile();
        const emailValid = this.validateEmail();
        const imageValid = this.validateImage();
        const vehicleNumValid = this.validateVehicleNum();
        const vehicleNameValid = this.validateVehicleName();
        
       if ( fnameValid && lnameValid && mobileValid && emailValid && vehicleNumValid && vehicleNameValid && imageValid ) {
            onPressRegister( this.state.fname, this.state.lname, this.state.mobile, this.state.email, this.state.vehicleNum, this.state.vehicleName, this.state.image);
        }
    }

    render(){
        const { onPressBack, loading }=this.props;
        let { image } = this.state;
        return(
            <Background>
                <Header 
                    backgroundColor={colors.TRANSPARENT}
                    leftComponent={{icon:'ios-arrow-back', type:'ionicon', color:colors.WHITE, size: 35, component: TouchableWithoutFeedback,onPress: onPressBack }}
                    containerStyle={styles.headerContainerStyle}
                    innerContainerStyles={styles.headerInnerContainer}
                />
                <ScrollView style={styles.scrollViewStyle}>
                    <View style={styles.logo}>
                        <Image source={require('../../assets/images/logo.png')} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS=='ios'?"padding":"padding"} style={styles.form}> 
                        <View style={styles.containerStyle}>
                            <Text style={styles.headerStyle}>{languageJSON.driver_registration}</Text>

                            <View style={styles.textInputContainerStyle}> 
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.fnameInput = input)}
                                    editable={true}
                                    returnKeyType={'next'}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.first_name}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.fname}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({fname: text})}}
                                    errorMessage={this.state.fnameValid ? null : languageJSON.first_name_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateFirstName(); this.lnameInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>  

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.lnameInput = input)}
                                    editable={true}
                                    returnKeyType={'next'}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.last_name}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.lname}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({lname: text})}}
                                    errorMessage={this.state.lnameValid ? null : languageJSON.last_name_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateLastname(); this.emailInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='envelope-o'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={23}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.emailInput = input)}
                                    editable={true}
                                    returnKeyType={'next'}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.email}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.email}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({email: text})}}
                                    errorMessage={this.state.emailValid ? null : languageJSON.email_blank_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateEmail(); this.mobileInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='mobile-phone'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={40}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.mobileInput = input)}
                                    editable={this.props.reqData.profile.mobile?false:true}
                                    returnKeyType={'done'}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.mobile}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.mobile}
                                    keyboardType={'numeric'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({mobile: text})}}
                                    errorMessage={this.state.mobileValid ? null : languageJSON.mobile_no_blank_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateMobile(); this.vehicleNameInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='ios-car'
                                    type={'ionicon'}
                                    color={colors.WHITE}
                                    size={25}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.vehicleNameInput = input)}
                                    editable={true}
                                    returnKeyType={'next'}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.vehicle_model_name}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.vehicleName}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({vehicleName: text})}}
                                    errorMessage={this.state.vehicleNameValid ? null : languageJSON.vehicle_model_name_blank_error}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateVehicleName(); ; this.vehicleNumInput.focus() }}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>

                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='numeric'
                                    type={'material-community'}
                                    color={colors.WHITE}
                                    size={20}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.vehicleNumInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.vehicle_reg_no}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.vehicleNum}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({vehicleNum: text})}}
                                    errorMessage={this.state.vehicleNumValid ? null : languageJSON.vehicle_number_blank_err}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateVehicleNum() }}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>

                            {
                                image?
                                <View style={styles.imagePosition}>
                                    <TouchableOpacity style={styles.photoClick} onPress={this.cancelPhoto}>
                                        <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                    </TouchableOpacity>
                                    <Image source={{ uri: image }} style={styles.photoResult} resizeMode={'cover'}/>
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
                                            <View style={styles.myView1}/>
                                        </View>
                                        <View style={styles.myView2}> 
                                            <View style={styles.myView3}>
                                                <Text style={styles.textStyle}>{languageJSON.image_size_warning}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }

                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={()=>{this.onPressRegister()}}
                                    title={languageJSON.reg_no}
                                    loading={loading}
                                    titleStyle={styles.buttonTitle}
                                    buttonStyle={styles.registerButton}
                                />
                            </View>
                            <View style={styles.gapView}/>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Background>
        ); 
    }
};

//style for this component
const styles={
    headerContainerStyle: { 
        backgroundColor: colors.TRANSPARENT, 
        borderBottomWidth: 0,
    },
    headerInnerContainer: {
        marginLeft:10, 
        marginRight: 10
    },
    inputContainerStyle: {
        borderBottomWidth:1,
        borderBottomColor: colors.WHITE
    },
    textInputStyle:{
        marginLeft:10,
    },
    iconContainer: {
        paddingTop:8
    },
    gapView: {
        height:40,
        width:'100%'
    },
    buttonContainer: { 
        flexDirection:'row',
        justifyContent:'center',
        borderRadius:40
    },
    registerButton: {
        backgroundColor: colors.SKY,
        width: 180,
        height: 50,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        marginTop:30,
        borderRadius:15,
    },
    buttonTitle: { 
        fontSize:16 
    },
    inputTextStyle: {
        color:colors.WHITE,
        fontSize:13,
        marginLeft:0,
        height:32
    },
    errorMessageStyle: { 
        fontSize: 12, 
        fontWeight:'bold',
        marginLeft:0 
    },
    containerStyle:{
        flexDirection:'column',
        marginTop:20
    },
    form: {
        flex: 1,
    },
    logo:{
        width:'100%',
        justifyContent:"flex-start",
        marginTop: 10,
        alignItems:'center', 
    },
    scrollViewStyle:{
        height: height
    },
    textInputContainerStyle:{
        flexDirection:'row', 
        alignItems: "center",  
        marginLeft:20,
        marginRight:20,
        padding: 15,

    },
    headerStyle:{
        fontSize:18,
        color:colors.WHITE,
        textAlign:'center',
        flexDirection:'row',
        marginTop:0
    },
    capturePhoto:{
        width: '80%',
        alignSelf: 'center',
        flexDirection:'column',
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:colors.WHITE,
        marginLeft:20,
        marginRight:20,
        paddingTop:15,
        paddingBottom:10,
        marginTop:15
    },
    capturePhotoTitle:{
        color: colors.BLACK,
        fontSize:14,
        textAlign:'center',
        paddingBottom:15,
        
    },
    errorPhotoTitle: {
        color:colors.RED,
        fontSize:13,
        textAlign:'center',
        paddingBottom:15,
    },
    photoResult: {
        alignSelf: 'center',
        flexDirection:'column',
        justifyContent:'center',
        borderRadius:10,
        marginLeft:20,
        marginRight:20,
        paddingTop:15,
        paddingBottom:10,
        marginTop:15,
        width: '80%', 
        height: height/4
    },
    imagePosition: {
        position:'relative'
    },
    photoClick: {
        paddingRight:48,
        position:'absolute',
        zIndex:1,
        marginTop:18,
        alignSelf:'flex-end'
    },
    capturePicClick: {
        backgroundColor:colors.WHITE, 
        flexDirection: 'row',
        position:'relative',
        zIndex:1
    },
    imageStyle:{ 
        width: 30, 
        height: height/15
    },
    flexView1:{
        flex:12
    },
    imageFixStyle:{
        flex:1, 
        alignItems: 'center', 
        justifyContent:'center'
    },
    imageStyle2:{ 
        width: 150, 
        height: height/15 
    },
    myView:{
        flex:2, 
        height:50, 
        width: 1, 
        alignItems: 'center'
    },
    myView1:{
        height: height/18,
        width: 1.5, 
        backgroundColor:colors.GREY.btnSecondary, 
        alignItems: 'center',
        marginTop: 10
    },
    myView2:{
        flex:20, 
        alignItems: 'center', 
        justifyContent:'center'
    },
    myView3:{ 
        flex: 2.2, 
        alignItems: 'center', 
        justifyContent:'center' 
    },
    textStyle:{ 
        color: colors.GREY.btnPrimary, 
        fontFamily: 'Roboto-Bold', 
        fontSize: 13
    }
}