import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    Image,
    Text,
    Platform,
    Alert,
    Modal,
    TouchableOpacity,
    AsyncStorage,
    ScrollView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SwitchSelector from 'react-native-switch-selector';
import StepIndicator from 'react-native-step-indicator';
import AModal from 'react-native-modalbox';
import { Icon, Button, Avatar } from 'react-native-elements';
import * as Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { GeoFire } from 'geofire';
import { AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import * as firebase from 'firebase';
import { Header, MapComponent } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';

const tabs = [
    { label: 'Black', value: 1 },
    { label: 'Automotive', value: 2 },
    { label: 'services', value: 3 }
]

const drivers = [
    { index: 1, type: 1, image: images.img_uber, title: 'Uber Black', description: '(Recommend)', time: 5, active: false },
    { index: 2, type: 1, image: images.img_lyft, title: 'Lyft Premier', description: '(Recommend)', time: 7, active: false },
    { index: 3, type: 2, image: images.img_driver, title: 'Jane Pohlson', description: 'Audi A6 Sedan', time: 4.9, active: false },
    { index: 4, type: 2, image: images.img_driver, title: 'James Bond', description: 'Benzu A6 Sedan', time: 3.9, active: false },
]

const thirdIndicatorStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 20,
    // separatorStrokeWidth: 2,
    // currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#00963D',
    // stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#00963D',
    stepStrokeUnFinishedColor: '#dedede',
    separatorFinishedColor: '#00963D',
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: '#00963D',
    stepIndicatorUnFinishedColor: '#dedede',
    stepIndicatorCurrentColor: '#00963D',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    labelFontFamily: 'OpenSans-Italic',
    currentStepLabelColor: '#7eaec4'
}

export default class Map extends React.Component {
    bonusAmmount = 0;
    constructor(props) {
        super(props);
        Geocoder.init(configs.google_map_key);
        this.state = {
            loadingModal: false,
            giftModal: false,
            location: null,
            errorMessage: null,
            region: {
                latitude: 9.061460,
                longitude: 7.500640,
                latitudeDelta: 0.9922,
                longitudeDelta: 0.9421,
            },
            whereText: language.map_screen_where_input_text,
            dropText: language.map_screen_drop_input_text,
            backgroundColor: colors.WHITE,
            carType: "",
            coordinate: new AnimatedRegion({
                latitude: 9.061460,
                longitude: 7.500640,
            }),
            allRiders: [],
            passData: {
                droplatitude: 0,
                droplongitude: 0,
                droptext: "",
                whereText: "",
                wherelatitude: 0,
                wherelongitude: 0,
                carType: '',
            },
            allCars: [],
            nearby: [],
            mainCarTypes: [],
            checkCallLocation: '',
            freeCars: [],
            settings: {
                symbol: '',
                code: '',
                cash: false,
                wallet: false,
                braintree: false,
                stripe: false
            },
            selected: 'drop',
            mapChanging: false,

            car_type: '',
            active: true,
            tab: 1,
            step: 0
        }
    }

    allCarsData() {
        const cars = firebase.database().ref('rates/car_type');
        cars.once('value', allCars => {
            if (allCars.val()) {
                let cars = allCars.val()
                let arr = [];
                for (key in cars) {
                    cars[key].minTime = ''
                    cars[key].available = true;
                    cars[key].active = false;
                    arr.push(cars[key]);
                }
                this.setState({ mainCarTypes: arr });
            }
        })
    }

