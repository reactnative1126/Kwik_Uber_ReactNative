// import React from "react";
import React, { Component } from "react";
import { View, StyleSheet} from "react-native";
import { Avatar, Input, Icon } from "react-native-elements";
import { colors } from "../common/theme";
import Layout from '../constants/Layout';

const iconHeight = Layout.window.height / 14;
const iconWidth = Layout.window.height / 14;
const iconRadius = iconWidth / 2;

// const CustomCommentSend = ({
  export default class CustomCommentSend extends Component {
    constructor(props) {
      super(props);
      this.state = {

      };
    }
 
  render() {
    const {title,
      value,
      onChangeText,
      sendBtnClick,
      avatar} =this.props
  return (
    <View style={styles.headercontainer}>
      <View style={styles.header_mainView}>
        <View style={styles.header_subView_two}>
          <Input
            // autoFocus={true}
            multiline={true}
            numberOfLines={4}
            allowFontScaling={false}
            maxLength={200}
            onChangeText={onChangeText}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder="Write your messege"
            value={value}
            rightIconContainerStyle={styles.rightIconContainerStyle}
            rightIcon={
              <Icon
                type="font-awesome"
                name="send"
                size={20}
                color={colors.BLACK}
                onPress={sendBtnClick}
              />
            }
          />
        </View>
      </View>
     
    </View>
  
  );
};
  }
//Screen Styling
const styles = StyleSheet.create({
  headercontainer: {
    backgroundColor: colors.WHITE
  },
  header_mainView: {
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 8,
    marginRight: 8,
    left: 10
  },
  header_subView_one: { flex: 1, justifyContent: "center" },
  avatarcontainer: {
    height: iconHeight,
    width: iconWidth,
    borderRadius: iconRadius
  },
  header_subView_two: {
    flex: 5,
    justifyContent: "center",
    marginLeft: 0
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: colors.GREY.nobel,
    borderRadius: 10,
    height: 50,
    paddingLeft: 5
  },
  rightIconContainerStyle: {
    width: 35,
    marginRight: 4,
    borderLeftWidth: 0.8,
    borderLeftColor: colors.GREY.bright_grey
  },
  container: {
    flex: 1
  },
  contentContainerStyle: {
    flexGrow: 1
  },
});