import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';

import * as firebase from 'firebase'
import { Notifications } from 'expo';
import GetPushToken from '../common/GetPushToken';
import { Audio } from 'expo-av';
import  languageJSON  from '../common/language';


export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  _setSettings = async () => {
    try {
      const settings=firebase.database().ref('settings');
      settings.once('value',settingsData=>{
          if(settingsData.val()){
            AsyncStorage.setItem('settings', JSON.stringify(settingsData.val()) );
          }
      });
    } catch (error) {
        console.log("Asyncstorage issue 5");
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync =  () => {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        if(user.displayName){
          const userData=firebase.database().ref('users/'+user.uid);
          userData.once('value',userData=>{
            if(userData.val()) {
              if(userData.val().usertype == 'rider'){
                GetPushToken();
                this._setSettings();
                this.props.navigation.navigate('Root'); 
              }
              else{ 
                firebase.auth().signOut();
                alert(languageJSON.valid_rider);
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
              this.props.navigation.navigate("Reg", { requireData: data })             
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
          this.props.navigation.navigate("Reg", { requireData: data })
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
      console.log("Unable to play shound");
    }
   };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.IndicatorStyle}>
        <ActivityIndicator  size="large" />
      </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
  IndicatorStyle:{
    flex:1, 
    justifyContent:"center"
  }
})