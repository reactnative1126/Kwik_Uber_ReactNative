import React from 'react';
import {Registration } from '../components';
import {StyleSheet,View} from 'react-native';
import * as firebase from 'firebase'

export default class RegistrationPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          loading: false
        }
    }

    
    async clickRegister(fname, lname, email, mobile, viaRef,referralVia) {
        this.setState({loading: true})
        var regData = {
          firstName:fname,
          lastName:lname,
          mobile:mobile,
          email:email,
          usertype:'rider',
          signupViaReferral:viaRef,
          referarDetails:referralVia,
          createdAt:new Date().toISOString()
        }  

        firebase.auth().currentUser.updateProfile({
          displayName:regData.firstName + ' '+ regData.lastName,
        }).then(()=>{
          firebase.database().ref('users/').child(firebase.auth().currentUser.uid).set(regData).then(()=>{
                this.props.navigation.navigate('Root'); 
          });
        });
    }

  
    
  render() {
    const registrationData= this.props.navigation.getParam("requireData");
    console.log(registrationData);
    return (
        <View style={styles.containerView}>
            <Registration reqData={registrationData?registrationData:""} onPressRegister={(fname, lname, email, mobile, password,viaRef,referralVia)=>this.clickRegister(fname, lname, email, mobile, password,viaRef,referralVia)}  onPress={()=>{this.clickRegister()}} onPressBack={()=>{this.props.navigation.goBack()}} loading={this.state.loading}></Registration>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
});
