import React, { Component } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity,TextInput } from "react-native";
import { Icon, Button } from "react-native-elements";
import { colors } from "../common/theme";
import  languageJSON  from '../common/language';
export default class TripStartModal extends Component {
constructor(props) {
super(props);
this.state = {};
}
enterCode(){
        const { enterCode } = this.props;
        enterCode('entercode')
    }

render() {
const { requestmodalclose, modalvisable,onChangeText } = this.props;
return (
<Modal
visible={modalvisable}
animationType={"slide"}
transparent={true}
onRequestClose={requestmodalclose}
>
<View style={styles.container}>
  <View style={styles.modalContainer}>
      <View style={styles.blankViewStyle}>
        <Icon
        name="close"
        type="fontawesome"
        color={colors.BLACK}
        onPress={requestmodalclose}
        size={30}
        />
      </View>
      <View style={styles.modalContainerViewStyle}>
          <TextInput
              // value={this.state.inputmessage}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder={languageJSON.enter_code}
              onChangeText={onChangeText}
              maxLength={5}
            />
            <Button
              title={languageJSON.submit}
              onPress={()=>this.enterCode()}
          />
      </View>
  </View>
</View>
</Modal>
);
}
}
//Screen Styling
const styles = StyleSheet.create({
container: {
  flex: 1,
  width: "100%",
  height: "80%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
  paddingTop: 120
},
modalContainer: {
  height: 200,
  backgroundColor: colors.WHITE,
  width: "80%",
  borderRadius: 10,
  elevation: 15
},
crossIconContainer: {
  flex: 1,
  left: "40%"
},
blankViewStyle: {
  flex: 1,
  flexDirection: "row",
  alignSelf:'flex-end',
  marginTop:15,
  marginRight:15
},
modalHeaderStyle: {
textAlign: "center",
fontSize: 20,
paddingTop: 10
},
modalContainerViewStyle: {
  flex: 9,
  alignItems: "center",
  justifyContent:"center"
},
itemsViewStyle: {
  flexDirection: "column",
// justifyContent: "space-between"
},
textStyle: {
  fontSize: 20
},
input: {
    fontSize: 20,
    marginBottom:20,
    borderColor:'#D2D2D2',
    borderWidth:1,
    borderRadius:8,
    width:"80%",
    paddingTop:8,
    paddingBottom:8,
    paddingRight:10,
    paddingLeft:10,
    textAlign:'center'
  },
});