    async componentWillMount() {
        if (Platform.OS === 'android' && !Constants.default.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            if (this.state.passData.wherelatitude == 0) {
                this._getLocationAsync();
            }
        }

        let searchObj = await this.props.navigation.getParam('searchObj') ? this.props.navigation.getParam('searchObj') : null;
        if (searchObj) {
            if (searchObj.searchFrom == 'where') {
                if (searchObj.searchDetails) {
                    this.setState({
                        region: {
                            latitude: searchObj.searchDetails.geometry.location.lat,
                            longitude: searchObj.searchDetails.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        },
                        whereText: searchObj.whereText,
                        dropText: searchObj.dropText,
                        carType: this.state.passData.carType,
                        // loadingModal: true,
                        passData: this.props.navigation.getParam('old'),
                        checkCallLocation: 'navigation',
                        selected: 'pickup'
                    }, () => {
                        this.getDrivers();
                    })
                }
            } else {
                if (searchObj.searchDetails) {
                    this.setState({
                        region: {
                            latitude: searchObj.searchDetails.geometry.location.lat,
                            longitude: searchObj.searchDetails.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        },
                        whereText: searchObj.whereText,
                        dropText: searchObj.dropText,
                        passData: this.props.navigation.getParam('old'),
                        carType: this.state.passData.carType,
                        // loadingModal: true,
                        checkCallLocation: 'navigation',
                        selected: 'drop'
                    }, () => {
                        this.getDrivers();
                    })
                }
            }

        }

        this.allCarsData();
        this.onPressModal();
    }

