import React from 'react';
import { Registration } from '../components';
import { StyleSheet, View, Platform, AsyncStorage } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';
import { google_map_key } from '../common/key';
import API from '@services/API';

import { connect } from 'react-redux';
import { setUser } from '@modules/account/actions';

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async clickRegister(name, email, mobile, password) {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({})
    Geocoder.init(google_map_key);
    Geocoder.from({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }).then(json => {
      API.post('/user_register', {
        user_type: 'C',
        user_name: name,
        email: email,
        mobno: mobile,
        password: password,
        gender: 1,
        address: json.results[0].formatted_address,
        mode: Platform.OS
      }).then((resp) => {
        if (resp.data.success == 1) {
          AsyncStorage.setItem('LOGGED', 'true');
          AsyncStorage.setItem('USER', JSON.stringify(resp.data.data.userinfo));
          this.props.setUser(resp.data.data.userinfo);
          this.props.navigation.navigate('Root');
        } else (
          alert(resp.data.message)
        )
      })
    })
  }



  render() {
    const registrationData = this.props.navigation.getParam("requireData");
    return (
      <View style={styles.containerView}>
        <Registration reqData={registrationData ? registrationData : ""} onPressRegister={(name, email, mobile, password) => this.clickRegister(name, email, mobile, password)} navigation={this.props.navigation}></Registration>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerView: { flex: 1 },
  textContainer: { textAlign: "center" },
});

const mapDispatchToProps = dispatch => {
  return {
    setUser: (data) => {
      dispatch(setUser(data))
    }
  }
}
export default connect(undefined, mapDispatchToProps)(RegistrationPage)