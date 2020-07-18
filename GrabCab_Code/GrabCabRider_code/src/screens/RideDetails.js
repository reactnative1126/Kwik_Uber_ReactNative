import React from 'react';
import { StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform,
    Linking,
    AsyncStorage
 } from 'react-native';
import Polyline from '@mapbox/polyline';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Header, Rating, Avatar,Button } from 'react-native-elements';
import Dash from 'react-native-dash';
import { colors } from '../common/theme';
var { width } = Dimensions.get('window');
import * as firebase from 'firebase'; //Database
import { google_map_key } from '../common/key';
import  languageJSON  from '../common/language';

export default class RideDetails extends React.Component{
    getRideDetails;
    constructor(props){
        super(props);
        
        this.state = {
            coords: [],
            intialregion: {},
            settings:{
                code:'',
                symbol:'',
                cash:false,
                wallet:false,
                braintree:false,
                stripe:false
            }
        }
        this.getRideDetails= this.props.navigation.getParam('data');
        console.log( this.getRideDetails)
    }

    _retrieveSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('settings');
          if (value !== null) {
            this.setState({settings:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue 11");
        }
      };

    componentDidMount(){
        if(this.getRideDetails){
            this.setState({
                intialregion:{
                latitude: this.getRideDetails.pickup.lat,
                longitude: this.getRideDetails.pickup.lng,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
                },
                paramData:this.getRideDetails,
            },()=>{
                console.log(this.state)
                this.getDirections('"'+this.state.paramData.pickup.lat+','+this.state.paramData.pickup.lng+'"', '"'+this.state.paramData.drop.lat+','+this.state.paramData.drop.lng+'"');
                this.forceUpdate();
            })
        }
        this._retrieveSettings();
    }

    // find your origin and destination point coordinates and pass it to our method.
    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${ google_map_key }`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords},()=>{
            })
            return coords
        }
        catch(error) {
            alert(error)
            return error
        }
    }


//call driver button press
onPressCall(phoneNumber){
    Linking.canOpenURL(phoneNumber).then(supported => {
        if (!supported) {
            console.log('Can\'t handle Phone Number: ' + phoneNumber);
        } else {
            return Linking.openURL(phoneNumber);
        }
    }).catch(err => console.error('An error occurred', err));
}
    //go back
    goBack(){
      this.props.navigation.goBack();
    }

    trackNow(data){
        console.log(data)
        if(data.status == 'ACCEPTED'){
            let bookingData = {
                bokkingId:data.bookingId,
                coords:data.coords,
            }
            this.props.navigation.navigate('BookedCab',{passData:bookingData});
        }else if(data.status == 'START'){
            this.props.navigation.navigate('trackRide',{data:data,bId:data.bookingId});
        }else{
            console.log('track not posible')
        }
    }


    PayNow(data){
     
        var curuser = firebase.auth().currentUser;
            this.setState({currentUser:curuser},()=>{
                const userData=firebase.database().ref('users/'+this.state.currentUser.uid );
                userData.once('value',userData=>{
                    if(userData.val()){
                        var udata = userData.val();
                        const bDataref=firebase.database().ref('users/'+this.state.currentUser.uid+'/my-booking/'+data.bookingId);
                        bDataref.once('value',bookingdetails=>{
                            if(bookingdetails.val()){
                                 bookingData = bookingdetails.val()
                                if(bookingData.payment_status == "WAITING" && bookingData.status == 'END'){
                                    //console.log(bookingData)
                                    bookingData.bookingKey = data.bookingId;
                                    bookingData.firstname = udata.firstName;
                                    bookingData.lastname = udata.lastName;
                                    bookingData.email = udata.email;
                                    bookingData.phonenumber = udata.mobile;
                                    this.props.navigation.navigate('CardDetails',{data:bookingData});
                                }
                            }
                        })
                    }
                })  
            })
    }

    render(){
        return(            
            <View style={styles.mainView}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'ios-arrow-back', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.goBack()} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.ride_details_page_title}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />  
                <ScrollView>
                    <View style={styles.mapView}>
                        <View style={styles.mapcontainer}>
                            <MapView style={styles.map} 
                                provider={PROVIDER_GOOGLE}
                                region={{
                                latitude:(this.state.intialregion.latitude?this.state.intialregion.latitude:22), 
                                longitude:(this.state.intialregion.longitude?this.state.intialregion.longitude:88), 
                                latitudeDelta: 0.9922,
                                 longitudeDelta: 1.9421
                                }}
                            >
                                <Marker
                                    coordinate={{latitude:this.state.paramData?(this.state.paramData.pickup.lat):0.00, longitude: this.state.paramData?(this.state.paramData.pickup.lng):0.00}}
                                    title={'marker_title_1'}
                                    description={this.state.paramData?this.state.paramData.pickup.add:null}
                                />

                                <Marker
                                    coordinate={{latitude: this.state.paramData?(this.state.paramData.drop.lat):0.00, longitude: this.state.paramData?(this.state.paramData.drop.lng):0.00}}
                                    title={'marker_title_2'}
                                    description={this.state.paramData?this.state.paramData.drop.add:null}
                                    pinColor={colors.GREEN.default}
                                />

                                <MapView.Polyline 
                                    coordinates={this.state.coords?this.state.coords:{latitude:0.00,longitude:0.00}}
                                    strokeWidth={4}
                                    strokeColor={colors.BLUE.default}
                                />

                            </MapView>
                        </View>
                    </View>      
                    <View style={styles.rideDesc}>
                    
                        <View style={styles.userDesc}>

                         {/* Driver Image */}
                        {this.state.paramData?
                             this.state.paramData.driver_image != ''?
                                <Avatar
                                    size="small"
                                    rounded
                                    source={{uri:this.state.paramData.driver_image}}
                                    activeOpacity={0.7}
                                /> 
                            : this.state.paramData.driver_name != ''?  
                            <Avatar
                            size="small"
                            rounded
                            source={require('../../assets/images/profilePic.jpg')}
                            activeOpacity={0.7}
                             />:null

                              
                            
                            :null}              
                            <View style={styles.userView}>
                               {/*Driver Name */}
                                {this.state.paramData && this.state.paramData.driver_name != ''?<Text style={styles.personStyle}>{this.state.paramData.driver_name}</Text>:null}
                                {this.state.paramData && this.state.paramData.driverRating>0?
                                
                                <View style={styles.personTextView}>
                                {/*My rating to driver */}
                                    <Text style={styles.ratingText}>{languageJSON.you_rated_text}</Text>
                                    <Rating
                                        showRating
                                        type="star"
                                        fractions={3}
                                        startingValue={parseFloat(this.state.paramData.driverRating)}
                                        readonly
                                        imageSize={15}
                                        onFinishRating={this.ratingCompleted}
                                        style={{ paddingVertical: 10 }}
                                        showRating={false}
                                    />
                                </View>
                                :null}
                            </View>
                        </View>
                        {/*Car details */}
                        {this.state.paramData && this.state.paramData.carType?
                                <View style={[styles.userDesc,styles.avatarView]}>  
                               
                                    <Avatar
                                        size="small"
                                        rounded
                                        source={ this.state.paramData.carImage?{uri:this.state.paramData.carImage}:require('../../assets/images/microBlackCar.png')}
                                        activeOpacity={0.7}
                                    />
                                    <View style={styles.userView}>
                                    <Text style={styles.carNoStyle}>{this.state.paramData.vehicle_number? this.state.paramData.vehicle_number:<Text> {languageJSON.car_no_not_found}</Text>}</Text>
                                    <Text style={styles.carNoStyleSubText}>{this.state.paramData.carType}</Text>
                                    </View>
                                </View>

                        :null}

                        <View style={styles.userDesc}>
                        <Avatar
                                size="small"
                                source={Platform.OS=='ios'?require('../../assets/images/fareMetar.jpg'):require('../../assets/images/fareMetar.jpg')}
                                activeOpacity={0.7}
                                
                            /> 
                            {/* <Avatar
                                size="small"
                                rounded
                                source={require('../../assets/images/fareMetar.png')}
                                activeOpacity={0.7}
                                avatarStyle={{backgroundColor: colors.WHITE}}
                            /> */}
                            <View style={styles.userView}>
                        <Text style={styles.textStyle}>{this.state.settings.symbol}{this.state.paramData && this.state.paramData.customer_paid?parseFloat(this.state.paramData.customer_paid).toFixed(2):this.state.paramData && this.state.paramData.estimate?this.state.paramData.estimate:0 }</Text>
                            </View>
                        </View>
                    </View> 
                    {/* <View style={styles.locationView}> */}
                    <View>
                        <View style={styles.location}>
                           {this.state.paramData && this.state.paramData.trip_start_time ?
                            <View>
                                <Text style={styles.timeStyle}>{this.state.paramData.trip_start_time}</Text>
                            </View>
                            :null}
                            {this.state.paramData && this.state.paramData.pickup?
                                <View style={styles.address}>
                                    <View style={styles.redDot} />
                                    <Text style={styles.adressStyle}>{this.state.paramData.pickup.add}</Text>
                                </View>
                            :null}
                        </View>

                        <View style={styles.location}>
                        {this.state.paramData && this.state.paramData.trip_end_time?
                            <View>
                                <Text style={styles.timeStyle}>{this.state.paramData.trip_end_time}</Text>
                            </View>
                        :null }
                        {this.state.paramData && this.state.paramData.drop?
                            <View style={styles.address}>
                                <View style={styles.greenDot} />
                                <Text style={styles.adressStyle}>{this.state.paramData.drop.add}</Text>
                            </View>
                            :null}
                        </View>
                    </View> 
                    {this.state.paramData?this.state.paramData.status == "ACCEPTED" ?
                    <View style={styles.locationView}>
                    <Button
                       
                        title={languageJSON.call_driver}

                        loading={false}
                        loadingProps={{ size: "large", color: colors.GREEN.default }}
                        onPress={()=>{this.onPressCall('tel:'+this.state.paramData.driver_contact)}}
                        containerStyle={styles.callButtonContainerStyle1}
                    />
                    <Button         
                       title={languageJSON.track_now_button}
                       loading={false}
                       loadingProps={{ size: "large", color: colors.GREEN.default }}
                       titleStyle={styles.buttonTitleText2}
                       onPress={()=>{this.trackNow(this.state.paramData)}}
                       containerStyle={styles.callButtonContainerStyle2}
                   />
                    
                    </View>:null:null}

                    {this.state.paramData?this.state.paramData.status == "START"?
                    <View style={styles.locationView2}>
                        <Button         
                        title={languageJSON.track_now_button}
                        loading={false}
                        loadingProps={{ size: "large", color: colors.GREEN.default }}
                        titleStyle={styles.buttonTitleText2}
                        onPress={()=>{this.trackNow(this.state.paramData)}}
                        containerStyle={styles.callButtonContainerStyle2}
                    />
                    </View>:null:null}
                   
                    {this.state.paramData && this.state.paramData.payment_status?this.state.paramData.payment_status == "IN_PROGRESS" || this.state.paramData.payment_status == "PAID" || this.state.paramData.payment_status == "WAITING"?
                    <View style={styles.billView}>
                        <View style={styles.billView}>
                            <Text style={styles.billTitle}>{languageJSON.bill_details_title}</Text>
                        </View>
                        <View style={styles.billOptions}>
                            <View style={styles.billItem}>
                                <Text style={styles.billName}>{languageJSON.your_trip}</Text>
                        <Text style={styles.billAmount}>{this.state.settings.symbol} {this.state.paramData && this.state.paramData.trip_cost>0?parseFloat(this.state.paramData.trip_cost).toFixed(2):this.state.paramData && this.state.paramData.estimate?parseFloat(this.state.paramData.estimate).toFixed(2):0 }</Text>
                            </View>
                            <View style={styles.billItem}>
                                <View>
                                    <Text style={[styles.billName, styles.billText]}>{languageJSON.discount}</Text>
                                    <Text style={styles.taxColor}>{languageJSON.promo_apply}</Text>
                                </View>
                                <Text style={styles.discountAmount}> - {this.state.settings.symbol}{this.state.paramData && this.state.paramData.discount_amount?parseFloat(this.state.paramData.discount_amount).toFixed(2):0}</Text>
                                
                            </View>
                            
                            {this.state.paramData && this.state.paramData.cardPaymentAmount?this.state.paramData.cardPaymentAmount>0?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text >{languageJSON.CardPaymentAmount}</Text>
                                
                                    </View>
                                    <Text >  {this.state.settings.symbol}{this.state.paramData && this.state.paramData.cardPaymentAmount?parseFloat(this.state.paramData.cardPaymentAmount).toFixed(2):0}</Text>
                                    
                                </View>
                            :null:null}
                             {this.state.paramData && this.state.paramData.cashPaymentAmount?this.state.paramData.cashPaymentAmount>0?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text >{languageJSON.CashPaymentAmount}</Text>
                                        
                                    </View>
                                    <Text>  {this.state.settings.symbol}{this.state.paramData && this.state.paramData.cashPaymentAmount?parseFloat(this.state.paramData.cashPaymentAmount).toFixed(2):0}</Text>
                                    
                                </View>
                            :null:null}
                             {this.state.paramData && this.state.paramData.usedWalletMoney?this.state.paramData.usedWalletMoney>0?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text>{languageJSON.WalletPayment}</Text>
                                       
                                    </View>
                                    <Text >  {this.state.settings.symbol}{this.state.paramData && this.state.paramData.usedWalletMoney?parseFloat(this.state.paramData.usedWalletMoney).toFixed(2):0}</Text>
                                    
                                </View>
                            :null:null}
                        </View>
                        <View style={styles.paybleAmtView}>
                            <Text style={styles.billTitle}>{languageJSON.grand_total}</Text>
                        <Text style={styles.billAmount2}>{this.state.settings.symbol}{this.state.paramData && this.state.paramData.customer_paid?parseFloat(this.state.paramData.customer_paid).toFixed(2):null}</Text>
                        </View>
                    </View>
                    :null:null}
                     {this.state.paramData && this.state.paramData.payment_status?this.state.paramData.payment_status == "IN_PROGRESS" || this.state.paramData.payment_status == "PAID" || this.state.paramData.payment_status == "WAITING"?
                        <View>
                            <View style={styles.iosView}>
                                {
                                Platform.OS=='ios' ?
                                    <ImageBackground source={require('../../assets/images/dash.png')}
                                        style={styles.backgroundImage}
                                        resizeMode= {Platform.OS=='ios'?'repeat':'stretch'}>
                                    </ImageBackground>
                                    :
                                    <Dash style={styles.dashView}/>
                                }
                            </View>

                            <View style={styles.paymentTextView}>
                                <Text style={styles.billTitle}>{languageJSON.payment_status}</Text>
                            </View>
                            {this.state.paramData && this.state.paramData.payment_status?
                                <View style={styles.billOptions}>
                                    <View style={styles.billItem}>
                                    <Text style={styles.billName}>{languageJSON.payment_status}</Text>
                                        <Text style={styles.billAmount}>{this.state.paramData.payment_status == "IN_PROGRESS" || this.state.paramData.payment_status == "WAITING" ?"Yet to pay":this.state.paramData.payment_status }</Text>
                                       
                                    </View>
                                    <View style={styles.billItem}>
                                    <Text style={styles.billName}>{languageJSON.pay_mode}</Text>
                                        <Text style={styles.billAmount}>{this.state.paramData.payment_mode?this.state.paramData.payment_mode :null} { this.state.paramData.getway?'(' + this.state.paramData.getway +')':null }</Text>
                                    </View>
                                </View>
                            :<View style={styles.billOptions}>
                                <View style={styles.billItem}></View>
                             </View>}
                    </View>
                 :null:null}  
                   {this.state.paramData?this.state.paramData.payment_status == 'WAITING'?
                                            
                                            <View style={styles.locationView2}>
                                                <Button         
                                                title={languageJSON.paynow_button}
                                                loading={false}
                                                loadingProps={{ size: "large", color: colors.GREEN.default }}
                                                titleStyle={styles.buttonTitleText2}
                                                onPress={()=>{this.PayNow(this.state.paramData)}}
                                                containerStyle={styles.paynowButton}
                                            />
                                        </View>:null:null}  
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    containerView:{ 
        flex:1 
    },
    textContainer:{
        textAlign:"center"
    },
    mapView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        marginBottom: 15
    },
    mapcontainer: {
        flex: 7,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            {rotate: '180deg'}
          ]
    },
    rideDesc: {
        flexDirection: 'column'
    },
    userDesc: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    userView: {
        flexDirection: 'column',
        paddingLeft: 28,
    },
    locationView: {
        flex:1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        padding:10,
        marginVertical: 14,
        justifyContent:"space-between",
    },
    locationView2: {
        flex:1,
        flexDirection: 'row',
        // paddingHorizontal: 10,
        padding:10,
        marginVertical: 14,
        
    },
    // callButtonStyle:{
    // width:400
    // },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    address: {
        flexDirection: 'row', 
        flexGrow: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        width: 0, 
        marginLeft: 6
    },
    billView: {
        marginVertical: 5
    },
    billTitle: {
        fontSize: 18,
        color: colors.GREY.default,
        fontFamily: 'Roboto-Bold'
    },
    billOptions: {
        marginHorizontal: 10,
        marginVertical: 6
    },
    billItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 15
    },
    billName: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.default
    },
    billAmount: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: colors.GREY.default
    },
    discountAmount:{
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: colors.RED
    },
    
    billAmount2:{
        fontWeight: 'bold', 
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: colors.GREY.default
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: 2,
    },
    carNoStyle:{
        fontSize: 16, 
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Medium'
    },
    carNoStyleSubText:{
        fontSize: 16, 
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.default
    },
    textStyle:{
        fontSize: 16, 
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Medium'
    },
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
        //marginTop: StatusBar.currentHeight 
    },
    personStyle:{
        fontSize: 16, 
        //fontWeight: 'bold', 
        color: colors.BLACK, 
        fontFamily: 'Roboto-Medium'
    },
    personTextView:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    ratingText:{
        fontSize: 16, 
        color: colors.GREY.iconSecondary, 
        marginRight: 8, 
        fontFamily: 'Roboto-Regular'
    },
    avatarView:{
        marginVertical: 15
    },
    timeStyle:{
        fontFamily: 'Roboto-Regular', 
        fontSize: 16, 
        marginTop: 1
    },
    adressStyle:{
        marginLeft: 6, 
        fontSize: 15, 
        lineHeight: 20
    },
    billView:{
        paddingHorizontal: 14
    },
    billText:{
        fontFamily: 'Roboto-Bold'
    },
    taxColor:{
        color: colors.GREY.default
    },
    paybleAmtView:{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10
    },
    iosView:{
        paddingVertical: 10
    },
    dashView:{
        width:width, height:1
    },
    paymentTextView:{
        paddingHorizontal: 10
    },
    // callButtonStyle:{
    //     width:50+'%'
    // },
    callButtonContainerStyle1:{
        flex:1,
        width:'80%',
        height:100
    },
    callButtonContainerStyle2:{
        flex:1,
        width:'80%',
        height:100,
        paddingLeft:10
    }, 
    paynowButton:{
        flex:1,
        width:'80%',
        height:150,
        paddingLeft:10
    }, 
});