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
import SwitchSelector from 'react-native-switch-selector';
import StepIndicator from 'react-native-step-indicator';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modalbox';
import {
    AnimatedRegion,
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Polyline,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { GeoFire } from 'geofire';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment from 'moment';

import { connect } from 'react-redux';
import { setDriver } from '@modules/account/actions';
import { MapComponent, Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API, { setClientToken } from '@services/API';

const tabs = [
    { label: 'Black', value: 1 },
    { label: 'Automotive', value: 2 },
    { label: 'services', value: 3 },
];

const thirdIndicatorStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 20,
    stepStrokeCurrentColor: '#00963D',
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
    currentStepLabelColor: '#7eaec4',
};

class Map extends React.Component {
    constructor(props) {
        super(props);
        Geocoder.init(configs.google_map_key);
        // setClientToken(this.props.user_info.api_token);
        this.state = {
            loading: false,
            backgroundColor: colors.WHITE,
            region: {
                latitude: configs.latitude,
                longitude: configs.longitude,
                latitudeDelta: configs.delta,
                longitudeDelta: configs.delta,
            },
            whereText: 'From Start',
            dropText: 'To Destination',
            coordinate: new AnimatedRegion({
                latitude: configs.latitude,
                longitude: configs.longitude,
            }),
            passData: {
                whereText: '',
                wherelatitude: 0,
                wherelongitude: 0,
                droptext: '',
                droplatitude: 0,
                droplongitude: 0,
            },
            freeCars: [],
            availableDrivers: [],
            checkCallLocation: '',
            selected: 'drop',
            mapChanging: false,

            carType: '',
            active: true,
            tab: 1,
            step: 0,
            selectedDriver: 0,
            driverInfo: {},
            minFare: '---',
            date: false,
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            fromTime:
                new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds(),
            toTime:
                new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds(),
            passengers: 2,
            luggage: 2,
        };
    }

    // UNSAFE_componentWillMount() {
    //     this._getLocationAsync();
    // }

    componentDidMount() {
        this._getLocationAsync();
        setInterval(() => {
            if (this.state.passData.wherelatitude != 0) {
                this.getDrivers();
            }
        }, 30000);
    }

    _getLocationAsync = async () => {
        try {
            await Geolocation.getCurrentPosition((location) => {
                if (location) {
                    let latlng = location.coords.latitude + ',' + location.coords.longitude;
                    return fetch(
                        'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
                        latlng +
                        '&key=' +
                        configs.google_map_key,
                    ).then((response) => response.json()).then((responseJson) => {
                        if (this.state.passData.wherelatitude == 0 || this.state.passData.droplatitude == 0) {
                            this.setState(
                                {
                                    loading: true,
                                    whereText: responseJson.results[0].formatted_address,
                                    dropText: responseJson.results[0].formatted_address,
                                    region: {
                                        latitude: location.coords.latitude,
                                        longitude: location.coords.longitude,
                                        latitudeDelta: configs.delta,
                                        longitudeDelta: configs.delta,
                                    },
                                },
                                () => {
                                    let obj = {};
                                    obj = this.state.passData;
                                    obj.wherelatitude = location.coords.latitude;
                                    obj.wherelongitude = location.coords.longitude;
                                    obj.whereText = responseJson.results[0].formatted_address;
                                    obj.droplatitude = location.coords.latitude;
                                    obj.droplongitude = location.coords.longitude;
                                    obj.dropText = responseJson.results[0].formatted_address;
                                    this.setState({
                                        passData: obj,
                                        mapChanging: true,
                                    });
                                    // this.getDrivers();
                                }
                            );
                        } else {
                            this.setState(
                                {
                                    loading: true
                                },
                                () => {
                                    let obj = {};
                                    obj = this.state.passData;
                                    obj.wherelatitude = location.coords.latitude;
                                    obj.wherelongitude = location.coords.longitude;
                                    obj.whereText = responseJson.results[0].formatted_address;
                                    obj.droplatitude = location.coords.latitude;
                                    obj.droplongitude = location.coords.longitude;
                                    obj.dropText = responseJson.results[0].formatted_address;
                                    this.setState({
                                        passData: obj,
                                        mapChanging: true,
                                    });
                                    // this.getDrivers();
                                }
                            );
                        }
                    });
                }
            });
        } catch {
            this.setState({ loading: false });
        }
    };

    async getDrivers() {
        try {
            await API.post('/available_drivers', {
                customer_id: this.props.user_info.user_id,
                api_token: this.props.user_info.api_token,
                src_lat: this.state.passData.wherelatitude,
                src_long: this.state.passData.wherelongitude,
            }).then((resp) => {
                if (resp.data.success == 1) {
                    this.prepareDrivers(resp.data.data);
                } else {
                    this.setState({ loading: false });
                }
            });
        } catch {
            this.setState({ loading: false });
        }
    }

    async prepareDrivers(allDrivers) {
        if (allDrivers.length > 0) {
            let availableDrivers = [];
            let freeCars = [];
            let riderLocation = [
                this.state.passData.wherelatitude,
                this.state.passData.wherelongitude,
            ];
            let startLoc =
                '"' +
                this.state.passData.wherelatitude +
                ', ' +
                this.state.passData.wherelongitude +
                '"';
            for (let key in allDrivers) {
                let driver = allDrivers[key];
                let driverLocation = [driver.driver_lat, driver.driver_long];
                let distance = GeoFire.distance(riderLocation, driverLocation);
                freeCars.push(driver);
                if (distance < 10) {
                    let destLoc =
                        '"' + driver.driver_lat + ', ' + driver.driver_long + '"';
                    driver.arriveDistance = distance;
                    driver.arriveTime = await this.getDriverTime(startLoc, destLoc);
                    availableDrivers.push(driver);
                }
            }
            this.setState({
                loading: false,
                freeCars: freeCars,
                availableDrivers: availableDrivers,
            });
        } else {
            this.setState({
                loading: false,
                freeCars: [],
                availableDrivers: [],
            });
        }
    }

    getDriverTime(startLoc, destLoc) {
        return new Promise(function (resolve, reject) {
            fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${startLoc}&destinations=${destLoc}&key=${configs.google_map_key}`,
            ).then((response) => response.json()).then((res) => {
                resolve({
                    distance_in_meter: res.rows[0].elements[0].distance.value,
                    time_in_secs: res.rows[0].elements[0].duration.value,
                    timein_text: res.rows[0].elements[0].duration.text,
                });
            });
        });
    }

    onRegionChangeComplete = (region) => {
        if (this.state.mapChanging) {
            Geocoder.from({
                latitude: region.latitude,
                longitude: region.longitude,
            }).then((json) => {
                if (this.state.selected == 'where') {
                    this.setState({
                        region: region,
                        whereText: json.results[0].formatted_address,
                        passData: {
                            droplatitude: this.state.passData.droplatitude,
                            droplongitude: this.state.passData.droplongitude,
                            droptext: this.state.passData.droptext,
                            whereText: json.results[0].formatted_address,
                            wherelatitude: region.latitude,
                            wherelongitude: region.longitude,
                        }
                    });
                } else {
                    this.setState({
                        region: region,
                        dropText: json.results[0].formatted_address,
                        passData: {
                            droplatitude: region.latitude,
                            droplongitude: region.longitude,
                            droptext: json.results[0].formatted_address,
                            whereText: this.state.passData.whereText,
                            wherelatitude: this.state.passData.wherelatitude,
                            wherelongitude: this.state.passData.wherelongitude,
                        }
                    });
                }
            });
        }
    };

    onLearnMore(carType) {
        if (carType == 'black1') {
            alert('Black Learn More');
        } else if (carType == 'automotive1') {
            alert('Automotive Learn More');
        } else {
            alert('Services Learn More');
        }
    }

    renderTopPanel() {
        return (
            <View style={styles.topPanelStyle}>
                <TouchableOpacity
                    onPress={() => this.onAddress('where')}
                    style={styles.placeBtnStyle}>
                    <View style={styles.srcCircle} />
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.textStyle,
                            this.state.selected == 'where' ? { fontSize: 16, color: '#FF00FF', fontWeight: '500' } : { fontSize: 12 },
                        ]}>
                        {this.state.whereText}
                    </Text>
                    <Icon
                        name="gps-fixed"
                        color={colors.BLACK}
                        size={this.state.selected == 'where' ? 16 : 12}
                        containerStyle={{ flex: 1 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.onAddress('drop')}
                    style={styles.placeBtnStyle}>
                    <View style={styles.desCircle} />
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.textStyle,
                            this.state.selected == 'drop' ? { fontSize: 16, color: '#FF00FF', fontWeight: '500' } : { fontSize: 12 },
                        ]}>
                        {this.state.dropText}
                    </Text>
                    <Icon
                        name="search"
                        type="feather"
                        color={colors.BLACK}
                        size={this.state.selected == 'drop' ? 16 : 12}
                        containerStyle={{ flex: 1 }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
    onAddress = (selection) => {
        if (selection === this.state.selected) {
            this.refs.search_modal.open();
        } else {
            this.setState({ selected: selection });
            if (selection == 'where') {
                this.setState({
                    region: {
                        latitude: this.state.passData.wherelatitude,
                        longitude: this.state.passData.wherelongitude,
                        latitudeDelta: configs.delta,
                        longitudeDelta: configs.delta,
                    }
                });
            } else {
                this.setState({
                    region: {
                        latitude: this.state.passData.droplatitude,
                        longitude: this.state.passData.droplongitude,
                        latitudeDelta: configs.delta,
                        longitudeDelta: configs.delta,
                    }
                });
            }
        }
    };
    renderSearch() {
        return (
            <Modal
                style={[styles.modal, styles.search]}
                position={'bottom'}
                ref={'search_modal'}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2}
                    debounce={200}
                    autoFocus={true}
                    currentLocation={true}
                    currentLocationLabel="Current location"
                    enablePoweredByContainer={false}
                    returnKeyType={'search'}
                    listViewDisplayed='auto'
                    fetchDetails={true}
                    renderDescription={row => row.description}
                    textInputProps={{ clearButtonMode: 'while-editing' }}
                    renderDescription={(row) => row.description || row.formatted_address || row.name}
                    nearbyPlacesAPI='GoogleReverseGeocoding'
                    getDefaultValue={() => ''}
                    GoogleReverseGeocodingQuery={{
                        key: configs.google_map_key,
                        language: 'en',
                    }}
                    GooglePlacesSearchQuery={{
                        rankby: 'distance',
                        types: 'establishment'
                    }}
                    query={{
                        key: configs.google_map_key,
                        language: 'en'
                    }}
                    onPress={(data, details = null) => {
                        this.onSearch(details);
                    }}
                    styles={{
                        currentLocation: {
                            color: colors.BLACK,
                        },
                        container: {
                            marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 44,
                            backgroundColor: colors.WHITE
                        },
                        textInputContainer: {
                            width: '100%',
                            height: 50,
                            backgroundColor: colors.WHITE
                        },
                        textInput: {
                            height: 30,
                            borderColor: colors.GREY.default,
                        },
                        description: {
                            fontWeight: 'bold',
                        },
                        description: {
                            color: colors.BLUE
                        },
                        predefinedPlacesDescription: {
                            color: colors.BLUE.light
                        },
                    }}
                />
            </Modal>
        )
    }
    onSearch(details) {
        if (this.state.selected == "where" && details) {
            let oldData = this.state.passData;
            oldData.wherelatitude = details.geometry.location.lat;
            oldData.wherelongitude = details.geometry.location.lng;
            oldData.whereText = details.formatted_address;
            this.setState(
                {
                    loading: true,
                    region: {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        latitudeDelta: configs.delta,
                        longitudeDelta: configs.delta,
                    },
                    whereText: details.formatted_address,
                    dropText: this.state.dropText,
                    passData: oldData,
                    checkCallLocation: 'navigation',
                },
                () => {
                    this.refs.search_modal.close();
                    this.getDrivers();
                },
            );
        } else if (this.state.selected == 'drop' && details) {
            let oldData = this.state.passData;
            oldData.droplatitude = details.geometry.location.lat;
            oldData.droplongitude = details.geometry.location.lng;
            oldData.droptext = details.formatted_address;
            this.setState(
                {
                    loading: true,
                    region: {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        latitudeDelta: configs.delta,
                        longitudeDelta: configs.delta,
                    },
                    whereText: this.state.whereText,
                    dropText: details.formatted_address,
                    passData: oldData,
                    checkCallLocation: 'navigation',
                },
                () => {
                    this.refs.search_modal.close();
                    this.getDrivers();
                },
            );
        }
    }
    async onCarType(value) {
        this.setState({ loading: true, selectedDriver: 0 });
        if (this.state.availableDrivers.length > 0) {
            let startLoc =
                '"' +
                this.state.passData.wherelatitude +
                ', ' +
                this.state.passData.wherelongitude +
                '"';
            let destLoc =
                '"' +
                this.state.passData.droplatitude +
                ', ' +
                this.state.passData.droplongitude +
                '"';
            let arriveTime = await this.getDriverTime(startLoc, destLoc);
            if (!arriveTime) {
                alert('Please check ditance');
            }
            this.setState({ durationTime: arriveTime.timein_text });

            if (value === 'black1') {
                this.setState({ loading: false, carType: 'black1' });
                this.refs.tab1.open();
            } else if (value === 'black2') {
                this.setState({ loading: false, carType: 'black2' });
                this.refs.tab2.open();
            } else if (value === 'automotive1') {
                this.setState({ loading: false, carType: 'automotive1' });
                this.refs.tab1.open();
            } else if (value === 'automotive2') {
                this.setState({ loading: false, carType: 'automotive2' });
                this.refs.tab2.open();
            } else if (value === 'services1') {
                this.setState({ loading: false, carType: 'services1' });
                this.refs.tab1.open();
            } else {
                this.setState({ loading: false, carType: 'services2' });
                this.refs.tab2.open();
            }
        } else {
            alert("No available driver");
            this.setState({ loading: false });
        }
    }
    onTab(value) {
        this.setState({ tab: value, selectedDriver: 0 });
    }
    onSelectDriver(driverInfo) {
        if (this.state.selectedDriver == driverInfo.driver_id) {
            this.setState({ selectedDriver: 0, minFare: '---' });
        } else {
            this.setState({
                selectedDriver: driverInfo.driver_id,
                driverInfo: {
                    driver_address: driverInfo.driver_address,
                    driver_id: driverInfo.driver_id,
                    driver_image: driverInfo.driver_image,
                    driver_lat: driverInfo.driver_lat,
                    driver_long: driverInfo.driver_long,
                    driver_name: driverInfo.driver_name,
                    driver_review: driverInfo.driver_review,
                    driver_token: driverInfo.driver_token,
                    driver_uid: driverInfo.driver_uid,
                    fare_info: driverInfo.fare_info.base_fare,
                    vehicle_id: driverInfo.vehicle_id,
                    vehicle_make: driverInfo.vehicle_make,
                    vehicle_model: driverInfo.vehicle_model,
                    vehicle_type: driverInfo.vehicle_type,
                    vehicle_type_id: driverInfo.vehicle_type_id
                },
                minFare: driverInfo.fare_info.base_fare,
            });
        }
    }

    renderTab1() {
        return (
            <Modal
                style={[styles.modal, styles.black]}
                position={'bottom'}
                ref={'tab1'}>
                <TouchableOpacity onPress={() => this.refs.tab1.close()}>
                    <Icon
                        name="angle-down"
                        type="font-awesome"
                        color={'rgba(0, 0, 0, 0.8)'}
                        size={30}
                        containerStyle={{ marginTop: 10 }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        width: '90%',
                        height: 200,
                    }}>
                    <Image style={{ width: 60, height: 18 }} source={images.icon_car} />
                    <Text style={{ fontSize: 22, marginTop: 10 }}>Welcome to KWIK</Text>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                        {this.state.carType === 'black1'
                            ? 'Black Car'
                            : this.state.carType === 'automotive1'
                                ? 'Automotive Delivery'
                                : 'Servies'}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 10, color: '#00000090' }}>
                        {this.state.carType === 'black1'
                            ? 'From limousines to luxury crossovers, and premium cars, our Black Car Service will provide a ride'
                            : this.state.carType === 'automotive1'
                                ? 'From limousines to luxury crossovers, and premium cars, our Automotive Service will provide a ride'
                                : 'From limousines to luxury crossovers, and premium cars, our Car Services will provide a ride'}
                    </Text>
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        width: '100%',
                        height: 50,
                        borderTopWidth: 1,
                        borderTopColor: '#00000050',
                    }}>
                    <TouchableOpacity
                        onPress={() => this.onLearnMore(this.state.carType)}>
                        <Text style={{ marginLeft: 20, fontSize: 18, color: '#04AF6F' }}>
                            LEARN MORE
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
    renderTab2() {
        return (
            <Modal
                style={[styles.modal, styles.black1]}
                position={'bottom'}
                ref={'tab2'}>
                <View style={styles.tabHeader}>
                    <TouchableOpacity
                        style={
                            this.state.tab == 1
                                ? [styles.selTab, { borderTopLeftRadius: 20 }]
                                : styles.tab1
                        }
                        onPress={() => this.onTab(1)}>
                        <Text
                            style={
                                this.state.tab == 1
                                    ? { fontSize: 15, fontWeight: 'bold', color: '#00963D' }
                                    : { fontSize: 15, fontWeight: 'bold', color: '#000000' }
                            }>
                            {this.state.carType === 'black2' ? 'Black' : this.state.carType === 'automotive2' ? 'Automotive' : 'Servies'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={
                            this.state.tab == 2
                                ? [styles.selTab, { borderTopRightRadius: 20 }]
                                : styles.tab2
                        }
                        onPress={() => this.onTab(2)}>
                        <Text
                            style={
                                this.state.tab == 2
                                    ? { fontSize: 15, fontWeight: 'bold', color: '#00963D' }
                                    : { fontSize: 15, fontWeight: 'bold', color: '#000000' }
                            }>
                            PREMIER
                        </Text>
                    </TouchableOpacity>
                </View>
                {this.state.tab == 1 ? (
                    this.renderTab3()
                ) : (
                        <View style={styles.tabBody}>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <StepIndicator
                                    stepCount={2}
                                    customStyles={thirdIndicatorStyles}
                                    currentPosition={this.state.step}
                                // onPress={(position) => this.setState({ step: position })}
                                />
                            </View>
                            {this.state.step == 0 ? this.renderTab4() : this.renderTab5()}
                        </View>
                    )}
            </Modal>
        );
    }
    renderTab3() {
        const { availableDrivers } = this.state;
        return (
            <View style={styles.tabBody}>
                <ScrollView
                    contentContainerStyle={{
                        width: '100%',
                        padding: 10,
                        paddingBottom: 70,
                        backgroundColor: '#FFFFFF',
                        zIndex: 1000,
                    }}>
                    <Text>Available Favorite Drivers</Text>
                    {availableDrivers.map((item, key) => {
                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.driverItem,
                                    {
                                        borderWidth:
                                            this.state.selectedDriver == item.driver_id ? 3 : 1,
                                        borderColor:
                                            this.state.selectedDriver == item.driver_id
                                                ? '#DD0000'
                                                : '#999',
                                    },
                                ]}
                                onPress={() => this.onSelectDriver(item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={styles.driverImage}
                                        source={
                                            item.driver_image == null
                                                ? images.img_driver
                                                : {
                                                    uri:
                                                        configs.baseURL +
                                                        '/uploads/' +
                                                        item.driver_image,
                                                }
                                        }
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                            {item.driver_name}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: '#555' }}>
                                            {item.vehicle_make} {item.vehicle_model}{' '}
                                            {/*item.vehicle_type*/}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 2,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: '#E3E3E3',
                                        backgroundColor: '#FFF',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#079D54',
                                            marginRight: 5,
                                        }}>
                                        {item.driver_review == null ? 0 : item.driver_review}
                                    </Text>
                                    <Icon
                                        name="star"
                                        type="font-awesome"
                                        color="#079D54"
                                        size={15}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity
                        style={styles.rideBtn}
                        onPress={() => this.onRideNow(1)}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                            RIDE NOW
                    </Text>
                    </TouchableOpacity>
                    <View style={styles.spec}>
                        <View style={styles.specTop}>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text
                                    style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>
                                    ETA
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {this.state.durationTime}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: '30%',
                                    alignItems: 'center',
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderColor: '#D8D8D8',
                                }}>
                                <Text
                                    style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>
                                    MIN FARE
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    ${this.state.minFare}
                                </Text>
                            </View>
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text
                                    style={{ fontSize: 13, fontWeight: '800', color: '#9B9B9B' }}>
                                    MAX SIZE
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>4 PEOPLE</Text>
                            </View>
                        </View>
                        <View style={styles.specBottom}>
                            <TouchableOpacity
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}>
                                <Text
                                    style={{ fontSize: 14, fontWeight: '500', color: '#04AF6F' }}>
                                    FARE ESTIMATE
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
    renderTab4() {
        return (
            <ScrollView
                contentContainerStyle={{
                    width: '100%',
                    padding: 10,
                    paddingBottom: 70,
                    backgroundColor: '#FFFFFF',
                }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={styles.step1}>
                        <View style={styles.step1Spec}>
                            <TouchableOpacity style={{ width: '50%', alignItems: 'center' }}>
                                <Text
                                    style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                    Passengers
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {this.state.passengers}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    alignItems: 'center',
                                    borderLeftWidth: 1,
                                    borderColor: '#D8D8D8',
                                }}>
                                <Text
                                    style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                    Luggage
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {this.state.luggage}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.step1Spec}>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 20,
                                }}
                                onPress={() =>
                                    this.setState({ date: true, dateStatus: 'fromDate' })
                                }>
                                <Icon name="calendar" type="font-awesome" size={22} />
                                <View
                                    style={{ marginLeft: 10 }}
                                    onPress={() =>
                                        this.setState({ date: true, dateStatus: 'fromDate' })
                                    }>
                                    <Text
                                        style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                        Date
                                    </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {this.state.fromDate}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    borderLeftWidth: 1,
                                    borderColor: '#D8D8D8',
                                    paddingLeft: 20,
                                }}
                                onPress={() =>
                                    this.setState({ date: true, dateStatus: 'toDate' })
                                }>
                                <Text
                                    style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                    {' '}
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {this.state.toDate}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.step1Spec}>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 20,
                                }}
                                onPress={() =>
                                    this.setState({ date: true, dateStatus: 'fromTime' })
                                }>
                                <Icon name="clock-o" type="font-awesome" size={22} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text
                                        style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                        Pick Up
                                    </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {this.state.fromTime}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    borderLeftWidth: 1,
                                    borderColor: '#D8D8D8',
                                    paddingLeft: 20,
                                }}
                                onPress={() =>
                                    this.setState({ date: true, dateStatus: 'toTime' })
                                }>
                                <Text
                                    style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>
                                    Drop Off
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {this.state.toTime}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.step1Spec2}>
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 15,
                                }}>
                                <Image
                                    style={{ width: 25, height: 8 }}
                                    source={images.icon_car}
                                />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        Limousine-Cadillac
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.rideBtn}
                        onPress={() => this.setState({ step: 1 })}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                            NEXT
                        </Text>
                    </TouchableOpacity>
                </View>
                <DateTimePickerModal
                    isVisible={this.state.date}
                    mode={
                        this.state.dateStatus === 'fromDate' ||
                            this.state.dateStatus === 'toDate'
                            ? 'date'
                            : 'time'
                    }
                    onConfirm={(date) => {
                        this.state.dateStatus === 'fromDate'
                            ? this.setState({
                                fromDate: moment(date).format('YYYY-MM-DD'),
                                date: false,
                            })
                            : this.state.dateStatus === 'toDate'
                                ? this.setState({
                                    toDate: moment(date).format('YYYY-MM-DD'),
                                    date: false,
                                })
                                : this.state.dateStatus === 'fromTime'
                                    ? this.setState({
                                        fromTime: JSON.stringify(date).split('T')[1].split('.')[0],
                                        date: false,
                                    })
                                    : this.setState({
                                        toTime: JSON.stringify(date).split('T')[1].split('.')[0],
                                        date: false,
                                    });
                    }}
                    onCancel={() => this.setState({ date: false })}
                />
            </ScrollView>
        );
    }
    renderTab5() {
        const { availableDrivers } = this.state;
        return (
            <ScrollView
                contentContainerStyle={{
                    width: '100%',
                    padding: 10,
                    paddingBottom: 70,
                    backgroundColor: '#FFFFFF',
                }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <Text>Available Favorite Drivers</Text>
                    {availableDrivers.map((item, key) => {
                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.driverItem,
                                    {
                                        borderWidth:
                                            this.state.selectedDriver == item.driver_id ? 3 : 1,
                                        borderColor:
                                            this.state.selectedDriver == item.driver_id
                                                ? '#DD0000'
                                                : '#999',
                                    },
                                ]}
                                onPress={() => this.onSelectDriver(item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={styles.driverImage}
                                        source={
                                            item.driver_image == null
                                                ? images.img_driver
                                                : {
                                                    uri:
                                                        configs.baseURL +
                                                        '/uploads/' +
                                                        item.driver_image,
                                                }
                                        }
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                            {item.driver_name}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: '#555' }}>
                                            {item.vehicle_make} {item.vehicle_model}{' '}
                                            {/*item.vehicle_type*/}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 2,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: '#E3E3E3',
                                        backgroundColor: '#FFF',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#079D54',
                                            marginRight: 5,
                                        }}>
                                        {item.driver_review == null ? 0 : item.driver_review}
                                    </Text>
                                    <Icon
                                        name="star"
                                        type="font-awesome"
                                        color="#079D54"
                                        size={15}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                        <TouchableOpacity
                            style={[
                                styles.rideBtn,
                                { width: '48%', backgroundColor: '#D8D8D8' },
                            ]}
                            onPress={() => this.setState({ step: 0 })}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>BACK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.rideBtn, { width: '48%' }]}
                            onPress={() => this.onRideNow(2)}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                                NEXT
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
    async onRideNow(type) {
        if (this.state.selectedDriver == 0) {
            alert('Please select driver');
        } else {
            this.props.setDriver(this.state.driverInfo);
            if (type == 1) {
                if (
                    parseFloat(this.state.durationTime.split(' ')[0]) *
                    parseFloat(this.state.minFare) <=
                    this.props.user_info.wallet_balance
                ) {
                    let obj = {
                        confirm_type: 0,
                        source_address: this.state.whereText,
                        source_lat: this.state.passData.wherelatitude,
                        source_long: this.state.passData.wherelongitude,
                        dest_address: this.state.dropText,
                        dest_lat: this.state.passData.droplatitude,
                        dest_long: this.state.passData.droplongitude,
                        booking_type: 0,
                        no_of_persons: 4,
                        amount:
                            parseFloat(this.state.durationTime.split(' ')[0]) *
                            parseFloat(this.state.minFare),
                    };
                    this.props.navigation.navigate('Confirm', { data: obj });
                } else {
                    alert('Please charge your wallet balance from your payment');
                    this.props.navigation.push('Payment');
                }
            } else {
                if (
                    parseFloat(this.state.durationTime.split(' ')[0]) *
                    parseFloat(this.state.minFare) <=
                    this.props.user_info.wallet_balance
                ) {
                    let obj = {
                        confirm_type: 1,
                        source_address: this.state.whereText,
                        source_lat: this.state.passData.wherelatitude,
                        source_long: this.state.passData.wherelongitude,
                        dest_address: this.state.dropText,
                        dest_lat: this.state.passData.droplatitude,
                        dest_long: this.state.passData.droplongitude,
                        booking_type: 1,
                        no_of_persons: 4,
                        amount:
                            parseFloat(this.state.durationTime.split(' ')[0]) *
                            parseFloat(this.state.minFare),
                        passengers: this.state.passengers,
                        luggage: this.state.luggage,
                        fromDate: this.state.fromDate,
                        toDate: this.state.toDate,
                        fromTime: this.state.fromTime,
                        toTime: this.state.toTime,
                    };
                    this.props.navigation.navigate('Confirm', { data: obj });
                } else {
                    alert('Please charge your wallet balance from your payment');
                    this.props.navigation.push('Payment');
                }
            }
        }
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
                    <MapComponent
                        markerRef={(marker) => {
                            this.marker = marker;
                        }}
                        mapStyle={styles.map}
                        mapRegion={this.state.region}
                        nearby={this.state.freeCars}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                    />
                    {this.state.selected == 'where' ? (
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                            }}>
                            <Image
                                pointerEvents="none"
                                style={{ marginBottom: 40, height: 40, resizeMode: 'contain' }}
                                source={this.state.mapChanging ? require('@assets/images/green_pin_select.png') : require('@assets/images/green_pin.png')}
                            />
                        </View>
                    ) : (
                            <View
                                pointerEvents="none"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                }}>
                                <Image
                                    pointerEvents="none"
                                    style={{ marginBottom: 40, height: 40, resizeMode: 'contain' }}
                                    source={this.state.mapChanging ? require('@assets/images/pink_pin_select.png') : require('@assets/images/pink_pin.png')}
                                />
                            </View>
                        )}
                    {this.renderTopPanel()}
                    <View style={styles.typeTabStyle}>
                        <SwitchSelector
                            options={tabs}
                            initial={0}
                            buttonColor={'#00963D'}
                            onPress={(value) =>
                                value == 1
                                    ? !this.state.active
                                        ? this.onCarType('black1')
                                        : this.onCarType('black2')
                                    : value == 2
                                        ? !this.state.active
                                            ? this.onCarType('automotive1')
                                            : this.onCarType('automotive2')
                                        : !this.state.active
                                            ? this.onCarType('services1')
                                            : this.onCarType('services2')
                            }
                        />
                    </View>
                    {this.renderSearch()}
                    {this.renderTab1()}
                    {this.renderTab2()}
                </SafeAreaView>
                <Loading loading={this.state.loading} />
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
    topPanelStyle: {
        marginTop: 10,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    placeBtnStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 5,
        shadowColor: '#555',
        shadowOpacity: 0.8,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 3,
        elevation: 10,
    },
    srcCircle: {
        marginLeft: 10,
        marginRight: 10,
        width: 10,
        height: 10,
        backgroundColor: '#04B273',
        borderRadius: 10,
        shadowColor: '#04B273',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    desCircle: {
        marginLeft: 10,
        marginRight: 10,
        width: 10,
        height: 10,
        backgroundColor: '#FF0035',
        borderRadius: 10,
        shadowColor: '#FF0035',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    textStyle: {
        flex: 8,
        fontSize: 14,
        fontWeight: '400',
        color: colors.BLACK,
        marginTop: 10,
        marginBottom: 10,
    },
    typeTabStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50,
        padding: 2,
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
        backgroundColor: '#D8D8D8',
    },
    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '100%',
        alignItems: 'center',
    },
    text1: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.BLACK,
    },
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    search: {
        height: hp('50%'),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    black: {
        height: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    black1: {
        height: 400,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    text: {
        color: 'black',
        fontSize: 22,
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('100.0%'),
        height: 50,
    },
    tabBody: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',
        width: wp('50.0%'),
        height: 50,
        borderTopLeftRadius: 20,
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',
        width: wp('50.0%'),
        height: 50,
        borderTopRightRadius: 20,
    },
    selTab: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: wp('50.0%'),
        height: 50,
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
        backgroundColor: '#F8F8F9',
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
        width: '100%',
        height: 120,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9',
    },
    specTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 80,
    },
    specBottom: {
        width: '100%',
        height: 40,
        borderTopWidth: 1,
        borderTopColor: '#D1D1D1',
    },
    step1: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        width: '100%',
        height: 280,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9',
    },
    step2: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        height: 140,
        borderColor: '#D1D1D1',
        backgroundColor: '#F8F8F9',
    },
    step1Spec: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D1',
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
        backgroundColor: '#F8F8F9',
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
        backgroundColor: '#F8F8F9',
    },
    buttonContainer: {
        flex: 1,
    },
    cancelButtonStyle: {
        backgroundColor: '#edede8',
        elevation: 0,
        width: '60%',
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonTitleText: {
        color: colors.GREY.default,
        fontSize: 20,
        alignSelf: 'flex-end',
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

const mapStateToProps = (state) => {
    return {
        user_info: state.account.user_info,
        search: state.location.search,
        old: state.location.old
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setDriver: (data) => {
            dispatch(setDriver(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);
