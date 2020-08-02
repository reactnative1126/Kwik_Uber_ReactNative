
import React from 'react';
import {
    StyleSheet,
    View,
    PermissionsAndroid
} from 'react-native';
import haversine from "haversine";
import MapView, {
    Marker,
    AnimatedRegion,
    PROVIDER_GOOGLE
} from "react-native-maps";
import Polyline from '@mapbox/polyline';
import { GeoFire } from 'geofire';

import * as Permissions from 'expo-permissions';

import { colors } from '@constants/theme';
import configs from '@constants/configs';
import language from '@constants/language';
import { RequestPushMsg } from '@common/RequestPushMsg';
import * as firebase from 'firebase';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 22.6107983;
const LONGITUDE = 88.4429171;

export default class TrackNow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            })
        };
        const { duid, alldata } = this.props;

    }

    async componentDidMount() {
        const { coordinate } = this.state;
        this.requestCameraPermission();
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const { routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude
                };
                coordinate.timing(newCoordinate).start();
                this.setState({
                    latitude,
                    longitude,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled:
                        distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate
                });
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }
        );
        const { duid, alldata, bookingStatus } = this.props;
        if (duid && alldata) {
            let paramData = alldata;
            const dat = firebase.database().ref('users/' + duid + '/');
            setInterval(() => {


                dat.once('value', snapshot => {
                    if (snapshot.val() && snapshot.val().location) {
                        var data = snapshot.val().location;
                        if (data) {
                            this.setState({
                                allData: paramData,
                                destinationLoc: paramData.wherelatitude + ',' + paramData.wherelongitude,
                                startLoc: data.lat + ',' + data.lng,
                                latitude: data.lat, longitude: data.lng
                            }, () => {
                                //console.log(this.state.allData)
                                if (bookingStatus == 'ACCEPTED') {
                                    var location1 = [paramData.wherelatitude, paramData.wherelongitude];
                                    var location2 = [data.lat, data.lng];
                                    var distance = GeoFire.distance(location1, location2);
                                    var originalDistance = distance * 1000;
                                    // alert(originalDistance)
                                    if (originalDistance && originalDistance < 50) {
                                        if (!this.state.allData.flag) {
                                            this.setState({
                                                flag: false
                                            })
                                            const dat = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/');
                                            dat.once('value', snapshot => {
                                                if (snapshot.val() && snapshot.val().pushToken) {
                                                    RequestPushMsg(snapshot.val().pushToken, language.driver_near)
                                                    paramData.flag = true;
                                                }
                                            })
                                        }
                                    }
                                }
                                this.getDirections();
                            })
                        }
                    }
                })

            }, 10000)
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
    componentDidUpdate() {
        //console.log(this.state);
    }

    async getLocationAsync() {
        // const { Location, Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            // return Location.getCurrentPositionAsync({enableHighAccuracy: true});
        } else {
            throw new Error('Location permission not granted');
        }
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                // {
                //     title: language.location_permission,
                //     buttonNeutral: language.ask_me_later,
                //     buttonNegative: language.cancel,
                //     buttonPositive: language.no_driver_found_alert_OK_button
                // }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // find your origin and destination point coordinates and pass it to our method.
    async getDirections() {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.startLoc}&destination=${this.state.destinationLoc}&key=${configs.google_map_key}`)
            let respJson = await resp.json();
            console.log("respJson", respJson)
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords }, () => {
                setTimeout(() => {
                    if (this.map) {
                        this.map.fitToCoordinates([{ latitude: this.state.latitude, longitude: this.state.longitude }, { latitude: this.state.allData.wherelatitude, longitude: this.state.allData.wherelongitude }], {
                            edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                            animated: true,
                        })
                    };
                }, 1500);

            })
            return coords
        }
        catch (error) {
            alert(error)
            return error
        }
    }

    render() {
        return (
            <View style={styles.innerContainer}>
                <MapView
                    ref={map => { this.map = map }}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showUserLocation
                    followUserLocation
                    loadingEnabled
                    region={this.getMapRegion()}
                >
                    <MapView.Polyline
                        coordinates={this.state.coords ? this.state.coords : [{ latitude: 0.00, longitude: 0.00 }]}
                        strokeWidth={5}
                        strokeColor={colors.BLUE.default}
                    />
                    <MapView.Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />

                    <Marker
                        coordinate={{ latitude: this.state.allData ? this.state.allData.wherelatitude : 0.00, longitude: this.state.allData ? this.state.allData.wherelongitude : 0.00 }}
                        image={require('@assets/images/rsz_2red_pin.png')}
                    >
                    </Marker>


                    <Marker
                        coordinate={{ latitude: this.state.latitude ? this.state.latitude : 0.00, longitude: this.state.longitude ? this.state.longitude : 0.00 }}
                        image={require('@assets/images/track_Car.png')}
                    >
                    </Marker>


                </MapView>

            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        // marginTop: StatusBar.currentHeight,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: "flex-end",
        alignItems: "center",

    },
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
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,

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

});
