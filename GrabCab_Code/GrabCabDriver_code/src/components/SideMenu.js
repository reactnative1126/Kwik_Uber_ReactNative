import React from 'react';
import { Text, View, Dimensions, StyleSheet, FlatList, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import SideMenuHeader from './SideMenuHeader';

import { NavigationActions } from 'react-navigation';
import { colors } from '../common/theme';
import * as firebase from 'firebase'
import  languageJSON  from '../common/language';

var { height, width } = Dimensions.get('window');

export default class SideMenu extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            heightIphoneSix : false,
            heightIphoneFive: false,
            heightIphoneX :false,
            heightIphoneXsMax :false,
            sideMenuList: [
                {key: 1, name: languageJSON.booking_request, navigationName: 'DriverTripAccept', icon: 'home', type: 'font-awesome', child: 'firstChild'},
                {key: 2, name: languageJSON.profile_settings, navigationName: 'Profile', icon: 'ios-person-add', type: 'ionicon', child: 'secondChild'},
                {key: 4, name: languageJSON.incomeText, navigationName: 'MyEarning', icon: 'md-wallet', type: 'ionicon', child: 'ninethChild'},
                {key: 3, name: languageJSON.my_bookings, navigationName: 'RideList', icon: 'car-sports', type: 'material-community', child: 'thirdChild'},
                {key: 9, name: languageJSON.about_us, navigationName: 'About', icon: 'info', type: 'entypo', child: 'ninethChild'},
                {key: 10, name: languageJSON.sign_out, icon: 'sign-out', type: 'font-awesome', child: 'lastChild'}
            ],
            profile_image:null
        }
        
    }

    componentDidMount(){
        this.heightReponsive();
        var curuser = firebase.auth().currentUser.uid;
        const userData=firebase.database().ref('users/'+curuser);
        userData.on('value',currentUserData=>{
            if(currentUserData.val()){
                this.setState(currentUserData.val(),(res)=>{
                    if(currentUserData.val().driverActiveStatus == undefined){
                        userData.update({
                            driverActiveStatus:true
                        })
                    }
                });    
            }
        }) 
    }

    //check for device height(specially iPhones)
    heightReponsive(){
        if(height == 667 && width == 375){
            this.setState({heightIphoneSix :true})
        }
        else if(height == 568 && width == 320) {
            this.setState({heightIphoneFive :true})
        }
        else if(height == 375 && width == 812) {
            this.setState({heightIphoneX :true})
        }
        else if(height == 414 && width == 896) {
            this.setState({heightIphoneXsMax :true})
        }
    }

    //navigation to screens from side menu
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
          routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    //sign out and clear all async storage
    async signOut() {
        firebase.auth().signOut();
    }

    render(){
        return(
            <View style={styles.mainViewStyle}>
                <SideMenuHeader onPress={this.navigateToScreen("Profile") } headerStyle={styles.myHeader} userPhoto={this.state.profile_image} userEmail={this.state.email} userName ={this.state.firstName + ' '+ this.state.lastName}></SideMenuHeader> 
                
                <View style={styles.compViewStyle}>
                    <View style={[styles.vertialLine,{height: (width <= 320) ? width/1.53 : width/1.68 }]}></View>
                    <FlatList
                        data={this.state.sideMenuList}     
                        keyExtractor={(item,index) => index.toString()}   
                        style={{ marginTop: 20}}   
                        bounces = {false}
                        renderItem={({item, index}) => 
                            <TouchableOpacity
                            onPress={
                                (item.name==languageJSON.sign_out)? ()=>this.signOut() : 
                                this.navigateToScreen(item.navigationName) 
                                }
                            style={
                                [styles.menuItemView, 
                                {marginTop:  (index == this.state.sideMenuList.length - 1)  ? width/7 : 0}
                                ]
                            }>
                                <View style={styles.viewIcon}>
                                    <Icon
                                        name={item.icon}
                                        type={item.type}
                                        color={colors.WHITE}
                                        size={16}
                                        containerStyle={styles.iconStyle}
                                    />
                                </View>
                                <Text style={styles.menuName}>{item.name}</Text>
                            </TouchableOpacity>
                    } />
                </View>
                <View style={{opacity: 0.6}}>
                    <Image 
                        source={require('../../assets/images/logo.png')} 
                        style={{width: '100%'}}
                    />
                </View>
            </View>
        )
    }
}

//style for this component
const styles = StyleSheet.create({
    myHeader:{
        marginTop:0,   
    },
    vertialLine: {
        width: 1,
        backgroundColor: colors.GREY.btnPrimary,
        position: 'absolute',
        left: 22,
        top: 24
    },
    menuItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 18,
        flex: 1,
        paddingLeft: 10, 
        paddingRight: 10,
    },
    viewIcon: {
        width: 24,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.btnPrimary,
        left: 1
    },
    menuName: {
        color: colors.WHITE, 
        fontWeight: 'bold',
        marginLeft: 8,
        width:"100%"
    },
    mainViewStyle:{
        backgroundColor: colors.BLUE.dark, 
        height: '100%'
    },
    compViewStyle:{
        position: 'relative', 
        flex: 3
    },
    iconStyle:{ 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
})