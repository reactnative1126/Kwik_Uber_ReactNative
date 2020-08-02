//some default style used in the application

import { StyleSheet } from 'react-native';
import { theme } from './theme';

export default StyleSheet.create({
    buttonBlue:{
        height:50,
        width:160,
        backgroundColor:theme.BUTTON_BLUE,
    },
    buttonYellow:{
        height:50,
        width:160,
        backgroundColor:theme.BUTTON_YELLOW,
    },
    buttonPrimary:{
        height:50,
        width:160,
        backgroundColor:theme.BUTTON_PRIMARY
    },
    buttonText:{
        fontFamily: theme.FONT_ONE,
        fontSize:theme.FONT_SIZE_BUTTONS,
        color:theme.BUTTON_TEXT
    }
});