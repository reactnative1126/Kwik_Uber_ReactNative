import React from 'react';
import { StyleSheet,
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import {Button, Header} from 'react-native-elements';
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';
import * as firebase from 'firebase'
import { RequestPushMsg } from '../common/RequestPushMsg';

export default class DriverTripComplete extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            starCount: 3.5,
            title: 'John Dasgupta',
            currency:{
                code:'',
                symbol:''
            }
        }
        this._retrieveCurrency();
    }

    _retrieveCurrency = async () => {
        try {
          const value = await AsyncStorage.getItem('currency');
          if (value !== null) {
            this.setState({currency:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue");
        }
    };

    componentWillMount() {
        const allDetails = this.props.navigation.getParam('allDetails');
        const trip_cost = this.props.navigation.getParam('trip_cost');
        const trip_end_time = this.props.navigation.getParam('trip_end_time');
        this.setState({
            rideDetails: allDetails,
            region: {
                latitude: allDetails.pickup.lat,
                longitude: allDetails.pickup.lng,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            curUid: firebase.auth().currentUser.uid,
            trip_cost: trip_cost,
            trip_end_time: trip_end_time
        })
        
    }

    //done button press function
    onPressDone(item) {
        var data = {
            payment_status:"WAITING",
        };

        var riderData = {
            payment_status:"WAITING",
        };
        //var bookingId = item.bookingId?item.bookingId:item.bookingUid;
        let dbRef = firebase.database().ref('users/' + this.state.curUid + '/my_bookings/' + item.bookingId + '/');
        dbRef.update(data).then(()=>{
            firebase.database().ref('bookings/' + item.bookingId + '/').update(data).then(()=>{
                let userDbRef = firebase.database().ref('users/' + item.customer + '/my-booking/' + item.bookingId + '/')
                    userDbRef.update(riderData).then(()=>{
                        firebase.database().ref('users/' + this.state.curUid+'/').update({
                            queue:false
                        }).then(()=>{
                            this.props.navigation.navigate('DriverTripAccept')
                            this.sendPushNotification(item.customer,item.bookingId);
                        }) 
                        
                    })
                })
                })
    }

    //rating
    onStarRatingPress(rating) {
        this.setState({
          starCount: rating
        });
    }
      

    sendPushNotification(customerUID,bookingId){
        const customerRoot=firebase.database().ref('users/'+customerUID);
        customerRoot.once('value',customerData=>{
            if(customerData.val()){
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken?allData.pushToken:null, languageJSON.driver_requested_for_payment + bookingId)
            }
        })
    }
   
    render(){
        return(
            <View style={styles.mainViewStyle}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.on_trip}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInnerStyle}
                />
                <View style={styles.dateViewStyle}>
                        <Text style={styles.dateViewTextStyle}>{new Date(this.state.rideDetails.tripdate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
                </View>

                <View style={styles.rateViewStyle}>
                    <Text style={styles.rateViewTextStyle}>{this.state.trip_cost ? this.state.currency.symbol + parseFloat(this.state.trip_cost).toFixed(2) : this.state.currency.symbol + 0}</Text>
                </View>

                <View style={styles.addressViewStyle}>
                    <FlatList
                        data={[
                            {key: this.state.rideDetails.pickup.add, type: 'pickup'},
                            {key: this.state.rideDetails.drop.add, type: 'drop'}
                        ]}
                        renderItem={({item}) => 
                            <View style={styles.pickUpStyle}>
                            {item.type == "pickup" ? 
                                <View style={styles.greenDot}></View>
                                :<View style={styles.redDot}></View>
                            }
                                <Text style={styles.addressViewTextStyle}>{item.key}</Text>
                            </View>
                        }
                    />
                </View>
                <View style={styles.confBtnStyle}>
                    <Button 
                        title={languageJSON.request_payment}
                        titleStyle={{fontFamily: 'Roboto-Bold',}}
                        onPress={() => {
                            this.onPressDone(this.state.rideDetails);
                        }}
                        buttonStyle={styles.myButtonStyle}
                    />
                </View>
            </View>
        )
    }
}

//Screen Styling
const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerInnerStyle: {
        marginLeft:10,
        marginRight: 10
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    dateViewStyle: {        
        justifyContent:"center", 
        flex:1,
        marginTop: 20
    },
    dateViewTextStyle: {
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.btnPrimary, 
        fontSize: 26,
        textAlign:"center"
    },
    rateViewStyle: {
        alignItems: 'center',
        flex:3
    },
    rateViewTextStyle: {
        fontSize: 60,
        color: colors.BLACK,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        textAlign:"center"
    },
    addressViewStyle: {
        flex:4,
        flexDirection: 'row',
        paddingTop: 22,
        paddingLeft: 10,
        paddingRight: 10
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 19,
        fontFamily: 'Roboto-Regular',
        marginLeft:15, 
        marginRight:15,
        marginTop: 15, 
        lineHeight: 24
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    divider:{
        backgroundColor: colors.BLACK, 
        width:'20%',
        height: 1,
        top:'3.7%'
    },
    summaryText: {
        color: colors.GREY.btnPrimary,
        fontSize: 22,
        textAlign:"center",
        fontFamily: 'Roboto-Regular',
    },
    mainViewStyle:{
        flex: 1, 
        backgroundColor: colors.WHITE, 
        flexDirection: 'column', 
        //marginTop: StatusBar.currentHeight
    },
    pickUpStyle:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    tripMainView:{
        flex:3,
        flexDirection:"column", 
        justifyContent:"center"
    },
    ratingViewStyle:{
        flex:2,
        flexDirection:"row", 
        justifyContent:"center"
    },
    tripSummaryStyle:{
        flex:1, 
        flexDirection:"row", 
        justifyContent:'center'
    },
    confBtnStyle:{
        flex:5, 
        justifyContent:"flex-end",
        marginBottom:'5%', 
        alignItems: 'center'
    },
    myButtonStyle:{
        backgroundColor: colors.GREEN.default,
        width: 300,
        padding: 10,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 10
    },
    contStyle:{
        marginTop: 0, 
        paddingBottom: Platform.OS=='android'?5:0
    },summaryStyle:{
        justifyContent:"flex-end" 
    },
    dividerStyle:{
        justifyContent:"flex-start" 
    }
});