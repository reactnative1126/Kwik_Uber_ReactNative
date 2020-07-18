import React from 'react';
import { 
    StyleSheet,
    View,
  } from 'react-native';
import { DiverReg } from '../components';
import * as firebase from 'firebase'
import  languageJSON  from '../common/language';
export default class DriverRegistrationPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        loading: false
      }
    }

  //register button click after all validation
  async clickRegister(fname, lname, mobile, email, vehicleNum, vehicleName, image) {
    var regData = {
      firstName:fname,
      lastName:lname,
      mobile:mobile,
      email: email,
      vehicleNumber: vehicleNum,
      vehicleModel: vehicleName,
      licenseImage: image,
      usertype:'driver',
      approved: false,
      queue: false,
      createdAt: new Date().toISOString()
    }

    firebase.auth().currentUser.updateProfile({
      displayName:regData.firstName + ' '+ regData.lastName,
    }).then(()=>{
      firebase.database().ref('users/').child(firebase.auth().currentUser.uid).set(regData).then(()=>{
          firebase.auth().signOut();
          this.props.navigation.goBack();
          alert(languageJSON.account_successful_done);
      })
    });
  }

  //upload of picture
  async uploadmultimedia(fname, lname, mobile, email, vehicleNum, vehicleName, url){
    console.log(url)
    this.setState({loading: true})
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
       };
       xhr.onerror = function() {
         reject(new TypeError('Network request failed')); // error occurred, rejecting
       };
       xhr.responseType = 'blob'; // use BlobModule's UriHandler
       xhr.open('GET', url, true); // fetch the blob from uri in async mode
       xhr.send(null); // no initial data
     });
    
    if((blob.size/1000000)>2) {
      this.setState({loading: false},()=>{alert(languageJSON.image_size_error)})
    }
    else {
      var timestamp = new Date().getTime()
      var imageRef = firebase.storage().ref().child(`users/driver_licenses/`+timestamp+`/`);
      return imageRef.put(blob).then(() => {
          blob.close()
          return imageRef.getDownloadURL()
        }).then((dwnldurl) => {
          console.log(dwnldurl);
          this.clickRegister(fname, lname, mobile, email, vehicleNum, vehicleName, dwnldurl);
      })
    }

}


  render() {
    const registrationData= this.props.navigation.getParam("requireData");
    console.log(registrationData);
    return (
        <View style={styles.containerView}>
            <DiverReg reqData={registrationData?registrationData:""} onPressRegister={(fname, lname, mobile, email, vehicleNum, vehicleName, image)=>this.uploadmultimedia(fname, lname, mobile, email, vehicleNum, vehicleName, image)} onPressBack={()=>{this.props.navigation.goBack()}} loading={this.state.loading}></DiverReg>
        </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView:{ flex:1, 
    },
    textContainer:{textAlign:"center"},
});