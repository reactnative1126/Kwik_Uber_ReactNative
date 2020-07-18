import React from 'react';
import { Text, View, Image,TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
//make a compontent
const SideMenuHeader = ({headerStyle,userPhoto,userName,userEmail}) =>{
   return (
        <View style={[styles.viewStyle,headerStyle]}>
            <TouchableOpacity style={styles.userImageView} >
                 <Image 
                    source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                    style={styles.imageStyle}
                />
            </TouchableOpacity>   
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
        </View>
   );
 
};

const styles = {
    viewStyle:{
        backgroundColor:colors.BLUE.dark,
        justifyContent:'center',
        alignItems:'center',
        height:180,
        paddingTop:Platform.OS=='ios'?20:StatusBar.currentHeight,
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
        fontSize: 15
    },
    iconViewStyle:{
        width:150,
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 4
    },
    emailStyle:{
        color: colors.WHITE, 
        fontSize: 13,
        marginLeft: 4,
        textAlign:'center'
    },
    imageStyle:{
        width: 80, 
        height:80
    }
}
//make the component available to other parts of the app
export default SideMenuHeader;