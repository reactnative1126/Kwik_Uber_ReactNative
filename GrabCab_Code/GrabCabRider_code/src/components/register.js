import React from 'react';
import {View, Text, Dimensions,Modal, ScrollView, KeyboardAvoidingView, Image, TouchableWithoutFeedback, LayoutAnimation, Platform} from 'react-native';
import Background from './Background';
import { Icon, Avatar,Button, Header, Input } from 'react-native-elements'
import { colors } from '../common/theme';
import * as firebase from 'firebase'; //Database
var {  height } = Dimensions.get('window');
import  languageJSON  from '../common/language';
export default class Registration extends React.Component {
    
     constructor(props){
        super(props);
        this.state={
          fname:this.props.reqData?this.props.reqData.profile.first_name:'',
          lname:this.props.reqData?this.props.reqData.profile.last_name:'',
          email:this.props.reqData?this.props.reqData.profile.email:'',
          mobile:this.props.reqData?this.props.reqData.profile.mobile:'',
          refferalId:'',

          fnameValid: true,
          lnameValid: true,
          mobileValid: true,
          emailValid: true,
          reffralIdValid:true,
          loadingModal:false
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
        const mobileValid = (mobile.length >0)
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

  
    //register button press for validation
    onPressRegister(){
        const { onPressRegister } = this.props;
        LayoutAnimation.easeInEaseOut();
        const fnameValid = this.validateFirstName();
        const lnameValid = this.validateLastname();
        const emailValid = this.validateEmail();
        const mobileValid = this.validateMobile();
        
       if ( fnameValid && lnameValid && emailValid && mobileValid) {
           
           if(this.state.refferalId != ''){
              this.setState({loadingModal:true})
               const userRoot=firebase.database().ref('users/');
               userRoot.once('value',userData=>{
                   if(userData.val()){
                       let allUsers = userData.val();
                       var flag = false;
                       for(key in allUsers){
                           if(allUsers[key].refferalId){
                               if(this.state.refferalId.toLowerCase() == allUsers[key].refferalId){
                                   flag = true;
                                   var referralVia = {
                                       userId:key,
                                       refferalId:allUsers[key].refferalId
                                   }
                                   break;
                               }else{
                                   flag = false;
                               }
                           }
                       }
                       if(flag == true){            
                         this.setState({reffralIdValid :true,loadingModal:false});
                         onPressRegister( this.state.fname, this.state.lname, this.state.email, this.state.mobile, true,referralVia);
                         this.setState({fname:'', lname:'',email: '', mobile:'',  password: '', confPassword: '',refferalId:''})
                       }else{     
                           this.refferalInput.shake();
                           this.setState({reffralIdValid :false,loadingModal:false});
                       }
                   }
                })
    
           }else{
               //refferal id is blank
                onPressRegister( this.state.fname, this.state.lname, this.state.email, this.state.mobile, false, null);
                this.setState({fname:'', lname:'',email: '', mobile:'',refferalId:''})
           }
           
        }
    }
    
    loading(){
     return(
        <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.loadingModal}
                onRequestClose={() => {
                this.setState({loadingModal:false})
            }}
            >
            <View style={{flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                <View style={{width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70}}> 
                <View style={{ alignItems: 'center',flexDirection:'row',flex:1,justifyContent:"center"}}>
                     <Image
                        style={{width:80,height:80,backgroundColor:colors.TRANSPARENT}}
                        source={require('../../assets/images/loader.gif')}
                        />
                   <View style={{flex:1}}>
                        <Text style={{color:"#000",fontSize:16,}}>{languageJSON.refferal_code_validation_modal}</Text>
                    </View>
                </View>
                </View>
            </View>
            </Modal>
     )
    }

    render(){

        const { onPressBack, loading }=this.props

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
                            <Text style={styles.headerStyle}>{languageJSON.registration_title}</Text>

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
                                    editable={this.props.reqData.profile.first_name?false:true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.first_name_placeholder}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.fname}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({fname: text})}}
                                    errorMessage={this.state.fnameValid ? null : languageJSON.first_name_blank_error}
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
                                    editable={this.props.reqData.profile.last_name?false:true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.last_name_placeholder}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.lname}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({lname: text})}}
                                    errorMessage={this.state.lnameValid ? null : languageJSON.last_name_blank_error}
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
                                    name='mobile-phone'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={40}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.mobileInput = input)}
                                    editable={this.props.reqData.profile.mobile?false:true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.mobile_no_placeholder}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.mobile}
                                    keyboardType={'number-pad'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({mobile: text})}}
                                    errorMessage={this.state.mobileValid ? null : languageJSON.mobile_no_blank_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateMobile(); this.passwordInput.focus()}}
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
                                    editable={this.props.reqData.profile.email?false:true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.email_placeholder}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.email}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({email: text})}}
                                    errorMessage={this.state.emailValid ? null : languageJSON.valid_email_check}
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
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />

                                 <Input
                                    ref={input => (this.refferalInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={languageJSON.referral_id_placeholder}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.refferalId}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({refferalId: text})}}
                                    errorMessage={this.state.reffralIdValid == true ? null : languageJSON.refferal_id_not_match_error}
                                    secureTextEntry={false}
                                    blurOnSubmit={true}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={()=>{this.onPressRegister()}}
                                    title={languageJSON.register_button}
                                    loading={loading}
                                    titleStyle={styles.buttonTitle}
                                    buttonStyle={styles.registerButton}
                                />
                            </View>
                            <View style={styles.gapView}/>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                {this.loading()}
            </Background>
        ); 
    }
};

const styles={
    headerContainerStyle: { 
        backgroundColor: colors.TRANSPARENT, 
        borderBottomWidth: 0 ,
        marginTop:0
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
        height:32,
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
        marginTop:10,
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
}