import React from 'react';
import { Text, View, StyleSheet, Dimensions,AsyncStorage, FlatList, Modal, TouchableHighlight, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Button, Header } from 'react-native-elements';
import Polyline from '@mapbox/polyline';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { colors } from '../common/theme';
import * as Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
var { width, height } = Dimensions.get('window');
import  {GeoFire} from 'geofire';
import * as firebase from 'firebase'
var { height } = Dimensions.get('window');
var google;
import { RequestPushMsg } from '../common/RequestPushMsg';
import { google_map_key } from '../common/key';
import  languageJSON  from '../common/language';

export default class DriverTripAccept extends React.Component{

      setModalVisible(visible, data) {
        this.setState({
            modalVisible: visible,
            modalData: data
        });
      }

    constructor(props){
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            starCount: 5,
            modalVisible: false,
            alertModalVisible: false,
            coords: [],
            radio_props : [
                {label: languageJSON.cancel_reson_1, value: 0 },
                {label: languageJSON.cancel_reson_2, value: 1 },
                {label: languageJSON.cancel_reson_3, value: 2 },
                {label: languageJSON.cancel_reson_4, value: 3 },
                {label: languageJSON.cancel_reson_5, value: 4 }
            ],
            value: 0,
            tasklist: [],
            myLocation: {},
            driverDetails: null,
            curUid: '',
            id:0
        }
        this._getLocationAsync();
      }
 
      //checking booking status
      checking(){
            if(this.state.currentBId){
                let curUid =firebase.auth().currentUser.uid
                let bookingId = this.state.currentBId;
                const userData=firebase.database().ref('users/'+curUid+'/my_bookings/'+bookingId+'/');
                userData.on('value',bookingDetails=>{
                    if(bookingDetails.val()){
                        let curstatus = bookingDetails.val().status;
                        this.setState({status:curstatus})
                    }
                })
            }
      }
      
      
    componentDidMount() {
    this.getRiders();
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
            await this.setState({coords: coords})
            return coords
        }
        catch(error) {
            alert(error)
            return error
        }
    }


    //get current location
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
        Location.watchPositionAsync({},(location)=>{
            // console.log("Driver current lat long is",location)
            if(location) {
                var pos = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
                this.setState({ myLocation: pos })
                var curuser = firebase.auth().currentUser.uid;
                if(pos){
                    var latlng = pos.latitude + ',' + pos.longitude;
                    return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&key=' + google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if(responseJson.results[0] && responseJson.results[0].formatted_address){
                            firebase.database().ref('users/' + curuser+'/location').update({
                                add:responseJson.results[0].formatted_address,
                                lat:pos.latitude,
                                lng:pos.longitude
                            })
                        }else{
                            alert(languageJSON.api_error)
                        }
                        
                    })
                    .catch((error) =>{
                        console.error(error);
                    });
                }
            }

        });
    }



    //get nearby riders function
    getRiders() {
        var curuid = firebase.auth().currentUser.uid; 
        this.setState({curUid: firebase.auth().currentUser.uid})
        let ref = firebase.database().ref('users/' + curuid + '/');
        ref.on('value',(snapshot)=>{
            // console.log("current user data is",snapshot.val()); 
            this.setState({driverDetails: snapshot.val()})
            var jobs = [];
            let waiting_riderData = snapshot.val().waiting_riders_list;
            for(let key in waiting_riderData) {
                waiting_riderData[key].bookingId = key;
                jobs.push(waiting_riderData[key]);
            }
            this.setState({tasklist: jobs.reverse()});
            this.jobs = jobs;
            // console.log(this.jobs);
        });
    }

    //get booking details function
    getBookingDetails() {
        let ref = firebase.database().ref('bookings/' + item.bookingId + '/');
            ref.on('value',(snapshot)=>{
                this.setState({
                    bookingDetails: snapshot.val()
                })
            })
    }

    // accept button press function
    onPressAccept(item) {
        var data = {
            carType: item.carType,
            customer: item.customer,
            customer_name: item.customer_name ,
            otp:item.otp,
            distance: item.distance,
            driver: this.state.curUid,
            driver_image: this.state.driverDetails.profile_image ? this.state.driverDetails.profile_image : "",
            driver_name: this.state.driverDetails.firstName + ' ' + this.state.driverDetails.lastName,
            driver_contact: this.state.driverDetails.mobile,
            vehicle_number: this.state.driverDetails.vehicleNumber,
            // vehicleModelName: this.state.driverDetails.vehicleModel,
            driverRating: this.state.driverDetails.ratings ? this.state.driverDetails.ratings.userrating : "0" ,
            drop: item.drop,
            pickup: item.pickup,
            estimate: item.estimate,
            estimateDistance: item.estimateDistance,
            serviceType: item.serviceType,  
            status:"ACCEPTED",
            total_trip_time: item.total_trip_time,
            trip_cost: item.trip_cost,
            trip_end_time: item.trip_end_time,
            trip_start_time: item.trip_start_time,
            tripdate: item.tripdate,
        }

        var riderData = {
            carType: item.carType,
            distance: item.distance,
            driver: this.state.curUid,
            driver_image: this.state.driverDetails.profile_image ? this.state.driverDetails.profile_image : "",
            driver_name: this.state.driverDetails.firstName + ' ' + this.state.driverDetails.lastName,
            driver_contact: this.state.driverDetails.mobile,
            vehicle_number: this.state.driverDetails.vehicleNumber,
            // vehicleModelName: this.state.driverDetails.vehicleModel,
            driverRating: this.state.driverDetails.ratings ? this.state.driverDetails.ratings.userrating : "0",
            drop: item.drop,
            otp:item.otp,
            pickup: item.pickup,
            estimate: item.estimate,
            estimateDistance: item.estimateDistance,
            serviceType: item.serviceType,  
            status:"ACCEPTED",
            total_trip_time: item.total_trip_time,
            trip_cost: item.trip_cost,
            trip_end_time: item.trip_end_time,
            trip_start_time: item.trip_start_time,
            tripdate: item.tripdate,
        }
        
        let dbRef = firebase.database().ref('users/' + this.state.curUid + '/my_bookings/' + item.bookingId + '/');
        dbRef.update(data).then(()=>{
            firebase.database().ref('bookings/' + item.bookingId + '/').update(data).then(()=>{
                firebase.database().ref('bookings/' + item.bookingId).once('value',(snap) => {
                    let requestedDriverArr = snap.val().requestedDriver;
                    if(requestedDriverArr) {
                        for(let i=0; i<requestedDriverArr.length; i++) {
                            firebase.database().ref('users/' + requestedDriverArr[i] + '/waiting_riders_list/' + item.bookingId + '/').remove();
                        }
                        this.props.navigation.navigate('DriverTripStart', {allDetails: item})
                    }
                    // console.log(snap.val().requestedDriver)
                })
            })
            this.setState({currentBId:item.bookingId},()=>{
                this.checking();
                this.sendPushNotification(item.customer,item.bookingId,riderData.driver_name+ languageJSON.accept_booking_request)
            })
            
        }).catch((error)=>{console.log(error)})

        
        let userDbRef = firebase.database().ref('users/' + item.customer + '/my-booking/' + item.bookingId + '/');userDbRef.update(riderData);
        let currentUserdbRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/');
        currentUserdbRef.update({
            queue: true
        }) 
        
        
    }

    //ignore button press function
    onPressIgnore(item) {
        console.log(item.bookingId)
        firebase.database().ref('bookings/' + item.bookingId + '/').once('value',data=>{
            if(data.val()) {
                let mainBookingData = data.val();
                console.log(mainBookingData)
                if(mainBookingData.requestedDriver) {      
                    if(mainBookingData.requestedDriver.length == 1) {
                        firebase.database().ref('bookings/' + item.bookingId + '/').update({
                            status: "CANCELLED",
                            requestedDriver: []
                        })
                        .then(()=>{
                            let userDbRef = firebase.database().ref('users/' + item.customer + '/my-booking/' + item.bookingId + '/');
                            userDbRef.update({
                                status: "CANCELLED",
                            });
                            this.sendPushNotification(item.customer,item.bookingId,languageJSON.booking_request_rejected)
                        })
                    }
                    else {
                        let arr = mainBookingData.requestedDriver.filter((item)=>{
                            return item != this.state.curUid
                        })
                        firebase.database().ref('bookings/' + item.bookingId + '/').update({
                            requestedDriver: arr
                        })
                    }
                }
            }
        });

        firebase.database().ref('users/' + this.state.curUid + '/waiting_riders_list/' + item.bookingId + '/').remove().then(()=>{
            this.setModalVisible(false, null)
        });

    }

    sendPushNotification(customerUID,bookingId,msg){
        const customerRoot=firebase.database().ref('users/'+customerUID);
        customerRoot.once('value',customerData=>{
            if(customerData.val()){
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken?allData.pushToken:null,msg)
            }
        })
    }
    
    render(){
        return(
            <View style={styles.mainViewStyle}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.task_list}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInnerStyle}
                />
                <FlatList
                    data={this.state.tasklist}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<View style={{flex:1, justifyContent:"center", alignItems:"center", height: height}}><Text style={styles.addressViewTextStyle}>{languageJSON.rider_not_here}</Text></View>}
                    renderItem={({item, index}) => {
                        return (
                            <View style={styles.listItemView}>
                                <View style={styles.mapcontainer}>
                                    <MapView style={styles.map} 
                                        provide
                                        r={PROVIDER_GOOGLE}
                                        initialRegion={{
                                        latitude: item.pickup.lat,                                
                                        longitude: item.pickup.lng, 
                                        latitudeDelta: 0.5022,
                                        longitudeDelta: 0.1821
                                        }}
                                    >
                                        <Marker
                                            coordinate={{latitude: item.pickup.lat, longitude: item.pickup.lng}}
                                            title={item.pickup.add}
                                            description={languageJSON.pickup_location}                            
                                        />

                                        <Marker
                                            coordinate={{latitude: item.drop.lat, longitude: item.drop.lng}}
                                            title={item.drop.add}
                                            description={languageJSON.drop_location}
                                            pinColor={colors.GREEN.default}
                                        />

                                        <MapView.Polyline
                                            coordinates={this.state.coords}
                                            strokeWidth={4}
                                            strokeColor={colors.BLUE.default}
                                        />

                                    </MapView>
                                </View>
                        
                                <View style={styles.mapDetails}>
                                    <View style={styles.dateView}>
                                        <Text style={styles.listDate}>{new Date(item.tripdate).toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.addressViewStyle}>                            
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={styles.greenDot}></View>
                                            <Text style={styles.addressViewTextStyle}>{item.pickup.add}</Text>
                                        </View>
                                        <View style={styles.fixAdressStyle}>
                                            <View style={styles.redDot}></View>
                                            <Text style={styles.addressViewTextStyle}>{item.drop.add}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsBtnView}>
                                        <View style={{flex: 1}}>
                                            <Button 
                                                onPress={() => {
                                                    this.setModalVisible(true, item);
                                                }}
                                                title={languageJSON.ignore_text}
                                                titleStyle={styles.titleStyles}
                                                buttonStyle={styles.myButtonStyle}
                                                containerStyle={{
                                                    flex: 1,
                                                    alignSelf: 'flex-end',
                                                    paddingRight: 14
                                                }}
                                            />
                                        </View>
                                        <View style={styles.viewFlex1}>
                                            <Button 
                                                title={languageJSON.accept}
                                                titleStyle={styles.titleStyles}
                                                onPress={() => {
                                                    this.onPressAccept(item)
                                                }}
                                                buttonStyle={{
                                                    backgroundColor: colors.GREEN.light,
                                                    width: height/6,
                                                    padding: 2,
                                                    borderColor: colors.TRANSPARENT,
                                                    borderWidth: 0,
                                                    borderRadius: 5,
                                                }}
                                                containerStyle={{
                                                    flex: 1,
                                                    alignSelf: 'flex-start',
                                                    paddingLeft: 14
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }
                />
                
                <View style={styles.modalPage}>
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert(languageJSON.modal_close);
                    }}>
                        <View style={styles.modalMain}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeading}>
                                    <Text style={styles.alertStyle}>{languageJSON.alert_text}</Text>
                                </View>
                                <View style={styles.modalBody}>
                                    <Text style={{fontSize: 16}}>{languageJSON.ignore_job_title}</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableHighlight
                                        style={[styles.btnStyle,styles.clickText]}
                                        onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible, null)
                                        }}>
                                        <Text style={styles.cancelTextStyle}>{languageJSON.cancel}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        style={styles.btnStyle}
                                        onPress={() => {
                                        this.onPressIgnore(this.state.modalData)                            
                                        }}>
                                        <Text style={styles.okStyle}>{languageJSON.ok}</Text>
                                    </TouchableHighlight>
                                </View>                  
                            </View>
                        </View>
                    </Modal>
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
    mapcontainer: {
        flex: 1.5,
        width: width,
        height: 150,
        borderWidth:7,
        borderColor:colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapDetails: {
        backgroundColor: colors.WHITE,
        flex: 1,
        flexDirection: 'column',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden'
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
    signInTextStyle: {
        fontFamily:'Roboto-Bold', 
        fontWeight: "700", 
        color: colors.WHITE
    },
    listItemView: {
        flex: 1,
        width: '100%',
        // height: 350,
        marginBottom: 10,
        flexDirection: 'column',
    },
    dateView: {
        flex: 1.1
    },
    listDate: {
        fontSize: 20, 
        fontWeight: 'bold', 
        paddingLeft: 10,
        color: colors.GREY.default,
        flex: 1
    },
    addressViewStyle: {
        flex: 2,
        paddingLeft: 10
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 15,
        marginLeft:15, 
        lineHeight: 24
        ,flexWrap: "wrap",
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    detailsBtnView: {
        flex: 2,
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width,
        marginTop: 10,
        marginBottom: 10
    },

    modalPage: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalMain: {
        flex: 1,
        backgroundColor: colors.GREY.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        flex: 1,
        maxHeight: 180
    },
    modalHeading: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalFooter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopColor: colors.GREY.iconPrimary,
        borderTopWidth: 1,
        width: '100%',
    },
    btnStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainViewStyle:{
        flex: 1, 
        //marginTop: StatusBar.currentHeight
    },
    fixAdressStyle: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    myButtonStyle: {
        backgroundColor: colors.RED,
        width: height/6,
        padding: 2,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 5,                                    
    },
    alertStyle: {
        fontWeight: 'bold', 
        fontSize: 18,
        width:'100%',
        textAlign:'center'
    },
    cancelTextStyle: {
        color: colors.BLUE.secondary, 
        fontSize: 18, 
        fontWeight: 'bold',
        width:"100%",
        textAlign:'center'
    },
    okStyle: {
        color: colors.BLUE.secondary, 
        fontSize: 18, 
        fontWeight: 'bold'
    },
    viewFlex1: {
        flex: 1
    },
    clickText: { 
        borderRightColor: colors.GREY.iconPrimary, 
        borderRightWidth: 1
    },
    titleStyles: {
        width:"100%",
        alignSelf: 'center'
    }
});