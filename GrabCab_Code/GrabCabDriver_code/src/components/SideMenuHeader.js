import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';
//make a compontent
const SideMenuHeader = ({headerStyle, userPhoto, userName, userEmail, onPress}) =>{

   return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.viewStyle,headerStyle]}>
            <View style={styles.userImageView}>
                 <Image 
                    source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                    style={styles.imageStyle}
                />
            </View>   
            <View style={styles.headerTextStyle}>
                <Text style={styles.ProfileNameStyle}>{userName?userName.toUpperCase():""}</Text>
            </View>
            <View style={styles.iconViewStyle}>
                <Icon
                    name='mail-read'
                    type='octicon'
                    color={colors.WHITE}
                    size={16}
                />
                <Text style={styles.emailStyle}>{userEmail?userEmail.toLowerCase():""}</Text>
            </View>
        </TouchableOpacity>
   );

};

//style for this component
const styles = {
    viewStyle:{
        backgroundColor:colors.BLUE.dark,
        justifyContent:'center',
        alignItems:'center',
        height:200,
        paddingTop:20,
        shadowColor:colors.BLACK,
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.2,
        elevation:2,
        position:'relative',
        flexDirection:'column'
    },
    textStyle:{
        fontSize:20,
        color:colors.WHITE
    },
    headerTextStyle:{
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 10
    },
    iconStyle:{
       
    },
    userImageView: {
        width: 84,
        height: 84,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    ProfileNameStyle:{
        fontWeight: 'bold', 
        color: colors.WHITE, 
        fontSize: 18,
        textAlign:"center"
    },
    iconViewStyle:{
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 4
    },
    emailStyle:{
        color: colors.WHITE, 
        fontSize: 13,
        marginLeft: 4,
        textAlign:"center"
    },
    imageStyle:{
        width: 80, 
        height:80
    }
}
//make the component available to other parts of the app
export default SideMenuHeader;