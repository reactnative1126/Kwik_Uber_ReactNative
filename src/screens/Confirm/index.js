import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements'

import { connect } from 'react-redux';
import { setBooking } from '@modules/booking/actions';
import { Loading } from '@components';
import {SendPushNotification} from '@constants/functions';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Confirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: this.props.route.params.data
        }
    }

    async onConfirm() {
        const { data } = this.state;
        const { device_token, user_info, driver_info } = this.props;
        this.setState({ loading: true });
        if (data.confirm_type == 0) {
            await API.post('/book_now', {
                user_id: user_info.user_id,
                api_token: user_info.api_token,
                source_address: data.source_address,
                source_lat: data.source_lat,
                source_long: data.source_long,
                dest_address: data.dest_address,
                dest_lat: data.dest_lat,
                dest_long: data.dest_long,
                booking_type: data.booking_type,
                no_of_persons: data.no_of_persons,
                driver_id: driver_info.driver_id,
                vehicle_id: driver_info.vehicle_id,
                vehicle_typeid: driver_info.vehicle_type,
                amount: data.amount
            }).then((resp) => {
                if (resp.data.success == 1) {
                    this.setState({ loading: false });
                    this.props.setBooking({
                        source_address: data.source_address,
                        source_lat: data.source_lat,
                        source_long: data.source_long,
                        dest_address: data.dest_address,
                        dest_lat: data.dest_lat,
                        dest_long: data.dest_long
                    });
                    // SendPushNotification(user_info.device_token, "Title", "Description", resp.data.data);
                    this.props.navigation.push('Accepts');

                } else {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            })
        } else if (data.confirm_type == 1) {
            await API.post('/book_later', {
                user_id: user_info.user_id,
                api_token: user_info.api_token,
                source_address: data.source_address,
                source_lat: data.source_lat,
                source_long: data.source_long,
                dest_address: data.dest_address,
                dest_lat: data.dest_lat,
                dest_long: data.dest_long,
                booking_type: data.booking_type,
                no_of_persons: data.no_of_persons,
                driver_id: driver_info.driver_id,
                vehicle_id: driver_info.vehicle_id,
                vehicle_typeid: driver_info.vehicle_type,
                amount: data.amount,
                passengers: data.passengers,
                luggage: data.luggage,
                journey_date: data.fromDate,
                journey_start_time: data.fromTime,
                journey_end_time: data.toTime
            }).then((resp) => {
                if (resp.data.success == 1) {
                    this.setState({ loading: false });
                    this.props.setBooking({
                        booking_id: resp.data.data.booking_id,
                        source_address: data.source_address,
                        source_lat: data.source_lat,
                        source_long: data.source_long,
                        dest_address: data.dest_address,
                        dest_lat: data.dest_lat,
                        dest_long: data.dest_long
                    });
                    this.props.navigation.push('Accepts');
                } else {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            })
        }
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000 }]}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#FFF949',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                        }}
                        onPress={() => this.props.navigation.pop()}>
                        <Image
                            style={{ width: 15, height: 15, tintColor: 'rgba(0, 0, 0, 1)' }}
                            source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 9 }} />
            </View>
        );
    }

    render() {
        const { data } = this.state;
        const { user_info, driver_info } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={false}
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <ScrollView>
                        <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={user_info.profile_pic == null ? images.img_avatar : { uri: configs.baseURL + '/uploads/' + user_info.profile_pic }} />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{user_info.user_name}</Text>
                            <Text style={{ fontSize: 14, marginTop: 5, color: '#555' }}>{user_info.email}</Text>
                            <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 1, width: '100%' }} />
                            <View style={{ width: '90%', height: 90, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.srcCircle} />
                                    <Text style={{ marginLeft: 5, width: wp('70.0%') }}>{data.source_address}</Text>
                                </View>
                                <View style={{ width: 1, height: 15, marginLeft: 15, borderLeftWidth: 1, borderLeftColor: '#999' }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.desCircle} />
                                    <Text style={{ marginLeft: 5, width: wp('70.0%') }}>{data.dest_address}</Text>
                                </View>
                            </View>
                            <View style={styles.driverItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={styles.driverImage} source={driver_info.driver_image == null ? images.img_driver : { uri: configs.baseURL + '/uploads/' + driver_info.driver_image }} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{driver_info.driver_name}</Text>
                                        <Text style={{ fontSize: 13, color: '#555' }}>{driver_info.vehicle_make} {driver_info.vehicle_model} {driver_info.vehicle_type}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2, paddingLeft: 10, paddingRight: 10, borderRadius: 50, borderWidth: 1, borderColor: '#E3E3E3', backgroundColor: '#FFF' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>{driver_info.driver_review == null ? 0 : driver_info.driver_review}</Text>
                                    <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                </View>
                            </View>
                            {data.confirm_type == 0 ? null :
                                <View style={styles.step1}>
                                    <View style={styles.step1Spec}>
                                        <View style={{ width: '50%', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Passengers</Text>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.passengers}</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'center', borderLeftWidth: 1, borderColor: '#D8D8D8' }}>
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Luggage</Text>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.luggage}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.step1Spec}>
                                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Icon name='calendar' type='font-awesome' size={22} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Date</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.fromDate}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '50%', borderLeftWidth: 1, borderColor: '#D8D8D8', paddingLeft: 20 }}>
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}> </Text>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.toDate}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.step1Spec2}>
                                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Icon name='clock-o' type='font-awesome' size={22} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Pick Up</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.fromTime}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '50%', borderLeftWidth: 1, borderColor: '#D8D8D8', paddingLeft: 20 }}>
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#9B9B9B' }}>Drop Off</Text>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.toTime}</Text>
                                        </View>
                                    </View>
                                    {/* <View style={styles.step1Spec}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Image style={{ width: 30, height: 30 }} source={images.icon_edit} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 13, color: '#555' }}>Boquet of Flowers</Text>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Special Request</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20 }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 5 }}>+${data.amount}</Text>
                                        </View>
                                    </View> */}
                                    {/* <View style={styles.step1Spec2}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Image style={{ width: 30, height: 30 }} source={images.icon_coin} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 13, color: '#555' }}>Payment Method</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image style={{ width: 50, height: 30, marginRight: 10 }} source={images.icon_visa} />
                                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Special Request</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View> */}
                                </View>}
                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#9B9B9B' }}>TOTAL</Text>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#00963D' }}>+${data.amount}</Text>
                                </View>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%' }]} onPress={() => this.onConfirm()}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CONFRIM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <Loading loading={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    srcCircle: {
        marginLeft: 10, marginRight: 10,
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
        marginLeft: 10, marginRight: 10,
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
    step1: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        width: '100%',
        height: 210,
        borderRadius: 15,
        borderWidth: 1,
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
});

const mapStateToProps = (state) => {
    return {
        device_token: state.account.device_token,
        user_info: state.account.user_info,
        driver_info: state.account.driver_info
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setBooking: (data) => {
            dispatch(setBooking(data))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Confirm);