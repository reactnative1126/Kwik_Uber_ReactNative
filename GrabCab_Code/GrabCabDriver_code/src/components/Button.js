import React from 'react';
import { 
    StyleSheet,
    Text,
    TouchableOpacity,
  } from 'react-native';
import { colors } from '../common/theme';


export default class Button extends React.Component {
  render() {
    const { style, children, btnClick, buttonStyle } = this.props;
    return (
        <TouchableOpacity
            style={[styles.button,style]}
            onPress={btnClick}
        >
            <Text style={[styles.textStyle, buttonStyle]}>{children}</Text>
        </TouchableOpacity>
    );
  }
}

//style for this component
const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        justifyContent:'center',
        padding: 10,
        borderRadius:5
    },
    textStyle:{
        color: colors.WHITE,
        width:"100%",
        textAlign: "center"
    }
});