    _retrieveSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('settings');
            if (value !== null) {
                this.setState({ settings: JSON.parse(value) });
            }
        } catch (error) {
            console.log("Asyncstorage issue 9");
        }
    };


    componentDidMount() {
        this._retrieveSettings();
        setInterval(() => {
            if (this.state.passData && this.state.passData.wherelatitude) {
                this.setState({
                    checkCallLocation: 'interval'
                })
                this.getDrivers();
            }
        }, 30000)
    }

    loading() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.loadingModal}
                onRequestClose={() => {
                    this.setState({ loadingModal: false })
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
                            <Image
                                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                                source={require('@assets/images/loader.gif')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#000", fontSize: 16, }}>{language.driver_finding_alert}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    _getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({})
        if (location) {
            var pos = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            var curuser = firebase.auth().currentUser.uid;

            if (pos) {
                let latlng = pos.latitude + ',' + pos.longitude;
                return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + configs.google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (this.state.passData.wherelatitude == 0) {
                            this.setState({
                                whereText: responseJson.results[0].formatted_address,
                                region: {
                                    latitude: pos.latitude,
                                    longitude: pos.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                },
                                loadingModal: true,
                            }, () => {


                                let obj = {}
                                obj = this.state.passData;
                                obj.wherelatitude = pos.latitude
                                obj.wherelongitude = pos.longitude
                                obj.whereText = responseJson.results[0].formatted_address;
                                this.setState({
                                    passData: obj,
                                    checkCallLocation: 'navigation',
                                    mapChanging: true
                                })
                                this.getDrivers();
                                firebase.database().ref('users/' + curuser + '/location').update({
                                    add: responseJson.results[0].formatted_address,
                                    lat: pos.latitude,
                                    lng: pos.longitude
                                })
                            });

                        } else {
                            this.setState({ loadingModal: true });
                            let obj = {}
                            obj = this.state.passData;
                            obj.wherelatitude = pos.latitude
                            obj.wherelongitude = pos.longitude
                            obj.whereText = responseJson.results[0].formatted_address;
                            this.setState({
                                passData: obj,
                                checkCallLocation: 'navigation',
                                mapChanging: true
                            })
                            this.getDrivers();
                            firebase.database().ref('users/' + curuser + '/location').update({
                                add: responseJson.results[0].formatted_address,
                                lat: pos.latitude,
                                lng: pos.longitude
                            })
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }

    //Go to confirm booking page
    onPressBook() {
        if ((this.state.passData.whereText == "" || this.state.passData.wherelatitude == 0 || this.state.passData.wherelongitude == 0) && (this.state.passData.dropText == "" || this.state.passData.droplatitude == 0 || this.state.passData.droplongitude == 0)) {
            alert(language.pickup_and_drop_location_blank_error)
        } else {
            if (this.state.passData.whereText == "" || this.state.passData.wherelatitude == 0 || this.state.passData.wherelongitude == 0) {
                alert(language.pickup_location_blank_error)
            } else if (this.state.passData.dropText == "" || this.state.passData.droplatitude == 0 || this.state.passData.droplongitude == 0) {
                alert(language.drop_location_blank_error)
            } else if (this.state.passData.carType == "" || this.state.passData.carType == undefined) {
                alert(language.car_type_blank_error)
            } else {
                this.state.passData.latitudeDelta = "0.0922";
                this.state.passData.longitudeDelta = "0.0421";

                this.props.navigation.navigate('FareDetails', { data: this.state.passData, carType: this.state.passData.carType, carimage: this.state.passData.carImage });
            }
        }
    }

    selectCarType(value, key) {

        let allCars = this.state.allCars;
        for (let i = 0; i < allCars.length; i++) {
            allCars[i].active = false;
            if (i == key) {
                allCars[i].active = true;
            }
        }
        this.setState({
            allCars: allCars
        }, () => {
            this.state.passData.carType = value.name;
            this.state.passData.carImage = value.image;
        })
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
                });
        });
    }

    async getDrivers() {
        const userData = firebase.database().ref('users/');
        userData.once('value', userData => {
            if (userData.val()) {
                let allUsers = userData.val();
                this.prepareDrivers(allUsers);
            }
        })
    }

    async prepareDrivers(allUsers) {
        let availableDrivers = [];
        let freeCars = []; //Only for Ukraine Project
        let arr = {};
        let riderLocation = [this.state.passData.wherelatitude, this.state.passData.wherelongitude];
        let startLoc = '"' + this.state.passData.wherelatitude + ', ' + this.state.passData.wherelongitude + '"';
        for (let key in allUsers) {
            let driver = allUsers[key];
            if ((driver.usertype) && (driver.usertype == 'driver') && (driver.approved == true) && (driver.queue == false) && (driver.driverActiveStatus == true)) {

                if (driver.location) {
                    let driverLocation = [driver.location.lat, driver.location.lng];
                    let distance = GeoFire.distance(riderLocation, driverLocation);
                    freeCars.push(driver);
                    if (distance < 10) {
                        let destLoc = '"' + driver.location.lat + ', ' + driver.location.lng + '"';
                        driver.arriveDistance = distance;
                        driver.arriveTime = await this.getDriverTime(startLoc, destLoc);
                        let carType = driver.carType;
                        if (arr[carType] && arr[carType].drivers) {
                            arr[carType].drivers.push(driver);
                            if (arr[carType].minDistance > distance) {
                                arr[carType].minDistance = distance;
                                arr[carType].minTime = driver.arriveTime.timein_text;
                            }
                        } else {
                            arr[carType] = {};
                            arr[carType].drivers = [];
                            arr[carType].drivers.push(driver);
                            arr[carType].minDistance = distance;
                            arr[carType].minTime = driver.arriveTime.timein_text;
                        }
                        availableDrivers.push(driver);

                    }
                }
            }
        }

        const allCars = this.state.mainCarTypes.slice();

        for (let i = 0; i < allCars.length; i++) {
            if (arr[allCars[i].name]) {
                allCars[i].nearbyData = arr[allCars[i].name].drivers;
                allCars[i].minTime = arr[allCars[i].name].minTime;
                allCars[i].available = true;
            } else {
                allCars[i].minTime = '';
                allCars[i].available = false;
            }
            allCars[i].active = false;
        }

        this.setState({
            allCars: allCars,
            loadingModal: false,
            nearby: availableDrivers,
            freeCars: freeCars
        });

        if (availableDrivers.length == 0) {
            this.showNoDriverAlert();
        }
    }

    showNoDriverAlert() {
        if (this.state.checkCallLocation == 'navigation' || this.state.checkCallLocation == 'moveMarker') {
            Alert.alert(
                language.no_driver_found_alert_title,
                language.no_driver_found_alert_messege,
                [
                    {
                        text: language.no_driver_found_alert_OK_button,
                        onPress: () => this.setState({ loadingModal: false }),
                    },
                    { text: language.no_driver_found_alert_TRY_AGAIN_button, onPress: () => { this._getLocationAsync() }, style: 'cancel', },
                ],
                { cancelable: true },
            )
        }
    }

    onPressCancel() {
        this.setState({
            giftModal: false
        })
    }


    bonusModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.giftModal}
                onRequestClose={() => {
                    this.setState({ giftModal: false })
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', backgroundColor: "#fffcf3", borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1, maxHeight: 325 }}>
                        <View style={{ marginTop: 0, alignItems: "center" }}>
                            <Avatar
                                rounded
                                size={200}
                                source={require('@assets/images/gift.gif')}
                                containerStyle={{ width: 200, height: 200, marginTop: 0, alignSelf: "center", position: "relative" }}
                            />
                            <Text style={{ color: "#0cab03", fontSize: 28, textAlign: "center", position: "absolute", marginTop: 170 }}>{language.congratulation}</Text>
                            <View>
                                <Text style={{ color: "#000", fontSize: 16, marginTop: 12, textAlign: "center" }}>{language.refferal_bonus_messege_text} {this.state.settings.code}{this.bonusAmmount}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    loading={false}
                                    titleStyle={styles.buttonTitleText}
                                    onPress={() => { this.onPressCancel() }}
                                    buttonStyle={styles.cancelButtonStyle}
                                    containerStyle={{ marginTop: 20 }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    onPressModal() {
        var curuser = firebase.auth().currentUser.uid;
        const userRoot = firebase.database().ref('users/' + curuser);
        userRoot.once('value', userData => {
            if (userData.val()) {
                if (userData.val().refferalId == undefined) {
                    let name = userData.val().firstName ? userData.val().firstName.toLowerCase() : '';
                    let uniqueNo = Math.floor(Math.random() * 9000) + 1000;
                    let refId = name + uniqueNo;
                    userRoot.update({
                        refferalId: refId,
                        walletBalance: 0,
                    }).then(() => {
                        if (userData.val().signupViaReferral == true) {
                            firebase.database().ref('referral/bonus').once('value', referal => {
                                if (referal.val()) {
                                    this.bonusAmmount = referal.val().amount;
                                    userRoot.update({
                                        walletBalance: this.bonusAmmount
                                    }).then(() => {
                                        this.setState({
                                            giftModal: true
                                        })
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }



    tapAddress = (selection) => {
        if (selection === this.state.selected) {
            if (selection == 'drop') {
                this.props.navigation.navigate('Search', { from: "drop", whereText: this.state.whereText, dropText: this.state.dropText, old: this.state.passData });
            } else {
                this.props.navigation.navigate('Search', { from: "where", whereText: this.state.whereText, dropText: this.state.dropText, old: this.state.passData });
            }
        } else {
            this.setState({ selected: selection });
            if (selection == 'pickup') {
                this.setState({
                    region: {
                        latitude: this.state.passData.wherelatitude,
                        longitude: this.state.passData.wherelongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                })
            } else {
                this.setState({
                    region: {
                        latitude: this.state.passData.droplatitude,
                        longitude: this.state.passData.droplongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                })
            }
        }
    };



    onRegionChangeComplete = (region) => {
        if (this.state.mapChanging) {
            Geocoder.from({
                latitude: region.latitude,
                longitude: region.longitude
            }).then(json => {
                var addressComponent = json.results[0].formatted_address;
                if (this.state.selected == 'pickup') {
                    this.setState({
                        region: region,
                        whereText: addressComponent,
                        passData: {
                            droplatitude: this.state.passData.droplatitude,
                            droplongitude: this.state.passData.droplongitude,
                            droptext: this.state.passData.droptext,
                            whereText: addressComponent,
                            wherelatitude: region.latitude,
                            wherelongitude: region.longitude,
                            carType: this.state.passData.carType
                        },
                        carType: this.state.carType,
                        checkCallLocation: 'moveMarker'
                    });
                } else {
                    this.setState({
                        region: region,
                        dropText: addressComponent,
                        passData: {
                            droplatitude: region.latitude,
                            droplongitude: region.longitude,
                            droptext: addressComponent,
                            whereText: this.state.passData.whereText,
                            wherelatitude: this.state.passData.wherelatitude,
                            wherelongitude: this.state.passData.wherelongitude,
                            carType: this.state.passData.carType
                        },
                        carType: this.state.carType,
                        checkCallLocation: 'moveMarker'
                    });
                }
            })
                .catch(error => console.warn(error));
        }
    }

    renderTopPanel() {
        return (
            <View style={styles.topPanelStyle}>
                <TouchableOpacity onPress={() => this.tapAddress('pickup')} style={styles.placeBtnStyle}>
                    <View style={styles.srcCircle} />
                    <Text numberOfLines={1} style={[styles.textStyle, this.state.selected == 'pickup' ? { fontSize: 20 } : { fontSize: 14 }]}>{this.state.whereText}</Text>
                    <Icon
                        name='gps-fixed'
                        color={colors.BLACK}
                        size={this.state.selected == 'pickup' ? 24 : 14}
                        containerStyle={{ flex: 1 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.tapAddress('drop')} style={styles.placeBtnStyle}>
                    <View style={styles.desCircle} />
                    <Text numberOfLines={1} style={[styles.textStyle, this.state.selected == 'drop' ? { fontSize: 20 } : { fontSize: 14 }]}>{this.state.dropText}</Text>
                    <Icon
                        name='search'
                        type='feather'
                        color={colors.BLACK}
                        size={this.state.selected == 'drop' ? 24 : 14}
                        containerStyle={{ flex: 1 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    onTab(value) {
        this.setState({ tab: value });
    }
    onCarType(value) {
        if (value === 'black1') {
            this.setState({ car_type: 'black1' });
            this.refs.tab1.open();
        } else if (value === 'black2') {
            this.setState({ car_type: 'black2' });
            this.refs.tab2.open();
        } else if (value === 'automotive1') {
            this.setState({ car_type: 'automotive1' });
            this.refs.tab1.open();
        } else if (value === 'automotive2') {
            this.setState({ car_type: 'automotive2' });
            this.refs.tab2.open();
        } else if (value === 'services1') {
            this.setState({ car_type: 'services1' });
            this.refs.tab1.open();
        } else {
            this.setState({ car_type: 'services2' });
            this.refs.tab2.open();
        }
    }
    onLearnMore(car_type) {
        if (car_type == 'black1') {
            alert('Black Learn More');
        } else if (car_type == 'automotive1') {
            alert('Automotive Learn More');
        } else {
            alert('Services Learn More');
        }
    }
    renderTab1() {
        return (
            <AModal style={[styles.modal, styles.black]} position={"bottom"} ref={"tab1"}>
                <TouchableOpacity onPress={() => this.refs.tab1.close()}>
                    <Icon name='angle-down' type='font-awesome' color={'rgba(0, 0, 0, 0.8)'} size={30} containerStyle={{ marginTop: 10 }} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, width: '90%', height: 200 }}>
                    <Image style={{ width: 60, height: 18 }} source={images.icon_car} />
                    <Text style={{ fontSize: 22, marginTop: 10 }}>Welcome to KWIK</Text>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                        {this.state.car_type === 'black1' ? 'Black Car' : this.state.car_type === 'automotive1' ? 'Automotive Delivery' : 'Servies'}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 10, color: '#00000090' }}>
                        {
                            this.state.car_type === 'black1' ? 'From limousines to luxury crossovers, and premium cars, our Black Car Service will provide a ride' :
                                this.state.car_type === 'automotive1' ? 'From limousines to luxury crossovers, and premium cars, our Automotive Service will provide a ride' :
                                    'From limousines to luxury crossovers, and premium cars, our Car Services will provide a ride'
                        }
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', width: '100%', height: 50, borderTopWidth: 1, borderTopColor: '#00000050' }}>
                    <TouchableOpacity onPress={() => this.onLearnMore(this.state.car_type)}>
                        <Text style={{ marginLeft: 20, fontSize: 18, color: '#04AF6F' }}>LEARN MORE</Text>
                    </TouchableOpacity>
                </View>
            </AModal>
        )
    }
    renderTab2() {
        return (
            <AModal style={[styles.modal, styles.black1]} position={"bottom"} ref={"tab2"}>
                <View style={styles.tabHeader}>
                    <TouchableOpacity style={this.state.tab == 1 ? [styles.selTab, { borderTopLeftRadius: 20 }] : styles.tab1} onPress={() => this.onTab(1)}>
                        <Text style={this.state.tab == 1 ? { fontSize: 15, fontWeight: 'bold', color: '#00963D' } : { fontSize: 15, fontWeight: 'bold', color: '#000000' }}>
                            {this.state.car_type === 'black2' ? 'Black' : this.state.car_type === 'automotive2' ? 'Automotive' : 'Servies'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.tab == 2 ? [styles.selTab, { borderTopRightRadius: 20 }] : styles.tab2} onPress={() => this.onTab(2)}>
                        <Text style={this.state.tab == 2 ? { fontSize: 15, fontWeight: 'bold', color: '#00963D' } : { fontSize: 15, fontWeight: 'bold', color: '#000000' }}>PREMIER</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.tab == 1 ?
                        this.renderTab3()
                        :
                        <View style={styles.tabBody}>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <StepIndicator
                                    stepCount={2}
                                    customStyles={thirdIndicatorStyles}
                                    currentPosition={this.state.step}
                                // onPress={(position) => this.setState({ step: position })}
                                />
                            </View>
                            {
                                this.state.step == 0 ?
                                    this.renderTab4()
                                    :
                                    this.renderTab5()
                            }
                        </View>
                }
            </AModal>
        )
    }
    renderTab3() {
        return (
            <View style={styles.tabBody}>
                <ScrollView contentContainerStyle={{ width: '100%', padding: 10, paddingBottom: 70, backgroundColor: '#FFFFFF' }}>
                    {
                        drivers.map((item, key) => {
                            return (
                                item.type == 1 ?
                                    <View style={styles.driverItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={styles.driverImage} source={item.image} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.title}</Text>
                                                <Text style={{ fontSize: 13, color: '#555' }}>{item.description}</Text>
                                            </View>
                                        </View>
                                        <View style={{ padding: 10, borderRadius: 50, borderWidth: 1, borderColor: '#E3E3E3', backgroundColor: '#FFF' }}>
                                            <Text style={{ fontSize: 12 }}>{item.time} min away</Text>
                                        </View>
                                    </View> : null
                            )
                        })
                    }
                    <Text>Available Favorite Drivers</Text>
                    {
                        drivers.map((item, key) => {
                            return (
                                item.type == 2 ?
                                    <View style={styles.driverItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={styles.driverImage} source={item.image} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.title}</Text>
                                                <Text style={{ fontSize: 13, color: '#555' }}>{item.description}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, paddingLeft: 10, paddingRight: 10, borderRadius: 50, borderWidth: 1, borderColor: '#E3E3E3', backgroundColor: '#FFF' }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>{item.time}</Text>
                                            <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                        </View>
                                    </View> : null
                            )
                        })
                    }
                    <TouchableOpacity style={styles.rideBtn}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>RIDE NOW</Text>
                    </TouchableOpacity>
                    <View style={styles.spec}>
                        <View style={styles.specTop}>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>ETA</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>2 MIN</Text>
                            </View>
                            <View style={{ width: '30%', alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#D8D8D8' }}>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>MIN FARE</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>$8.00</Text>
                            </View>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>MAX SIZE</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>4 PEOPLE</Text>
                            </View>
                        </View>
                        <View style={styles.specBottom}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#04AF6F' }}>FARE ESTIMATE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
    renderTab4() {
        return (
            <ScrollView contentContainerStyle={{ width: '100%', padding: 10, paddingBottom: 70, backgroundColor: '#FFFFFF' }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={styles.step1}>
                        <View style={styles.step1Spec}>
                            <View style={{ width: '50%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Passengers</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>2</Text>
                            </View>
                            <View style={{ width: '50%', alignItems: 'center', borderLeftWidth: 1, borderColor: '#D8D8D8' }}>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Luggage</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>2</Text>
                            </View>
                        </View>
                        <View style={styles.step1Spec}>
                            <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                <Icon name='calendar' type='font-awesome' size={22} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Date</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>May 2nd</Text>
                                </View>
                            </View>
                            <View style={{ width: '50%', borderLeftWidth: 1, borderColor: '#D8D8D8', paddingLeft: 20 }}>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}> </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Same Day</Text>
                            </View>
                        </View>
                        <View style={styles.step1Spec}>
                            <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                <Icon name='clock-o' type='font-awesome' size={22} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Pick Up</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>8:00pm</Text>
                                </View>
                            </View>
                            <View style={{ width: '50%', borderLeftWidth: 1, borderColor: '#D8D8D8', paddingLeft: 20 }}>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Drop Off</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>11:00pm</Text>
                            </View>
                        </View>
                        <View style={styles.step1Spec2}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                                <Image style={{ width: 25, height: 8 }} source={images.icon_car} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Limousine-Cadillac</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.rideBtn} onPress={() => this.setState({ step: 1 })}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    renderTab5() {
        return (
            <ScrollView contentContainerStyle={{ width: '100%', padding: 10, paddingBottom: 70, backgroundColor: '#FFFFFF' }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <Text>Available Favorite Drivers</Text>
                    {
                        drivers.map((item, key) => {
                            return (
                                item.type == 2 ?
                                    <View style={styles.driverItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={styles.driverImage} source={item.image} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.title}</Text>
                                                <Text style={{ fontSize: 13, color: '#555' }}>{item.description}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, paddingLeft: 10, paddingRight: 10, borderRadius: 50, borderWidth: 1, borderColor: '#E3E3E3', backgroundColor: '#FFF' }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>{item.time}</Text>
                                            <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                        </View>
                                    </View> : null
                            )
                        })
                    }
                    <TouchableOpacity style={[styles.rideBtn, { flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, backgroundColor: '#FFF' }]}>
                        <View style={{ width: 25, height: 25, borderRadius: 15, backgroundColor: '#FFF949', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20 }} source={images.icon_plus} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#019A45', marginLeft: 10 }}>First Available Driver</Text>
                    </TouchableOpacity>
                    <View style={styles.step2}>
                        <View style={styles.step1Spec}>
                            <View style={styles.driverItem1}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={{ width: 30, height: 30 }} source={images.icon_edit} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 13, color: '#555' }}>Boquet of Flowers</Text>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Special Request</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 5 }}>+$70</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.step1Spec2}>
                            <View style={styles.driverItem2}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={{ width: 30, height: 30 }} source={images.icon_coin} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 13, color: '#555' }}>Payment Method</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={{ width: 50, height: 30, marginRight: 10 }} source={images.icon_visa} />
                                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Special Request</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <TouchableOpacity style={[styles.rideBtn, { width: '48%', backgroundColor: '#D8D8D8' }]}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }} onPress={() => this.setState({ step: 0 })}>BACK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rideBtn, { width: '48%' }]} onPress={() => this.props.navigation.navigate('Confirm')}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>NEXT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    render() {
        return (
            <View style={styles.mainViewStyle}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="" isStatus="menu" navigation={this.props.navigation} />
                    <MapComponent
                        markerRef={marker => { this.marker = marker; }}
                        mapStyle={styles.map}
                        mapRegion={this.state.region}
                        nearby={this.state.freeCars}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                    />
                    {this.state.selected == 'pickup' ?
                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ marginBottom: 40, height: 40, resizeMode: "contain" }} source={require('@assets/images/green_pin.png')} />
                        </View>
                        :
                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ marginBottom: 40, height: 40, resizeMode: "contain" }} source={require('@assets/images/rsz_2red_pin.png')} />
                        </View>
                    }

                    {this.renderTopPanel()}

                    <View style={styles.typeTabStyle}>
                        <SwitchSelector
                            options={tabs}
                            initial={0}
                            buttonColor={"#00963D"}
                            onPress={value =>
                                value == 1 ? !this.state.active ? this.onCarType('black1') : this.onCarType('black2') :
                                    value == 2 ? !this.state.active ? this.onCarType('automotive1') : this.onCarType('automotive2') :
                                        !this.state.active ? this.onCarType('services1') : this.onCarType('services2')}
                        />
                    </View>

                    {this.renderTab1()}
                    {this.renderTab2()}
                    {/* {this.renderAutoTab1()}
                    {this.renderAutoTab2()}
                    {this.renderServicesTab1()}
                    {this.renderServicesTab2()} */}
                    {this.bonusModal()}
                    {this.loading()}
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topPanelStyle: {
        marginTop: 20,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    placeBtnStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
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
    desCircle: {
        marginLeft: 10, marginRight: 10,
        width: 10,
        height: 10,
        backgroundColor: '#FF0035',
        borderRadius: 10,
        shadowColor: '#00F561',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    textStyle: {
        flex: 8,
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: colors.BLACK,
        marginTop: 10,
        marginBottom: 10
    },
    typeTabStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50,
        padding: 2,
        // height: 50,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    selTabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#D8D8D8'
    },
    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '100%',
        alignItems: 'center',
    },
    text1: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        fontWeight: '500',
        color: colors.BLACK
    },
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    black: {
        height: 300,
        // paddingLeft: 20,
        // paddingRight: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    black1: {
        height: 400,
        // paddingLeft: 20,
        // paddingRight: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    text: {
        color: 'black',
        fontSize: 22
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('100.0%'),
        height: 50
    },
    tabBody: {
        width: '100%',
        height: '100%',
        padding: 10
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',
        width: wp('50.0%'),
        height: 50,
        borderTopLeftRadius: 20,
        // shadowColor: '#000',
        // shadowOpacity: 0.8,
        // shadowOffset: { height: 1, width: 1 },
        // shadowRadius: 2,
        // elevation: 10,
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',
        width: wp('50.0%'),
        height: 50,
        borderTopRightRadius: 20
    },
    selTab: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: wp('50.0%'),
        height: 50
    },
    driverItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        width: '100%',
        height: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    driverImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
    },
    rideBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#00963D',
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 5,
    },
    spec: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        // padding: 10,
        width: '100%',
        height: 120,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    specTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 80
    },
    specBottom: {
        width: '100%',
        height: 40,
        borderTopWidth: 1,
        borderTopColor: '#D1D1D1'
    },
    step1: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        // padding: 10,
        width: '100%',
        height: 280,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    step2: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        // padding: 10,
        width: '100%',
        height: 140,
        // borderRadius: 15,
        // borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    step1Spec: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D1'
    },
    step1Spec2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 70,
    },
    step1Bottom: {
        width: '100%',
        height: 70,
    },
    driverItem1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        width: '100%',
        height: 80,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    driverItem2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        width: '100%',
        height: 80,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9'
    },
    buttonContainer: {
        flex: 1
    },
    cancelButtonStyle: {
        backgroundColor: "#edede8",
        elevation: 0,
        width: "60%",
        borderRadius: 5,
        alignSelf: "center"
    },
    buttonTitleText: {
        color: colors.GREY.default,
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        alignSelf: 'flex-end'
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
});