import React from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    TouchableOpacity,
    Text,
    Image,
    Linking
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
// import Geocoder from 'react-native-geocoding';
import haversine from "haversine";

import { connect } from 'react-redux';
import { Loading, Rating } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Track extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            status: 1,
            menu: false,
            latitude: parseFloat(this.props.booking_info.source_lat ? this.props.booking_info.source_lat : 0),
            longitude: parseFloat(this.props.booking_info.source_long ? this.props.booking_info.source_long : 0),
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: parseFloat(this.props.booking_info.source_lat ? this.props.booking_info.source_lat : 0),
                longitude: parseFloat(this.props.booking_info.source_long ? this.props.booking_info.source_long : 0),
                latitudeDelta: 0,
                longitudeDelta: 0
            })
        };
    }

    async UNSAFE_componentWillMount() {
        await navigator.geolocation.clearWatch(this.watchID);
    };

    async componentDidMount() {
        const { coordinate } = this.state;
        this.watchID = await navigator.geolocation.watchPosition(
            position => {
                const { routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude } = position.coords;
                const newCoordinate = {
                    latitude,
                    longitude
                };
                coordinate.timing(newCoordinate).start();
                this.setState({
                    latitude, longitude,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate
                });
                console.log(routeCoordinates);
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }
        );
    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: configs.delta,
        longitudeDelta: configs.delta
    });

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    async onArrived() {
        const { status } = this.state;
        const { user_info, booking_info } = this.props;
        if (status == 1) {
            this.setState({ status: 2 });
        } else if (status == 3) {
            this.setState({ status: 4, loading: true });
            // this.watchID = await navigator.geolocation.watchPosition(location => {
            let location = await Geolocation.getCurrentPosition({});
            if (location) {
                let latlng = location.coords.latitude + ',' + location.coords.longitude;
                fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + configs.google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({
                            source_lat: location.lcoords.atitude,
                            source_long: location.coords.longitude
                        })
                        API.post('/start_ride', {
                            booking_id: booking_info.booking_id ? booking_info.booking_id : 0,
                            source_address: responseJson.results[0].formatted_address,
                            source_lat: location.coords.latitude,
                            source_long: location.coords.longitude,
                            api_token: user_info.api_token
                        }).then((resp) => {
                            if (resp.data.success == 1) {
                                this.setState({ status: 4, loading: false });
                            } else {
                                console.log(resp.data.message);
                                this.setState({ loading: false });
                            }
                        }).catch((error) => {
                            console.log(error);
                            this.setState({ loading: false });
                        });
                    }).catch((error) => {
                        console.error(error);
                        this.setState({ loading: false });
                    })
            }
        } else if (status == 4) {
            this.setState({ loading: true });
            // this.watchID = await navigator.geolocation.watchPosition(location => {
            let location = await Geolocation.getCurrentPosition({});
            if (location) {
                let latlng = location.coords.latitude + ',' + location.coords.longitude;
                fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + configs.google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        let startLoc = '"' + this.state.source_lat + ', ' + this.state.source_long + '"';
                        let destLoc = '"' + location.coords.latitude + ', ' + location.coords.longitude + '"';
                        let arriveTime = this.getDriverTime(startLoc, destLoc);
                        API.post('/destination_reached', {
                            booking_id: booking_info.booking_id ? booking_info.booking_id : 0,
                            dest_address: responseJson.results[0].formatted_address,
                            dest_lat: location.coords.latitude,
                            dest_long: location.coords.longitude,
                            driving_time: arriveTime.time_in_secs,
                            total_kms: arriveTime.distance_in_meter,
                            api_token: user_info.api_token
                        }).then((resp) => {
                            if (resp.data.success == 1) {
                                this.setState({ loading: false });
                                this.props.navigation.navigate('Finish', { amount: resp.data.amount });
                            } else {
                                console.log(resp.data.message);
                                this.setState({ loading: false });
                            }
                        }).catch((error) => {
                            console.log(error);
                            this.setState({ loading: false });
                        });
                    }).catch((error) => {
                        console.error(error);
                        this.setState({ loading: false });
                    })
            };
        }
    }

    getDriverTime(startLoc, destLoc) {
        return new Promise(function (resolve, reject) {
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${startLoc}&destinations=${destLoc}&key=${configs.google_map_key}`)
                .then((response) => response.json())
                .then((res) =>
                    resolve({
                        distance_in_meter: res.rows[0].elements[0].distance.value,
                        time_in_secs: res.rows[0].elements[0].duration.value,
                        timein_text: res.rows[0].elements[0].duration.text
                    })
                )
                .catch(error => {
                    reject(error);
                    this.setState({ loading: false });
                });
        });
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000, backgroundColor: colors.WHITE }]}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {/* <TouchableOpacity
                        style={[styles.menuBTN, { marginLeft: 20 }]}
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={images.icon_menu} />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 80, height: 30 }} source={images.icon_title} />
                </View>
                <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 2 }}>
                    <TouchableOpacity
                        style={[styles.menuBTN, { backgroundColor: colors.WHITE }]}
                        onPress={() => this.setState({ menu: true })}>
                        <Icon name='ellipsis-v' type='font-awesome' size={25} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderDetails() {
        const { customer_info, booking_info } = this.props;
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
                    height: 350,
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    alignItems: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 20, paddingRight: 20,
                        width: '100%',
                        height: 50,
                        borderBottomWidth: 1,
                        borderBottomColor: '#DDD'
                    }}>
                        <View />
                        <Text style={{ fontSize: 18, marginVertical: 2 }}>{'Passenger Details'}</Text>
                        <TouchableOpacity onPress={() => this.setState({ menu: false })}>
                            <Icon name='close-circle-outline' type='material-community' size={25} />
                        </TouchableOpacity>
                    </View>
                    <Image source={customer_info.profile_pic == null ? images.img_avatar : { uri: configs.baseUrl + '/uploads/' + customer_info.profile_pic }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{customer_info.customer_name}</Text>
                    </View>
                    {/* <Rating rating={4.5} color='#FFCC01' size={40} /> */}

                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                        <TouchableOpacity style={styles.rideBtn2} onPress={() => this.props.navigation.navigate('Message')}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00963D' }}>MESSAGE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rideBtn2} onPress={() => Linking.openURL(`tel:+14157654856`)}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00963D' }}>CALL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderAlert() {
        const { customer_info, booking_info } = this.props;
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
                    height: 250,
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    alignItems: 'center'
                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, padding: 20 }}>
                        <Text style={{ color: '#555', marginBottom: 10, textAlign: 'center', fontSize: 18 }}>{'Are you sure you have arrived at pickup location of passenger? If yes click OK else Cancel.'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity style={[styles.rideBtn1, { backgroundColor: '#A8A8A8' }]} onPress={() => {
                            this.setState({
                                status: 1,
                                latitude: parseFloat(booking_info.dest_lat ? booking_info.dest_lat : 0),
                                longitude: parseFloat(booking_info.dest_long ? booking_info.dest_long : 0)
                            })
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rideBtn1} onPress={() => {
                            this.setState({
                                status: 3,
                                latitude: parseFloat(booking_info.dest_lat ? booking_info.dest_lat : 0),
                                longitude: parseFloat(booking_info.dest_long ? booking_info.dest_long : 0)
                            })
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { status } = this.state;
        const { user_info, customer_info, booking_info } = this.props;
        return (
            <View style={styles.mainViewStyle}>
                <StatusBar
                    hidden
                    backgroundColor={colors.WHITE}
                    barStyle="dark-content"
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <MapView
                        style={styles.map}
                        // provider={PROVIDER_GOOGLE}
                        showUserLocation
                        followUserLocation
                        loadingEnabled
                        region={this.getMapRegion()}
                    >
                        <MapView.Polyline
                            coordinates={this.state.coords ? this.state.coords : [{ latitude: 0.00, longitude: 0.00 }]}
                            strokeWidth={5}
                            strokeColor={'#FF0000'}
                        />
                        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
                        <Marker.Animated
                            ref={marker => {
                                this.marker = marker;
                            }}
                            image={require('@assets/images/track_Car.png')}
                            coordinate={new AnimatedRegion({
                                latitude: this.state.latitude ? this.state.latitude : 0.00,
                                longitude: this.state.longitude ? this.state.longitude : 0.00,
                                latitudeDelta: configs.delta,
                                longitudeDelta: configs.delta
                            })}
                        >
                            <Image source={require('@assets/images/track_Car.png')} style={{ width: 40, height: 40 }} />
                        </Marker.Animated>
                        <Marker
                            // image={require('@assets/images/green_pin.png')}
                            coordinate={{
                                latitude: booking_info.source_lat ? parseFloat(booking_info.source_lat) : 0.00,
                                longitude: booking_info.source_long ? parseFloat(booking_info.source_long) : 0.00
                            }}
                        >
                            <Image source={require('@assets/images/green_pin.png')} style={{ width: 50, height: 50 }} />
                        </Marker>
                        <Marker
                            // image={require('@assets/images/pink_pin.png')}
                            coordinate={{
                                latitude: booking_info.dest_lat ? parseFloat(booking_info.dest_lat) : 0.00,
                                longitude: booking_info.dest_long ? parseFloat(booking_info.dest_long) : 0.00
                            }}
                        >
                            <Image source={require('@assets/images/pink_pin.png')} style={{ width: 50, height: 50 }} />
                        </Marker>
                    </MapView>
                    <View style={{ width: wp('100.0%'), height: 50, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFF' }}>
                            {parseFloat(this.state.distanceTravelled).toFixed(2)} km away
                                </Text>
                    </View>
                    <View style={{ width: wp('100.0%'), height: 50, padding: 10, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.srcCircle} />
                            <Text>{booking_info.source_address ? booking_info.source_address.substring(1, 30) : ''}...</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.rideBtn} onPress={() => this.onArrived()}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>{status == 1 ? 'ARRIVING...' : status == 2 ? 'ARRIVED' : status == 3 ? 'SLIDE TO BEGIN' : 'SLIDE TO END TRIP'}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                {this.state.status == 2 ? this.renderAlert() : null}
                {this.state.menu ? this.renderDetails() : null}
                <Loading loading={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
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
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    latlng: {
        width: 200,
        alignItems: "stretch"
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent"
    },
    srcCircle: {
        marginLeft: 10, marginRight: 10,
        width: 10,
        height: 10,
        backgroundColor: '#04B273',
        borderRadius: 10,
        shadowColor: '#00F561',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    rideBtn: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100.0%'),
        height: 50,
        backgroundColor: '#00963D',
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 5,
    },
    rideBtn1: {
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
    rideBtn2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 5,
        width: '40%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
});

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info,
        customer_info: state.account.customer_info,
        booking_info: state.booking.booking_info
    }
}
export default connect(mapStateToProps, undefined)(Track)