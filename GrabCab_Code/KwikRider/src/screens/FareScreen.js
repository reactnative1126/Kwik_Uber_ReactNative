import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Modal,
    Platform,
    AsyncStorage,
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import { Icon, Button, Header } from 'react-native-elements';
import Polyline from '@mapbox/polyline';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import * as firebase from 'firebase';
import { farehelper } from '../common/FareCalculator';
import { GeoFire } from 'geofire';
import { PromoComp } from "../components";
import { RequestPushMsg } from '../common/RequestPushMsg';
import { google_map_key } from '../common/key';
import languageJSON from '../common/language';

export default class FareScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertModalVisible: false,
            region: {},
            coords: [],
            modalVisible: false,
            promodalVisible: false,
            settings:{
                code:'',
                symbol:'',
                cash:false,
                wallet:false,
                braintree:false,
                stripe:false
            }
        }
    }

    _retrieveSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('settings');
          if (value !== null) {
            this.setState({settings:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue 8 ");
        }
    };

    componentDidMount() {
        var getCroods = this.props.navigation.getParam('data');
        var carType = this.props.navigation.getParam('carType');
        var carImage = this.props.navigation.getParam('carimage');
        const Data = firebase.database().ref('rates/');
        Data.once('value', rates => {
            if (rates.val()) {
                var carTypeWiseRate = rates.val();
                for (var i = 0; i < carTypeWiseRate.car_type.length; i++) {
                    if (carTypeWiseRate.car_type[i].name == carType) {
                        var rates = carTypeWiseRate.car_type[i];
                        this.setState({
                            region: getCroods,
                            curUID: firebase.auth().currentUser,
                            rateDetails: rates,
                            carType: carType,
                            carImage: carImage
                        }, () => {
                            //console.log('this.state',this.state)
                            this.getDirections('"' + this.state.region.wherelatitude + ', ' + this.state.region.wherelongitude + '"', '"' + this.state.region.droplatitude + ', ' + this.state.region.droplongitude + '"')
                            //fetch UserDetails
                            const userData = firebase.database().ref('users/' + this.state.curUID.uid);
                            userData.once('value', userData => {
                                this.setState({ userDetails: userData.val() });
                                //console.log(userData.val())
                            })
                        })
                    }
                }
            }
        })

        this._retrieveSettings();

    }

    applyPromo() {
        this.setState({ promodalVisible: true, modalVisible: false, alertModalVisible: false })
    }

    promoModal() {

        return (
            <Modal
                animationType="none"
                // transparent={true}
                visible={this.state.promodalVisible}
                onRequestClose={() => {
                    this.setState({ promodalVisible: false })
                }}>
                <Header
                    backgroundColor={colors.GREY.default}
                    rightComponent={{ icon: 'ios-close', type: 'ionicon', color: colors.WHITE, size: 45, component: TouchableWithoutFeedback, onPress: () => { this.setState({ promodalVisible: false }) } }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.your_promo}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
                />
                <PromoComp onPressButton={(item, index) => { this.SelectCopupon(item, index) }}></PromoComp>
            </Modal>
        )
    }



    // FOR ROOT DIRECTIONS
    async getDirections(startLoc, destLoc) {
        try {
            var resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${google_map_key}`)
            var respJson = await resp.json();

            var fareCalculation = farehelper(respJson.routes[0].legs[0].distance.value, respJson.routes[0].legs[0].duration.value, this.state.rateDetails ? this.state.rateDetails : 1)
            this.setState({
                distance: respJson.routes[0].legs[0].distance.value,
                fareCost: fareCalculation ? parseFloat(fareCalculation.totalCost).toFixed(2) : 0,
                estimateFare: fareCalculation ? parseFloat(fareCalculation.grandTotal).toFixed(2) : 0,
                estimateTime: respJson.routes[0].legs[0].duration.value,
                convenience_fees: fareCalculation ? parseFloat(fareCalculation.convenience_fees).toFixed(2) : 0
            }, () => {

            })
            var points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            var coords = points.map((point) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords }, () => {
                setTimeout(() => {
                    this.map.fitToCoordinates([{ latitude: this.state.region.wherelatitude, longitude: this.state.region.wherelongitude }, { latitude: this.state.region.droplatitude, longitude: this.state.region.droplongitude }], {
                        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                        animated: true,
                    })
                }, 1500);
            })
            return coords
        }
        catch (error) {

            if (error == "TypeError: Cannot read property 'legs' of undefined") {
                Alert.alert(
                    languageJSON.err,
                    languageJSON.route_not_found,
                    [
                        { text: languageJSON.no_driver_found_alert_OK_button, onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
            } else {
                Alert.alert(
                    languageJSON.err,
                    languageJSON.route_not_found,
                    [
                        { text: languageJSON.no_driver_found_alert_OK_button, onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
            }

            return error
        }
    }

    // on press Ride later
    onPressCancel() {
        this.props.navigation.goBack();
    }


    alertModal() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.alertModalVisible}
                onRequestClose={() => {
                    this.setState({ alertModalVisible: false })
                }}>
                <View style={styles.alertModalContainer}>
                    <View style={styles.alertModalInnerContainer}>

                        <View style={styles.alertContainer}>

                            <Text style={styles.rideCancelText}>{languageJSON.sorry}</Text>

                            <View style={styles.horizontalLLine} />

                            <View style={styles.msgContainer}>
                                <Text style={styles.cancelMsgText}>{languageJSON.multipleBooking}</Text>
                            </View>
                            <View style={styles.okButtonContainer}>
                                <Button
                                    title={languageJSON.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { this.setState({ alertModalVisible: false }, () => { this.props.navigation.popToTop() }) }}
                                    buttonStyle={styles.okButtonStyle}
                                    containerStyle={styles.okButtonContainerStyle}
                                />
                            </View>

                        </View>

                    </View>
                </View>

            </Modal>
        )
    }

    //CONFRIM BOOKING
    bookNow() {
        var curuser = firebase.auth().currentUser.uid;
        const userData = firebase.database().ref('users/' + curuser + '/my-booking');
        userData.once('value', userBooking => {
            if (userBooking.val()) {
                let userBookings = userBooking.val();
                let flag = true;
                if (flag == true) {
                    console.log('this.state.region', this.state.region)
                    this.setState({ modalVisible: false }, () => {
                        var pickUp = { lat: this.state.region.wherelatitude, lng: this.state.region.wherelongitude, add: this.state.region.whereText };
                        var drop = { lat: this.state.region.droplatitude, lng: this.state.region.droplongitude, add: this.state.region.droptext };
                        var tripDate = new Date();
                        var otp = Math.floor(Math.random() * 90000) + 10000;

                        var data = {
                            carImage: this.state.carImage,
                            carType: this.state.carType,
                            customer: curuser,
                            customer_name: this.state.userDetails.firstName + ' ' + this.state.userDetails.lastName,
                            distance: this.state.distance,
                            driver: "",
                            driver_image: "",
                            driver_name: "",
                            drop: drop,
                            pickup: pickUp,
                            estimate: this.state.estimateFare,
                            estimateDistance: this.state.distance,
                            serviceType: 'pickUp',
                            status: "NEW",
                            total_trip_time: 0,
                            trip_cost: 0,
                            trip_end_time: "00:00",
                            trip_start_time: "00:00",
                            tripdate: tripDate.toString(),
                            estimate: this.state.estimateFare,
                            otp: otp,
                        }

                        var MyBooking = {
                            carType: this.state.carType,
                            carImage: this.state.carImage,
                            driver: "",
                            driver_image: "",
                            driver_name: "",
                            drop: drop,
                            pickup: pickUp,
                            estimate: this.state.estimateFare,
                            estimateDistance: this.state.distance,
                            serviceType: 'pickUp',
                            status: "NEW",
                            total_trip_time: 0,
                            trip_cost: 0,
                            trip_end_time: "00:00",
                            trip_start_time: "00:00",
                            tripdate: tripDate.toString(),
                            estimate: this.state.estimateFare,
                            coords: this.state.coords,
                            otp: otp,
                        }


                        if (data) {
                            firebase.database().ref('bookings/').push(data).then((res) => {
                                var bookingKey = res.key;
                                firebase.database().ref('users/' + curuser + '/my-booking/' + bookingKey + '/').set(MyBooking).then((res) => {
                                    this.setState({ currentBookingId: bookingKey }, () => {
                                        // finding driver
                                        var arr = [];
                                        const userData = firebase.database().ref('users/');
                                        userData.once('value', driverData => {
                                            if (driverData.val()) {
                                                var allUsers = driverData.val();
                                                for (key in allUsers) {
                                                    //checking if user is driver and it's a approved user and he/she is now free for take ride
                                                    if (allUsers[key].usertype == 'driver' && allUsers[key].approved == true && allUsers[key].queue == false && allUsers[key].driverActiveStatus == true) {
                                                        if (allUsers[key].location) {
                                                            var location1 = [this.state.region.wherelatitude, this.state.region.wherelongitude];// rider lat and lng
                                                            var location2 = [allUsers[key].location.lat, allUsers[key].location.lng];//Driver lat and lang
                                                            //calculate the distance of two locations
                                                            var distance = GeoFire.distance(location1, location2);
                                                            var originalDistance = (distance);
                                                            if (originalDistance <= 10) { // Request will be send if distance less than 10 km 
                                                                if (allUsers[key].carType == this.state.carType) {
                                                                    allUsers[key].driverUid = key;
                                                                    arr.push(allUsers[key].driverUid);
                                                                    firebase.database().ref('users/' + allUsers[key].driverUid + '/waiting_riders_list/' + bookingKey + '/').set(data);
                                                                    this.sendPushNotification(allUsers[key].driverUid, bookingKey, languageJSON.new_booking_request_push_notification)
                                                                }
                                                            }
                                                        }

                                                    }

                                                }
                                                let bookingData = {
                                                    bokkingId: bookingKey,
                                                    coords: this.state.coords,
                                                }
                                                //console.log(arr)
                                                setTimeout(() => {
                                                    if (arr.length > 0) {
                                                        // set all requested drivers data to main booking node
                                                        firebase.database().ref('bookings/' + bookingKey + '/').update({
                                                            requestedDriver: arr
                                                        }).then((res) => {
                                                            this.props.navigation.navigate('BookedCab', { passData: bookingData });
                                                        })
                                                    } else {
                                                        alert(languageJSON.driver_not_found);
                                                    }
                                                }, 300)

                                            }
                                        })

                                    })
                                })

                            })
                        }

                    })
                }

            } else {
                this.setState({ modalVisible: false, alertModalVisible: false }, () => {

                    pickUp = { lat: this.state.region.wherelatitude, lng: this.state.region.wherelongitude, add: this.state.region.whereText };
                    drop = { lat: this.state.region.droplatitude, lng: this.state.region.droplongitude, add: this.state.region.droptext };
                    var tripDate = new Date();
                    var otp = Math.floor(Math.random() * 90000) + 10000;

                    //data set for driver booking node 
                    var data = {
                        carType: this.state.carType,
                        carImage: this.state.carImage,
                        customer: curuser,
                        customer_name: this.state.userDetails.firstName + ' ' + this.state.userDetails.lastName,
                        distance: this.state.distance,
                        driver: "",
                        driver_image: "",
                        driver_name: "",
                        drop: drop,
                        pickup: pickUp,
                        estimate: this.state.estimateFare,
                        estimateDistance: this.state.distance,
                        serviceType: 'pickUp',
                        status: "NEW",
                        total_trip_time: 0,
                        trip_cost: 0,
                        trip_end_time: "00:00",
                        trip_start_time: "00:00",
                        tripdate: tripDate.toString(),
                        estimate: this.state.estimateFare,
                        otp: otp,
                    }


                    //data set for my booking node 
                    var MyBooking = {
                        carType: this.state.carType,
                        carImage: this.state.carImage,
                        driver: "",
                        driver_image: "",
                        driver_name: "",
                        drop: drop,
                        pickup: pickUp,
                        estimate: this.state.estimateFare,
                        estimateDistance: this.state.distance,
                        serviceType: 'pickUp',
                        status: "NEW",
                        total_trip_time: 0,
                        trip_cost: 0,
                        trip_end_time: "00:00",
                        trip_start_time: "00:00",
                        tripdate: tripDate.toString(),
                        estimate: this.state.estimateFare,
                        coords: this.state.coords,
                        otp: otp,
                    }

                    if (data) {

                        firebase.database().ref('bookings/').push(data).then((res) => {

                            var bookingKey = res.key;
                            firebase.database().ref('users/' + curuser + '/my-booking/' + bookingKey + '/').set(MyBooking).then((res) => {

                                this.setState({ currentBookingId: bookingKey }, () => {

                                    // finding driver
                                    var arr = [];
                                    const userData = firebase.database().ref('users/');
                                    userData.once('value', driverData => {
                                        if (driverData.val()) {
                                            var allUsers = driverData.val();
                                            for (key in allUsers) {
                                                //checking if user is driver and it's a approved user and he/she is now free for take ride
                                                if (allUsers[key].usertype == 'driver' && allUsers[key].approved == true && allUsers[key].queue == false && allUsers[key].driverActiveStatus == true) {
                                                    if (allUsers[key].location) {
                                                        var location1 = [this.state.region.wherelatitude, this.state.region.wherelongitude]; // rider lat and lng
                                                        var location2 = [allUsers[key].location.lat, allUsers[key].location.lng]; // driver lat and lng
                                                        //calculate the distance of two locations
                                                        var distance = GeoFire.distance(location1, location2);
                                                        var originalDistance = (distance);
                                                        if (originalDistance < 10) {// Request will be send if distance less than 10 km 
                                                            if (allUsers[key].carType == this.state.carType) {
                                                                allUsers[key].driverUid = key;
                                                                arr.push(allUsers[key].driverUid);
                                                                //console.log("Driver user id",allUsers[key].driverUid);
                                                                firebase.database().ref('users/' + allUsers[key].driverUid + '/waiting_riders_list/' + bookingKey + '/').set(data); //send request to driver who are available
                                                                this.sendPushNotification(allUsers[key].driverUid, bookingKey, languageJSON.new_booking_request_push_notification)
                                                            }
                                                        }
                                                    }

                                                }

                                            }

                                            let bookingData = {
                                                bokkingId: bookingKey,
                                                coords: this.state.coords,
                                            }
                                            if (arr.length > 0) {
                                                // set all requested drivers data to main booking node
                                                firebase.database().ref('bookings/' + bookingKey + '/').update({
                                                    requestedDriver: arr
                                                }).then((res) => {

                                                    this.props.navigation.navigate('BookedCab', { passData: bookingData });
                                                })
                                            } else {
                                                alert(languageJSON.driver_assign_messege);
                                                this.props.navigation.navigate('BookedCab', { passData: bookingData });
                                            }
                                        }
                                    })

                                })
                            })

                        })
                    }

                })
            }
        })
    }

    // Add promo user details to promo node
    addDetailsToPromo(offerkey, curUId) {
        //console.log('start working...'+offerkey)
        const promoData = firebase.database().ref('offers/' + offerkey);
        promoData.once('value', promo => {
            if (promo.val()) {
                // console.log('working...')
                //console.log(promo.val())
                let promoData = promo.val();
                let user_avail = promoData.user_avail;
                if (user_avail) {
                    //console.log('i am working')
                    firebase.database().ref('offers/' + offerkey + '/user_avail/details').push({
                        userId: curUId
                    }).then(() => {
                        firebase.database().ref('offers/' + offerkey + '/user_avail/').update({ count: user_avail.count + 1 })
                    })
                } else {
                    //console.log('i am working2')
                    firebase.database().ref('offers/' + offerkey + '/user_avail/details').push({
                        userId: curUId
                    }).then(() => {
                        firebase.database().ref('offers/' + offerkey + '/user_avail/').update({ count: 1 })
                    })
                }
            }
        })
    }
    sendPushNotification(customerUID, bookingId, msg) {
        const customerRoot = firebase.database().ref('users/' + customerUID);
        customerRoot.once('value', customerData => {
            if (customerData.val()) {
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken ? allData.pushToken : null, msg)
            }
        })
    }

    //confirm booking modal With fare details
    confirmBookModal() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({ modalVisible: false })
                }}>
                <View style={styles.modalContainer}>

                    <View style={styles.modalImageConttainer}>
                        <Image source={require('../../assets/images/transfer.png')} style={styles.modalImage} />
                    </View>
                    <View style={styles.modalInnerContainer}>

                        <View style={styles.modalInner}>

                            <View style={styles.fareTextContainer}>
                                <Text style={styles.fareText}>{languageJSON.fare_details}</Text>
                            </View>

                            <View style={styles.horizontalLine} />

                            <View style={styles.upperContainer}>
                                <View style={styles.fareDetailsContainer}>
                                    <View style={styles.fareDetails}>
                                        <Text style={styles.fareTitleText}>{languageJSON.base_fare}</Text>
                                        <Text style={styles.fareTitleText}>{languageJSON.convenience_free}</Text>
                                    </View>
                                    <View style={styles.verticalLine} />
                                    <View style={styles.farePriceContainer}>
                                        <Text style={styles.farePriceText}>{this.state.settings.symbol} {this.state.fareCost} </Text>
                                        <Text style={styles.farePriceText}>{this.state.settings.symbol} {this.state.convenience_fees ? this.state.convenience_fees : 0} </Text>
                                    </View>
                                </View>

                                <View style={styles.line} />

                                <View style={styles.totalPriceContainer}>
                                    <View style={styles.totalPrice}>
                                        <Text style={styles.totalPriceText}>{languageJSON.total_fare}</Text>
                                        <Text style={styles.taxText}>{languageJSON.inclusive_tax} </Text>
                                    </View>
                                    <View style={styles.totalPriceNumberContainer}>

                                        {this.state.userDetails ?

                                            <Text style={styles.totalPriceNumber}>{this.state.settings.symbol}{this.state.estimateFare}</Text>

                                            : null}

                                    </View>
                                </View>

                                <View style={styles.termsContainer}>
                                    <Text style={styles.termsText}> {languageJSON.nb}</Text>
                                </View>

                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={languageJSON.done}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { this.bookNow() }}
                                    buttonStyle={styles.doneButtonStyle}
                                />
                            </View>

                        </View>

                    </View>
                </View>

            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); } }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.confrim_booking}</Text>}
                    rightComponent={{ icon: 'ios-notifications', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.navigate('Notifications'); } }}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInnerStyle}
                />

                <View style={styles.topContainer}>
                    <View style={styles.topLeftContainer}>
                        <View style={styles.circle} />
                        <View style={styles.staightLine} />
                        <View style={styles.square} />
                    </View>
                    <View style={styles.topRightContainer}>
                        <TouchableOpacity style={styles.whereButton}>
                            <View style={styles.whereContainer}>
                                <Text numberOfLines={1} style={styles.whereText}>{this.state.region.whereText}</Text>
                                <Icon
                                    name='gps-fixed'
                                    color={colors.WHITE}
                                    size={23}
                                    containerStyle={styles.iconContainer}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropButton}>
                            <View style={styles.whereContainer}>
                                <Text numberOfLines={1} style={styles.whereText}>{this.state.region.droptext}</Text>
                                <Icon
                                    name='search'
                                    type='feather'
                                    color={colors.WHITE}
                                    size={23}
                                    containerStyle={styles.iconContainer}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mapcontainer}>
                    <MapView
                        ref={map => { this.map = map }}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: (this.state.region.wherelatitude ? this.state.region.wherelatitude : 22),
                            longitude: (this.state.region.wherelongitude ? this.state.region.wherelongitude : 88),
                            latitudeDelta: 0.9922,
                            longitudeDelta: 1.9421
                        }}
                    >
                        <Marker
                            coordinate={{ latitude: this.state.region.wherelatitude ? (this.state.region.wherelatitude) : 0.00, longitude: this.state.region.wherelongitude ? (this.state.region.wherelongitude) : 0.00 }}
                            title={this.state.region.whereText}
                            image={require('../../assets/images/rsz_2red_pin.png')}   
                            >
                        </Marker>


                        <Marker
                            coordinate={{ latitude: this.state.region.droplatitude ? (this.state.region.droplatitude) : 0.00, longitude: this.state.region.droplongitude ? (this.state.region.droplongitude) : 0.00 }}
                            title={this.state.region.droptext}
                            pinColor={colors.GREEN.default}
                            image={require('../../assets/images/rsz_2red_pin.png')}
                            >
                        </Marker>


                        <MapView.Polyline
                            coordinates={this.state.coords ? this.state.coords : { latitude: 0.00, longitude: 0.00 }}
                            strokeWidth={4}
                            strokeColor={colors.BLUE.default}
                        />

                    </MapView>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.offerContainer}>
                        <TouchableOpacity >
                            <Text style={styles.offerText}> {languageJSON.estimate_fare_text}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceDetailsContainer}>
                        <View style={styles.priceDetailsLeft}>
                            <View style={styles.priceDetails}>
                                <View style={styles.totalFareContainer}>
                                    <Text style={styles.totalFareText}>{languageJSON.total_fare}</Text>
                                </View>
                                <Icon
                                    name='info'
                                    color={colors.WHITE}
                                    type='simple-line-icon'
                                    size={15}
                                    containerStyle={styles.infoIcon}
                                />
                            </View>

                            <View style={styles.iconContainer}>
                                <Text style={styles.priceText}> {this.state.settings.symbol} {this.state.estimateFare}</Text>
                            </View>

                        </View>
                        <View style={styles.priceDetailsMiddle}>
                            <View style={styles.triangle} />
                            <View style={styles.lineHorizontal} />
                        </View>
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/images/paytm_logo.png')} style={styles.logoImage} />
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <View style={styles.iconContainer}>
                            <Button
                                title={languageJSON.cancel}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                titleStyle={styles.buttonText}
                                onPress={() => { this.onPressCancel() }}
                                buttonStyle={styles.buttonStyle}
                                containerStyle={styles.buttonContainerStyle}
                            />
                        </View>
                        <View style={styles.flexView}>
                            <Button
                                title={languageJSON.confrim_booking}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                titleStyle={styles.buttonText}
                                onPress={() => { this.setState({ modalVisible: true }) }}
                                buttonStyle={styles.confirmButtonStyle}
                                containerStyle={styles.confirmButtonContainerStyle}
                            />
                        </View>
                    </View>
                </View>
                {
                    this.confirmBookModal()
                }
                {
                    this.promoModal()
                }

                {
                    this.alertModal()
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight
    },
    topContainer: {
        flex: 1.5,
        flexDirection: 'row',
        borderTopWidth: 0,
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        paddingEnd: 20
    },
    topLeftContainer: {
        flex: 1.5,
        alignItems: 'center'
    },
    topRightContainer: {
        flex: 9.5,
        justifyContent: 'space-between',
    },
    circle: {
        height: 12,
        width: 12,
        borderRadius: 15 / 2,
        backgroundColor: colors.YELLOW.light
    },
    staightLine: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.YELLOW.light
    },
    square: {
        height: 14,
        width: 14,
        backgroundColor: colors.GREY.iconPrimary
    },
    whereButton: { flex: 1, justifyContent: 'center', borderBottomColor: colors.WHITE, borderBottomWidth: 1 },
    whereContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    whereText: { flex: 9, fontFamily: 'Roboto-Regular', fontSize: 14, fontWeight: '400', color: colors.WHITE },
    iconContainer: { flex: 1 },
    dropButton: { flex: 1, justifyContent: 'center' },
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
    bottomContainer: { flex: 2.5, alignItems: 'center' },
    offerContainer: { flex: 1, backgroundColor: colors.YELLOW.secondary, width: width, justifyContent: 'center', borderBottomColor: colors.YELLOW.primary, borderBottomWidth: Platform.OS == 'ios' ? 1 : 0 },
    offerText: { alignSelf: 'center', color: colors.GREY.btnPrimary, fontSize: 12, fontFamily: 'Roboto-Regular' },
    offerCodeText: {
        fontFamily: 'Roboto-Bold', fontSize: 14,
    },
    priceDetailsContainer: { flex: 2.3, backgroundColor: colors.WHITE, flexDirection: 'row', position: 'relative', zIndex: 1 },
    priceDetailsLeft: { flex: 19 },
    priceDetailsMiddle: { flex: 2, height: 50, width: 1, alignItems: 'center' },
    priceDetails: { flex: 1, flexDirection: 'row' },
    totalFareContainer: { flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
    totalFareText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 15 },
    infoIcon: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    priceText: { alignSelf: 'center', color: colors.GREY.iconSecondary, fontFamily: 'Roboto-Bold', fontSize: 20 },
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
            { rotate: '180deg' }
        ],
        marginTop: -1, overflow: 'visible'
    },
    lineHorizontal: { height: height / 18, width: 1, backgroundColor: colors.BLACK, alignItems: 'center', marginTop: 10 },
    logoContainer: { flex: 19, alignItems: 'center', justifyContent: 'center' },
    logoImage: { width: 80, height: 80 },
    buttonsContainer: { flex: 1.5, flexDirection: 'row' },
    buttonText: { color: colors.WHITE, fontFamily: 'Roboto-Bold', fontSize: 17, alignSelf: 'flex-end' },
    buttonStyle: { backgroundColor: colors.GREY.secondary, elevation: 0 },
    buttonContainerStyle: { flex: 1, backgroundColor: colors.GREY.secondary },
    confirmButtonStyle: { backgroundColor: colors.GREY.btnPrimary, elevation: 0 },
    confirmButtonContainerStyle: { flex: 1, backgroundColor: colors.GREY.btnPrimary },

    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background, overflow: 'visible' },
    modalImageConttainer: { alignItems: 'center', justifyContent: 'center', overflow: 'visible', position: 'relative', zIndex: 4, marginBottom: -40 },
    modalImage: { width: 90, height: 90, },
    modalInnerContainer: {
        height: 400, width: (width - 85), backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7, overflow: 'visible'
    },
    modalInner: { flex: 1, justifyContent: 'space-between', width: (width - 100), overflow: 'visible', },
    fareTextContainer: { flex: 0.7, borderBottomWidth: 5, borderBottomColor: colors.WHITE },
    fareText: { top: 40, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    horizontalLine: { width: width - 120, height: 1, marginTop: 3, backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center' },
    upperContainer: { flex: 3, alignItems: 'center' },
    fareDetailsContainer: { flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
    fareDetails: { flex: 1.2, alignItems: 'flex-start', justifyContent: 'space-between', paddingLeft: 20, paddingTop: 20 },
    fareTitleText: { flex: 1, fontFamily: 'Roboto-Bold', fontSize: 14, color: colors.BLACK },
    verticalLine: { width: 0.8, height: 100, backgroundColor: colors.GREY.iconSecondary, marginLeft: 1 },
    farePriceContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', paddingRight: 20, paddingTop: 20 },
    farePriceText: { flex: 1, fontFamily: 'Roboto-Regular', fontSize: 16, fontWeight: '900', color: colors.BLACK },
    discountPriceText: { flex: 1, fontFamily: 'Roboto-Regular', fontSize: 16, fontWeight: '900', color: colors.LIGHT_RED },
    line: { width: width - 120, height: 1, backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center', marginTop: 3 },
    totalPriceContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20 },
    totalPrice: { flex: 1.5, alignItems: 'flex-start' },
    totalPriceText: { flex: 0.5, paddingTop: 10, fontFamily: 'Roboto-Bold', fontSize: 16, fontWeight: '900', color: colors.BLACK },
    taxText: { flex: 1, marginTop: 0, fontFamily: 'Roboto-Regular', fontSize: 13, fontWeight: '900', color: colors.GREY.secondary },
    totalPriceNumberContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'space-between' },
    totalPriceNumber: { flex: 1, paddingTop: 10, fontFamily: 'Roboto-Bold', fontSize: 18, fontWeight: '900', color: colors.BLACK },
    termsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 },
    termsText: { flex: 1, fontFamily: 'Roboto-Regular', fontSize: 12, color: colors.GREY.btnSecondary },
    buttonContainer: { flex: 0.5, width: ((width - 85)), flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    doneButtonStyle: { backgroundColor: colors.GREY.iconSecondary, borderRadius: 0, elevation: 0 },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.WHITE
    },
    flexView: {
        flex: 1
    },
    //alert modal
    alertModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    alertModalInnerContainer: { height: 200, width: (width * 0.85), backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    alertContainer: { flex: 2, justifyContent: 'space-between', width: (width - 100) },
    rideCancelText: { flex: 1, top: 15, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    horizontalLLine: { width: (width - 110), height: 0.5, backgroundColor: colors.BLACK, alignSelf: 'center', },
    msgContainer: { flex: 2.5, alignItems: 'center', justifyContent: 'center' },
    cancelMsgText: { color: colors.BLACK, fontFamily: 'Roboto-Regular', fontSize: 15, alignSelf: 'center', textAlign: 'center' },
    okButtonContainer: { flex: 1, width: (width * 0.85), flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center' },
    okButtonStyle: { flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    okButtonContainerStyle: { flex: 1, width: (width * 0.85), backgroundColor: colors.GREY.iconSecondary, },
});
