import React from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    Image,
    Text,
    Animated,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import ToggleSwitch from 'toggle-switch-react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
// import { GeoFire } from 'geofire';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import moment from 'moment';

import { connect } from 'react-redux';
import { setCustomer } from '@modules/account/actions';
import { setNotification, setBooking } from '@modules/booking/actions';
import { Loading, Rating } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API, { setClientToken } from '@services/API';

class Map extends React.Component {
    constructor(props) {
        super(props);
        Geocoder.init(configs.google_map_key);
        this.state = {
            loading: false,
            region: {
                latitude: configs.latitude,
                longitude: configs.longitude,
                latitudeDelta: configs.delta,
                longitudeDelta: configs.delta,
            },
            address: null,
            active: false
        }
    }

    componentDidMount() {
        this.setLatLong();
        setInterval(() => {
            this.setLatLong();
        }, 30000);

        if (this.props.user_info.availability == 1) {
            this.setState({ active: true });
        } else {
            this.setState({ active: false });
        }
    }

    async setLatLong() {
        if (Platform.OS === "ios") {
            const authorizationLevel = "always";
            let { status } = await Geolocation.requestAuthorization(authorizationLevel);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
            }
        }
        Geolocation.getCurrentPosition((location) => {
            Geocoder.from(location.coords.latitude, location.coords.longitude).then((json) => {
                this.setState({
                    region: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: configs.delta,
                        longitudeDelta: configs.delta,
                    },
                    address: json.results[0].formatted_address,
                    loading: false
                }, () => {
                    API.post('/submit_driver_location', {
                        driver_id: this.props.user_info.user_id,
                        api_token: this.props.user_info.api_token,
                        driver_lat: location.coords.latitude,
                        driver_long: location.coords.longitude
                    })
                });
            }).catch((error) => {
                this.setState({ loading: false });
            });
        }, (error) => {
            this.setState({ loading: false });
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        }, {
            enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
        });
    }

    async onLine(isOn) {
        let { user_info } = this.props;
        this.setState({ loading: true });
        API.post('/change_availability', {
            user_id: user_info.user_id,
            availability: isOn == true ? 1 : 0,
            api_token: user_info.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                user_info.availability = isOn == true ? 1 : 0
                this.setState({ loading: false, active: isOn });
                this.props.setUser(user_info);
            } else {
                this.setState({ loading: false });
                this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
            }
        }).catch((error) => {
            this.setState({ loading: false });
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    renderBooking() {
        const { user_info, customer_info, booking_info, notification } = this.props;
        return (
            <View style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                width: wp('100.0%'),
                height: hp('100.0%'),
                backgroundColor: '#000000BF',
                zIndex: 1001
            }}>
                <View style={{
                    width: '90%',
                    height: 560,
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    alignItems: 'center'
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        width: '100%',
                        height: 80,
                        borderBottomWidth: 1,
                        borderBottomColor: '#DDD'
                    }}>
                        <Text style={{ fontSize: 18, marginVertical: 2 }}>{notification && notification == "book_now_notification" && customer_info ? customer_info.customer_name : ''}</Text>
                        {/* <Rating rating={4} color='#FFCC01' size={30} /> */}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, height: 120 }}>
                        <Text style={{ color: '#555', marginBottom: 10 }}>Pickup Location</Text>
                        <Text style={{ fontSize: 14, textAlign: 'center' }}>{notification && notification == "book_now_notification" && booking_info ? booking_info.source_address : ''}</Text>
                    </View>
                    <Image source={images.img_arriving} style={{ width: 150, height: 150, borderRadius: 75 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, height: 120 }}>
                        <Text style={{ color: '#555', marginBottom: 10 }}>Destination Location</Text>
                        <Text style={{ fontSize: 14, textAlign: 'center' }}>{notification && notification == "book_now_notification" && booking_info ? booking_info.dest_address : ''}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity style={[styles.rideBtn, { backgroundColor: '#A8A8A8' }]} onPress={() => {
                            this.setState({ loading: true });
                            API.post('/reject_ride_request', {
                                booking_id: notification && notification == "book_now_notification" && booking_info ? booking_info.booking_id : 1,
                                api_token: user_info.api_token
                            }).then((response) => {
                                this.setState({ loading: false });
                                this.props.setNotification(null);
                                this.props.setCustomer(null);
                                this.props.setBooking(null);
                            }).catch((error) => {
                                this.setState({ loading: false });
                                this.props.setNotification(null);
                                this.props.setCustomer(null);
                                this.props.setBooking(null);
                            })
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>DECLINE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rideBtn} onPress={() => {
                            this.setState({ loading: true });
                            API.post('/accept_ride_request', {
                                booking_id: notification && notification == "book_now_notification" && booking_info ? booking_info.booking_id : 1,
                                api_token: user_info.api_token
                            }).then((response) => {
                                this.setState({ loading: false });
                                this.props.setNotification(null);
                                this.props.navigation.navigate('Track');
                            }).catch((error) => {
                                this.setState({ loading: false });
                                this.props.setNotification(null);
                            })
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000 }]}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={[styles.menuBTN, { marginLeft: 20 }]}
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={images.icon_menu} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 80, height: 30 }} source={images.icon_title} />
                </View>
                <View style={{ flex: 1 }} />
            </View>
        );
    }

    render() {
        const { user_info, customer_info, booking_info, notification } = this.props;
        return (
            <View style={styles.mainViewStyle}>
                <StatusBar
                    hidden={false}
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <MapView
                        // provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        loadingEnabled
                        showsMyLocationButton={false}
                        region={this.state.region}
                        style={[styles.map, { marginBottom: 0 }]}
                        onMapReady={() => this.setState({ marginBottom: 1 })}
                    >
                        <Marker.Animated
                            coordinate={{ latitude: this.state.region.latitude ? parseFloat(this.state.region.latitude) : 0.00, longitude: this.state.region.longitude ? parseFloat(this.state.region.longitude) : 0.00 }}
                        // image={require('@assets/images/available_car.png')}
                        >
                            <Image source={require('@assets/images/available_car.png')} style={{ width: 40, height: 20 }} />
                        </Marker.Animated>
                    </MapView>
                    {
                        notification && notification == "book_now_notification" ?
                            this.renderBooking() :
                            <View style={styles.black}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={user_info.profile_pic == null ? images.img_driver : { uri: configs.baseURL + '/uploads/' + user_info.profile_pic }}
                                        style={styles.imageStyle}
                                    />
                                    <View style={{ marginLeft: 10, width: wp('50.0%') }}>
                                        <Text style={{ fontSize: 18 }}>{user_info.user_name}</Text>
                                        <Text style={{ fontSize: 12, color: '#888' }}>{this.state.address}</Text>
                                    </View>
                                </View>
                                <View style={{ height: '100%', alignItems: 'center' }}>
                                    <ToggleSwitch
                                        isOn={this.state.active}
                                        onColor={'#01A457'}
                                        offColor={'#F1362F'}
                                        size="small"
                                        onToggle={isOn => this.onLine(isOn)}
                                    />
                                    <Text style={{ fontSize: 8, color: '#888' }}>{"GO ONLINE"}</Text>
                                </View>
                            </View>
                    }
                </SafeAreaView>
                <Loading loading={this.state.loading} />
                <Toast ref="toast" position='top' positionValue={50} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100.0%'),
        paddingLeft: 20,
        paddingRight: 20,
        height: Platform.OS === 'ios' ? 70 : 70
    },
    menuBTN: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF949",
        width: 40,
        height: 40,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    black: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: wp('100.0%'),
        height: 120,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.WHITE,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 5,
        padding: 20,
        zIndex: 1000
    },
    rideBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 5,
        width: '40%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#00963D',
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 5,
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    imageStyle: {
        width: 80,
        height: 80,
        borderRadius: 40
    }
});

const mapStateToProps = (state) => {
    return {
        user_info: state.account.user_info,
        customer_info: state.account.customer_info,
        booking_info: state.booking.booking_info,
        notification: state.booking.notification,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setCustomer: (data) => {
            dispatch(setCustomer(data))
        },
        setNotification: (data) => {
            dispatch(setNotification(data))
        },
        setBooking: (data) => {
            dispatch(setBooking(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);
