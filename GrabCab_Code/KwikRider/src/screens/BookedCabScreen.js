import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    StatusBar,
    Linking,
} from 'react-native';
import { Icon, Button, Header } from 'react-native-elements';

import Polyline from '@mapbox/polyline';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import StarRating from 'react-native-star-rating';
import RadioForm from 'react-native-simple-radio-button';
var { width, height } = Dimensions.get('window');

import { TrackNow } from '@components';
import { colors } from '@constanst/theme';
import language from '@constanst/language';
import { RequestPushMsg } from '@constanst/RequestPushMsg';
import * as firebase from 'firebase';

export default class BookedCabScreen extends React.Component {
    getParamData;
    constructor(props) {
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
            coords: [

            ],
            radio_props: [],
            value: 0,
            driverSerach: true
        }
    }

    componentDidMount() {
        this.getParamData = this.props.navigation.getParam('passData');
        var curuser = firebase.auth().currentUser;
        let bookingResponse = firebase.database().ref(`users/` + curuser.uid + '/my-booking/' + this.getParamData.bokkingId);
        bookingResponse.on('value', currUserBookings => {
            if (currUserBookings.val()) {
                let region = {
                    wherelatitude: currUserBookings.val().pickup.lat,
                    wherelongitude: currUserBookings.val().pickup.lng,
                    droplatitude: currUserBookings.val().drop.lat,
                    droplongitude: currUserBookings.val().drop.lng,
                    whereText: currUserBookings.val().pickup.add,
                    droptext: currUserBookings.val().drop.add
                }
                this.setState({
                    coords: this.getParamData.coords,
                    region: region,
                    distance: currUserBookings.val().estimateDistance,
                    estimateFare: this.getParamData.estimate,
                    estimateTime: 0,
                    currentBookingId: this.getParamData.bokkingId,
                    currentUser: curuser,
                    bookingStatus: currUserBookings.val().status,
                    carType: currUserBookings.val().carType,
                    driverUID: currUserBookings.val().driver,
                    driverName: currUserBookings.val().driver_name,
                    driverPic: currUserBookings.val().driver_image,

                    driverContact: currUserBookings.val().driver_contact,
                    carModel: currUserBookings.val().vehicleModelName,
                    carNo: currUserBookings.val().vehicle_number,
                    starCount: currUserBookings.val().driverRating,
                    otp: currUserBookings.val().otp
                }, () => {
                    this.getCancelReasons();
                    this.getDirections('"' + this.state.region.wherelatitude + ', ' + this.state.region.wherelongitude + '"', '"' + this.state.region.droplatitude + ', ' + this.state.region.droplongitude + '"')
                })

                // Checking for booking status
                if (currUserBookings.val().status == "ACCEPTED") {
                    this.setState({
                        bookingStatus: currUserBookings.val().status,
                        driverSerach: false
                    })
                } else if (currUserBookings.val().status == "START") {
                    this.props.navigation.navigate('trackRide', { data: currUserBookings.val(), bId: this.getParamData.bokkingId });
                }
            }
        })

    }


    getCancelReasons() {
        const reasonListPath = firebase.database().ref('/cancel_reason/');
        reasonListPath.on('value', reasons => {
            if (reasons.val()) {
                this.setState({
                    radio_props: reasons.val()
                })
            }
        })
    }

    // find your origin and destination point coordinates and pass it to our method.
    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${configs.google_map_key}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords }, () => {
                // setTimeout(() => {
                //     this.map.fitToCoordinates([{latitude: this.state.region.wherelatitude, longitude: this.state.region.wherelongitude}, {latitude: this.state.region.droplatitude, longitude: this.state.region.droplongitude}], {
                //         edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                //         animated: true,
                //      })  
                // }, 1500);
            })
            return coords
        }
        catch (error) {
            alert(error)
            return error
        }
    }
    //Cancel button press
    onPressCancel(param) {

        this.setState({
            modalVisible: true,
            driverSerach: false
        });

    }
    dissMissCancel() {
        if (this.state.bookingStatus == "NEW") {
            this.setState({ modalVisible: false, driverSerach: true })
        } else {
            this.setState({ modalVisible: false })
        }
    }

    //cancel modal ok button press
    onCancelConfirm() {
        this.setState({ modalVisible: false }, () => {
            setTimeout(() => {
                // update status for rider booking node
                firebase.database().ref(`/users/` + this.state.currentUser.uid + '/my-booking/' + this.state.currentBookingId + '/').update({
                    status: 'CANCELLED',
                    reason: this.state.radio_props[this.state.value].label

                }).then(() => {
                    //remove booking request from requested driver
                    const requestedDriver = firebase.database().ref('bookings/' + this.state.currentBookingId + '/requestedDriver');
                    requestedDriver.once('value', drivers => {
                        if (drivers.val()) {
                            let requetedDrivers = drivers.val();
                            let count = 0;
                            for (i = 0; i < requetedDrivers.length; i++) {
                                firebase.database().ref(`/users/` + requetedDrivers[i] + '/waiting_riders_list/' + this.state.currentBookingId + '/').remove();
                                count = count + 1;
                            }
                            if (count == requetedDrivers.length) {
                                firebase.database().ref('bookings/' + this.state.currentBookingId + '/requestedDriver/').remove();
                            }
                        }
                    })
                    // update status for main booking node
                    firebase.database().ref(`bookings/` + this.state.currentBookingId + '/').update({
                        status: 'CANCELLED',
                        reason: this.state.radio_props[this.state.value].label
                    }).then(() => {
                        // It will work if driver accept the rides
                        firebase.database().ref(`/users/` + this.state.driverUID + '/my_bookings/' + this.state.currentBookingId + '/').on('value', curbookingData => {
                            if (curbookingData.val()) {
                                //  console.log(curbookingData.val())
                                if (curbookingData.val().status == 'ACCEPTED') {
                                    firebase.database().ref(`/users/` + curbookingData.val().driver + '/my_bookings/' + this.state.currentBookingId + '/').update({
                                        status: 'CANCELLED',
                                        reason: this.state.radio_props[this.state.value].label
                                    }).then(() => {
                                        firebase.database().ref(`/users/` + this.state.driverUID + '/').update({ queue: false })
                                        this.setState({ alertModalVisible: true });
                                        this.sendPushNotification(curbookingData.val().driver, this.state.currentBookingId, this.state.driverName + ' has cancelled the current booking')
                                    })
                                }
                            } else {
                                this.setState({ alertModalVisible: true });
                            }
                        })
                    })
                })
            }, 500);
        })
    }

    //call driver button press
    onPressCall(phoneNumber) {
        Linking.canOpenURL(phoneNumber).then(supported => {
            if (!supported) {
                console.log('Can\'t handle Phone Number: ' + phoneNumber);
            } else {
                return Linking.openURL(phoneNumber);
            }
        }).catch(err => console.error('An error occurred', err));
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
    //caacel modal design
    cancelModal() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({ modalVisible: false })
                }}>
                <View style={styles.cancelModalContainer}>
                    <View style={styles.cancelModalInnerContainer}>

                        <View style={styles.cancelContainer}>
                            <View style={styles.cancelReasonContainer}>
                                <Text style={styles.cancelReasonText}>{language.cancel_reason_modal_title}</Text>
                            </View>

                            <View style={styles.radioContainer}>
                                <RadioForm
                                    radio_props={this.state.radio_props ? this.state.radio_props : null}
                                    initial={0}
                                    animation={false}
                                    buttonColor={colors.GREY.secondary}
                                    selectedButtonColor={colors.GREY.secondary}
                                    buttonSize={10}
                                    buttonOuterSize={20}
                                    style={styles.radioContainerStyle}
                                    labelStyle={styles.radioText}
                                    radioStyle={styles.radioStyle}
                                    onPress={(value) => { this.setState({ value: value }) }}
                                />
                            </View>
                            <View style={styles.cancelModalButtosContainer}>
                                <Button
                                    title={language.dont_cancel_text}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { this.dissMissCancel() }}
                                    buttonStyle={styles.cancelModalButttonStyle}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />

                                <View style={styles.buttonSeparataor} />

                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { this.onCancelConfirm() }}
                                    buttonStyle={styles.cancelModalButttonStyle}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />
                            </View>

                        </View>


                    </View>
                </View>

            </Modal>
        )
    }

    //ride cancel confirm modal design
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

                            <Text style={styles.rideCancelText}>{language.rider_cancel_text}</Text>

                            <View style={styles.horizontalLLine} />

                            <View style={styles.msgContainer}>
                                <Text style={styles.cancelMsgText}>{language.cancel_messege1}  {this.state.currentBookingId} {language.cancel_messege2} </Text>
                            </View>
                            <View style={styles.okButtonContainer}>
                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { this.setState({ alertModalVisible: false, currentBookingId: null }, () => { this.props.navigation.popToTop() }) }}
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
    chat() {
        this.props.navigation.navigate("onlineChat", { passData: this.getParamData })
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); } }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{language.booked_cab_title}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInner}
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
                                <Text numberOfLines={1} style={styles.whereText}>{this.state.region.whereText ? this.state.region.whereText : ""}</Text>
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
                                <Text numberOfLines={1} style={styles.whereText}>{this.state.region.droptext ? this.state.region.droptext : ""}</Text>
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
                    {this.state.driverUID && this.state.region && this.state.bookingStatus ?
                        <TrackNow duid={this.state.driverUID} alldata={this.state.region} bookingStatus={this.state.bookingStatus} /> :
                        <MapView
                            ref={map => { this.map = map }}
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: this.state.region.wherelatitude ? this.state.region.wherelatitude : 22,
                                longitude: this.state.region.wherelongitude ? this.state.region.wherelongitude : 88,
                                latitudeDelta: 0.9922,
                                longitudeDelta: 1.9421
                            }}
                        >
                            {this.state.region.wherelatitude ?
                                <Marker
                                    coordinate={{ latitude: this.state.region ? (this.state.region.wherelatitude) : 0.00, longitude: this.state.region.wherelongitude ? (this.state.region.wherelongitude) : 0.00 }}
                                    title={this.state.region.whereText}
                                //description={'marker_description_1'}
                                />
                                : null}
                            {this.state.region.droplatitude ?
                                <Marker
                                    coordinate={{ latitude: this.state.region ? (this.state.region.droplatitude) : 0.00, longitude: this.state.region.droplongitude ? (this.state.region.droplongitude) : 0.00 }}
                                    title={this.state.region.droptext}
                                    //description={'marker_description_2'}
                                    pinColor={colors.GREEN.default}
                                />
                                : null}
                            {this.state.coords ?

                                <MapView.Polyline
                                    coordinates={this.state.coords ? this.state.coords : { latitude: 0.00, longitude: 0.00 }}
                                    strokeWidth={4}
                                    strokeColor={colors.BLUE.default}
                                />
                                : null}

                        </MapView>
                    }





                    <TouchableOpacity
                        style={styles.floatButtonStyle}
                        onPress={() => this.chat()}
                    >
                        <Icon
                            name="ios-chatbubbles"
                            type="ionicon"
                            // icon: 'chat', color: '#fff',
                            size={30}
                            color={colors.WHITE}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.otpContainer}>
                        <Text style={styles.cabText}>{language.you_selected} <Text style={styles.cabBoldText}>{this.state.carType}</Text></Text>
                        <Text style={styles.otpText}>{language.otp} {this.state.otp}</Text>

                    </View>
                    <View style={styles.cabDetailsContainer}>
                        {this.state.bookingStatus == "NEW" ? null :
                            <View style={styles.cabDetails}>
                                <View style={styles.cabName}>
                                    <Text style={styles.cabNameText}>{this.state.carModel ? this.state.carModel : null}</Text>
                                </View>

                                <View style={styles.cabPhoto}>
                                    <Image source={require('../../assets/images/swiftDesire.png')} resizeMode={'contain'} style={styles.cabImage} />
                                </View>

                                <View style={styles.cabNumber}>
                                    <Text style={styles.cabNumberText}>{this.state.carNo ? this.state.carNo : null}</Text>
                                </View>

                            </View>
                        }
                        {this.state.bookingStatus == "NEW" ? null :
                            <View style={styles.verticalDesign}>
                                <View style={styles.triangle} />
                                <View style={styles.verticalLine} />
                            </View>
                        }
                        {this.state.bookingStatus == "NEW" ? null :
                            <View style={styles.driverDetails}>
                                <View style={styles.driverPhotoContainer}>
                                    <Image source={this.state.driverPic ? { uri: this.state.driverPic } : require('../../assets/images/profilePic.png')} style={styles.driverPhoto} />
                                </View>
                                <View style={styles.driverNameContainer}>
                                    <Text style={styles.driverNameText}>{this.state.driverName ? this.state.driverName : null}</Text>
                                </View>
                                <View style={styles.ratingContainer}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={height / 42}
                                        fullStar={'ios-star'}
                                        halfStar={'ios-star-half'}
                                        emptyStar={'ios-star-outline'}
                                        iconSet={'Ionicons'}
                                        fullStarColor={colors.YELLOW.primary}
                                        emptyStarColor={colors.YELLOW.primary}
                                        halfStarColor={colors.YELLOW.primary}
                                        rating={parseInt(this.state.starCount)}
                                        containerStyle={styles.ratingContainerStyle}
                                    />
                                </View>
                            </View>
                        }
                    </View>
                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={language.cancel_ride}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                titleStyle={styles.buttonTitleText}
                                onPress={() => { this.onPressCancel(null) }}
                                buttonStyle={styles.cancelButtonStyle}
                                containerStyle={styles.cancelButtonContainerStyle}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                disabled={this.state.bookingStatus == "NEW" ? true : false}
                                title={language.call_driver}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                titleStyle={styles.buttonTitleText}
                                onPress={() => { this.onPressCall('tel:' + this.state.driverContact) }}
                                buttonStyle={styles.callButtonStyle}
                                containerStyle={styles.callButtonContainerStyle}
                            />
                        </View>
                    </View>
                </View>
                {
                    this.cancelModal()
                }
                {
                    this.alertModal()
                }

                {/* Booking Modal */}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.driverSerach}
                    onRequestClose={() => {
                        Alert.alert(language.modal_closed);
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '80%', backgroundColor: "#FFF", borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1, maxHeight: 310 }}>
                            <View style={{ marginTop: 15 }}>
                                <Image source={require('../../assets/images/lodingDriver.gif')} resizeMode={'contain'} style={{ width: 160, height: 160, marginTop: 15 }} />
                                <View><Text style={{ color: colors.BLUE.default.primary, fontSize: 16, marginTop: 12 }}>{language.driver_assign_messege}</Text></View>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        title={language.cancel_ride}
                                        loading={false}
                                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                        titleStyle={styles.buttonTitleText}
                                        onPress={() => { this.onPressCancel('fromLoading') }}
                                        buttonStyle={styles.cancelButtonStyle}
                                        containerStyle={{ marginTop: 30 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }



}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.WHITE, marginTop: StatusBar.currentHeight },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    headerInner: {
        marginLeft: 10,
        marginRight: 10
    },
    topContainer: { flex: 1.5, flexDirection: 'row', borderTopWidth: 0, alignItems: 'center', backgroundColor: colors.GREY.default, paddingEnd: 20 },
    topLeftContainer: {
        flex: 1.5,
        alignItems: 'center'
    },
    topRightContainer: {
        flex: 9.5,
        justifyContent: 'space-between',
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 15 / 2,
        backgroundColor: colors.YELLOW.light
    },
    staightLine: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.YELLOW.light
    },
    square: {
        height: 17,
        width: 17,
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
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    bottomContainer: { flex: 2.5, alignItems: 'center' },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    otpContainer: { flex: 0.8, backgroundColor: colors.YELLOW.secondary, width: width, flexDirection: 'row', justifyContent: 'space-between' },
    cabText: { paddingLeft: 10, alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Regular' },
    cabBoldText: { fontFamily: 'Roboto-Bold' },
    otpText: { paddingRight: 10, alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Bold' },
    cabDetailsContainer: { flex: 2.5, backgroundColor: colors.WHITE, flexDirection: 'row', position: 'relative', zIndex: 1 },
    cabDetails: { flex: 19 },
    cabName: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    cabNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    cabPhoto: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabImage: { width: 150, height: height / 22 },
    cabNumber: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabNumberText: { color: colors.GREY.iconSecondary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    verticalDesign: { flex: 2, height: 50, width: 1, alignItems: 'center' },
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

        marginTop: -1,
        overflow: 'visible'
    },
    verticalLine: { height: height / 18, width: 0.5, backgroundColor: colors.BLACK, alignItems: 'center', marginTop: 10 },
    driverDetails: { flex: 19, alignItems: 'center', justifyContent: 'center' },
    driverPhotoContainer: { flex: 5.4, justifyContent: 'flex-end', alignItems: 'center' },
    driverPhoto: { borderRadius: height / 20 / 2, width: height / 20, height: height / 20 },
    driverNameContainer: { flex: 2.2, alignItems: 'center', justifyContent: 'center' },
    driverNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 14 },
    ratingContainer: { flex: 2.4, alignItems: 'center', justifyContent: 'center' },
    ratingContainerStyle: { marginTop: 2, paddingBottom: Platform.OS == 'android' ? 5 : 0 },
    buttonsContainer: { flex: 1.5, flexDirection: 'row' },
    buttonContainer: { flex: 1 },
    buttonTitleText: { color: colors.WHITE, fontFamily: 'Roboto-Bold', fontSize: 18, alignSelf: 'flex-end' },
    cancelButtonStyle: { backgroundColor: colors.GREY.secondary, elevation: 0 },
    cancelButtonContainerStyle: { flex: 1, backgroundColor: colors.GREY.secondary },
    callButtonStyle: { backgroundColor: colors.GREY.btnPrimary, elevation: 0 },
    callButtonContainerStyle: { flex: 1, backgroundColor: colors.GREY.btnPrimary },

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

    //cancel modal
    cancelModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    cancelModalInnerContainer: { height: 400, width: width * 0.85, padding: 0, backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    cancelContainer: { flex: 1, justifyContent: 'space-between', width: (width * 0.85) },
    cancelReasonContainer: { flex: 1 },
    cancelReasonText: { top: 10, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    radioContainer: { flex: 8, alignItems: 'center' },
    radioText: { fontSize: 16, fontFamily: 'Roboto-Medium', color: colors.DARK, },
    radioContainerStyle: { paddingTop: 30, marginLeft: 10 },
    radioStyle: { paddingBottom: 25 },
    cancelModalButtosContainer: { flex: 1, flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    buttonSeparataor: { height: height / 35, width: 0.5, backgroundColor: colors.WHITE, alignItems: 'center', marginTop: 3 },
    cancelModalButttonStyle: { backgroundColor: colors.GREY.iconSecondary, borderRadius: 0 },
    cancelModalButtonContainerStyle: { flex: 1, width: (width * 2) / 2, backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center', margin: 0 },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.WHITE
    },
    floatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
});