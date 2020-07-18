import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import * as firebase from 'firebase'
import GetPushToken from '../common/GetPushToken/';
import { Notifications } from 'expo';
import  languageJSON  from '../common/language';
import { Audio } from 'expo-av';

export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _setCurrency = async () => {
    try {
      const value = await AsyncStorage.getItem('currency');
      if (value !== null) {
        return;
      }
      const currency=firebase.database().ref('currency');
      currency.once('value',currencyData=>{
          if(currencyData.val()){
            AsyncStorage.setItem('currency', JSON.stringify(currencyData.val()) );
          }
      });
    } catch (error) {
        console.log("Asyncstorage issue");
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync =  () => {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        if(user.displayName){
          const userData=firebase.database().ref('users/'+user.uid);
          userData.once('value',userData=>{
            if(userData.val()) {
              if(userData.val().usertype == 'driver' && userData.val().approved == true){
                this.props.navigation.navigate('DriverRoot');
                GetPushToken();
               }
               else {
                firebase.auth().signOut();
                this.props.navigation.navigate("Login");
                alert(languageJSON.driver_account_approve_err);
               }
            }else{
              var data = {};
              data.profile = {
                name:user.name?user.name:'',
                last_name:user.last_name?user.last_name:'',
                first_name:user.first_name?user.first_name:'',
                email:user.email?user.email:'',
                mobile:user.phoneNumber?user.phoneNumber.replace('"',''):'',
              };
              this.props.navigation.navigate("DriverReg", { requireData: data })             
            }
          })
        }else{
          var data = {};
          data.profile = {
            name:user.name?user.name:'',
            last_name:user.last_name?user.last_name:'',
            first_name:user.first_name?user.first_name:'',
            email:user.email?user.email:'',
            mobile:user.phoneNumber?user.phoneNumber.replace('"',''):'',
          };
          this.props.navigation.navigate("DriverReg", { requireData: data })
        }
      }else{
        this.props.navigation.navigate('Login');
      }
    })
  };

  componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  
 _handleNotification = async (notification) => {
    alert(notification.data.msg);
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../../assets/sounds/car_horn.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.log("Unable to play sound");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.IndicatorStyle}>
        <ActivityIndicator />
      </View>
    );
  }
}

//style for this component
const styles = StyleSheet.create({
  IndicatorStyle:{
    flex:1, 
    justifyContent:"center"
  }
})