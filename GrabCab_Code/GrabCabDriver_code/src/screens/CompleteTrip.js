import React from 'react';
import { 
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    AsyncStorage,
    Image,
    Modal
  } from 'react-native';
  var { width } = Dimensions.get('window');
import { MapComponent } from '../components';
import {TrackNow} from '../components';
import {Button, Header} from 'react-native-elements';
import { colors } from '../common/theme';
import  {GeoFire} from 'geofire';
import * as firebase from 'firebase'
import { farehelper } from '../common/fareCalculator';
import * as Location from 'expo-location';
import getDirections from 'react-native-google-maps-directions'
import * as Permissions from 'expo-permissions';
import { RequestPushMsg } from '../common/RequestPushMsg';
import { google_map_key } from '../common/key';
import  languageJSON  from '../common/language';

export default class DriverCompleteTrip extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loadingModal:false,
            region: {
                latitude: 37.78825, 
                longitude: -122.4324,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
        }
    }

    componentWillMount() {
        const allDetails = this.props.navigation.getParam('allDetails')

        this.setState({
            rideDetails: allDetails,
            region: {
                latitude: allDetails.pickup.lat,
                longitude: allDetails.pickup.lng,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            curUid: firebase.auth().currentUser.uid
        },()=>{
            //checking status
            this.checking()
        })
    }

    componentDidMount() {
        const allDetails = this.props.navigation.getParam('allDetails')
        const startTime = this.props.navigation.getParam('starttime');
        if(startTime) {
            let time = startTime.toString()
            AsyncStorage.setItem('startTime',time)
            this.setState({ startTime: startTime})
        }
        const Data=firebase.database().ref('rates/');
        Data.once('value',rates=>{
            if(rates.val()){
                var carTypeWiseRate = rates.val();  
                    for(var i= 0; i<carTypeWiseRate.car_type.length; i++) {
                        if(carTypeWiseRate.car_type[i].name == allDetails.carType) {
                            var rates = carTypeWiseRate.car_type[i];
                            this.setState({
                                rateDetails:rates
                            },()=>{
                                // console.log(this.state.rateDetails)
                            })
                        }
                    }
            }
        })

        let dbRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/');
        dbRef.update({
            queue: true
        }).then(()=>{
            //this.handleGetDirections(allDetails)
        })
        setInterval(this._getLocatioAsync.bind(this),30000);
    }


    checking(){
        if(this.state.rideDetails.bookingId){
            let curUid =firebase.auth().currentUser.uid
            let bookingId = this.state.rideDetails.bookingId;
            const userData=firebase.database().ref('users/'+curUid+'/my_bookings/'+bookingId+'/');
            userData.on('value',bookingDetails=>{
                if(bookingDetails.val()){
                    let curstatus = bookingDetails.val().status;
                    this.setState({status:curstatus})
                }
            })
        }
  }
    //save track history
    _getLocatioAsync = async () => {  
        if(this.state.status == 'START' && this.state.loadingModal == false){     
          let { status } = await Permissions.askAsync(Permissions.LOCATION);
          if (status !== 'granted') {
          this.setState({
              errorMessage: 'Permission to access location was denied',
          });
          }
  
      let location = await Location.getCurrentPositionAsync({});
          var latlng = location.coords.latitude + ',' + location.coords.longitude;
          return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&key=' + google_map_key)
          .then((response) => response.json())
          .then((responseJson) => {
              var keys = this.state.rideDetails.bookingId
              firebase.database().ref('bookings/'+keys+'/current/').update({
                  lat:location.coords.latitude,
                  lng:location.coords.longitude,
                  add:responseJson.results[0].formatted_address
               }).then(()=>{
                  firebase.database().ref('bookings/'+keys+'/routes').push({
                      lat:location.coords.latitude,
                      lng:location.coords.longitude,
                      add:responseJson.results[0].formatted_address
                  })
               })
               
          })
          .catch((error) =>{
              console.error(error);
          });
      }
  };


    //End trip and fare calculation function
    async onPressEndTrip(item) {

        this.setState({loadingModal:true})
        let location = await Location.getCurrentPositionAsync({});
        if(location) {
            var diff =((this.state.startTime) - (new Date().getTime())) / 1000;
            diff /= (60 * 1);
            var totalTimeTaken = Math.abs(Math.round(diff));
         
            var pos = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            let startLoc = '"'+this.state.rideDetails.pickup.lat+', '+this.state.rideDetails.pickup.lng+'"';
            let destLoc = '"'+pos.latitude+', '+pos.longitude+'"';

              var resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${ google_map_key }`)
              var respJson = await resp.json();
              //fare calculations
              var fareCalculation = farehelper(respJson.routes[0].legs[0].distance.value,totalTimeTaken,this.state.rateDetails?this.state.rateDetails:1);
              if(fareCalculation) {
                this.finalCostStore(item,fareCalculation.grandTotal,pos,respJson.routes[0].legs[0].distance.value,fareCalculation.convenience_fees)
                 
              }
        }
        
    }
    
    locationAdd(pos){
         var latlng = pos.latitude + ','+ pos.longitude;   
         return  fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&key=' + google_map_key)  
    }
    
    //driver current location fetching
    finalCostStore(item,finalFare,pos,distance,convenience_fees){
        let driverShare = (finalFare - convenience_fees);
        var data = {
            status:"END",
            payment_status:"IN_PROGRESS",
            trip_cost: finalFare,
            trip_end_time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
            finaldistance:distance,
            convenience_fees:convenience_fees,
            driver_share:driverShare,
            customer_paid:finalFare,
            discount_amount:0,
        }
        var riderData = {
            status:"END",
            payment_status:"IN_PROGRESS",
            trip_cost: finalFare,
            trip_end_time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
            finaldistance:distance,
            convenience_fees:convenience_fees,
            customer_paid:finalFare,
            discount_amount:0,

        }
        this.locationAdd(pos).then((response) => response.json()).then((responseJson) => { 
           data.drop = { add:responseJson.results[0].formatted_address,lat:pos.latitude,lng:pos.longitude};
           riderData.drop = { add:responseJson.results[0].formatted_address,lat:pos.latitude,lng:pos.longitude};
           item.drop = { add:responseJson.results[0].formatted_address,lat:pos.latitude,lng:pos.longitude};
           if(data.drop){
            this.saveData(item,data,riderData);
            this.updateDriverLocation(data.drop)
           }
       });

    }

    //Final cost and status set to database
    saveData(item,data,riderData){
        let dbRef = firebase.database().ref('users/' + this.state.curUid + '/my_bookings/' + item.bookingId + '/');
                dbRef.update(data).then(()=>{
                    firebase.database().ref('bookings/' + item.bookingId + '/').update(data).then(()=>{
                        let userDbRef = firebase.database().ref('users/' + item.customer + '/my-booking/' + item.bookingId + '/');
                        userDbRef.update(riderData).then(()=>{
                            this.setState({loadingModal:false})
                            this.props.navigation.navigate('DriverFare', {allDetails: item, trip_cost: data.trip_cost, trip_end_time: data.trip_end_time})
                            this.sendPushNotification(item.customer,item.bookingId)
                        })
                    })
                })
    }

    //update driver location
    updateDriverLocation(location){
        firebase.database().ref('users/' + this.state.curUid +'/location').update({
            add:location.add,
            lat:location.lat,
            lng:location.lng
        })
    }
    sendPushNotification(customerUID,bookingId){
        const customerRoot=firebase.database().ref('users/'+customerUID);
        customerRoot.once('value',customerData=>{
            if(customerData.val()){
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken?allData.pushToken:null, languageJSON.driver_ride_complete_status+bookingId)
            }
        })
    }

    loading(){
        return(
           <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.loadingModal}
                onRequestClose={() => {
                this.setState({loadingModal:false})
               }}
               >
               <View style={{flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                   <View style={{width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70}}> 
                   <View style={{ alignItems: 'center',flexDirection:'row',flex:1,justifyContent:"center"}}>
                        <Image
                           style={{width:80,height:80,backgroundColor:colors.TRANSPARENT}}
                           source={require('../../assets/images/loader.gif')}
                        />
                      <View style={{flex:1}}>
                            <Text style={{color:"#000",fontSize:16,}}>{languageJSON.please_wait}</Text>
                       </View>
                   </View>
                   </View>
               </View>
               </Modal>
        )
    }

    // google navigations now it not implemented in client side
    handleGetDirections(allDetails) {
        const data = {
           source: {
            latitude: allDetails.pickup.lat,
            longitude: allDetails.pickup.lng
          },
          destination: {
            latitude: allDetails.drop.lat,
            longitude: allDetails.drop.lng
          },
          params: [
            {
              key: "travelmode",
              value: "driving"        // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate"       // this instantly initializes navigation using the given travel mode
            }
          ],
        //   waypoints: []
        }
    
        getDirections(data)
      }

  
  render() {
    return (
        <View style={styles.containerView}>
            <Header 
                backgroundColor={colors.GREY.default}
                leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.on_trip}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.innerStyle}
            />
            <TrackNow bId={this.state.rideDetails.bookingId} alldata={this.state.rideDetails} />
            {/* <View style={styles.segment1}>
                <Text style={styles.textContainer}>{this.state.rideDetails.drop.add}</Text>
            </View>
        
            <View style={styles.segment2}>
                <MapComponent mapStyle={styles.map} mapRegion={this.state.region} markerCord={this.state.region} />
                
            </View> */}
            <View style={styles.buttonViewStyle}>        
                <Button 
                    title={languageJSON.complete_trip}
                    onPress={() => {
                        this.onPressEndTrip(this.state.rideDetails)
                    }}
                    titleStyle={styles.titleViewStyle}
                    buttonStyle={styles.buttonStyleView}
                /> 
            </View> 
            {this.loading()}
        </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView:{ 
        flex:1,
        backgroundColor:colors.GREY.btnSecondary,
        paddingBottom:5,
        //marginTop: StatusBar.currentHeight
    },
    textContainer:{
        textAlign:"center",
        fontSize:16.2,
        color:colors.BLUE.default.dark,
        fontFamily:'Roboto-Medium',
        lineHeight:22
    },
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    segment1:{
        width: '97.4%',
        flex:1,
        justifyContent: 'center',
        borderRadius:10,
        backgroundColor: colors.WHITE,
        marginLeft:5,
        marginRight:5,
        marginTop:5,
        paddingTop:12,
        paddingBottom:12,
        paddingRight:8,
        paddingLeft:8
    },
    segment2:{
        flex:10,
        width: '97.4%',
        alignSelf: 'center',
        borderRadius:10,
        backgroundColor: colors.WHITE,
        marginLeft:5,
        marginRight:5,
        marginTop:5,
        paddingTop:12,
        paddingBottom:12,
        paddingRight:8,
        paddingLeft:8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow:'hidden',
        position:'relative'
},
segment3:{
        flex:2,
        borderRadius:10,
        marginLeft:5,
        marginRight:5,
        marginTop:5,
        marginBottom:5,
        paddingTop:3,
        paddingBottom:3,
        paddingRight:8,
        paddingLeft:8,
        alignItems: 'center',

},
    map: {
        flex: 1,
        borderRadius:10,
        ...StyleSheet.absoluteFillObject,
    },
    buttonViewStyle:{
        flex:1,
        justifyContent:'flex-end',
        bottom:18,
        position:"absolute",
        alignSelf:'center'
    },
    innerStyle:{
        marginLeft:10, 
        marginRight: 10
    },
    buttonStyleView:{
        backgroundColor: colors.RED,
        width: width-40,
        alignItems:'flex-end',
        padding: 8,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 5,
        elevation:0,
    },
    titleViewStyle:{
        fontFamily:'Roboto-Bold'
    }
});
