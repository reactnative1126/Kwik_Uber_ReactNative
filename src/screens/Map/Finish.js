import React from 'react';
import {
    Platform,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Button, Avatar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import haversine from "haversine";

import { connect } from 'react-redux';
import { setCustomer } from '@modules/account/actions';
import { setNotification, setBooking } from '@modules/booking/actions';
import { Header, Loading, Rating } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Finish extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            status: false,
            ratings: false,
            amount: this.props.route.params.amount
        };
    }
    componentDidMount() {
        console.log(this.state.data)
    }

    async onArrived() {
        const { status, data } = this.state;
        if (status == 1) {
            this.setState({ status: 2 });
        } else if (status == 3) {
            this.setState({ status: 4, loading: true });
        } else if (status == 4) {
            this.setState({ loading: true });
        }
    }

    async onPayment() {
        const { user_info, booking_info } = this.props;
        this.setState({ status: true, loading: false });
        await API.post('/confirm_payment', {
            booking_id: booking_info.booking_id,
            api_token: user_info.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                this.props.setNotification(null);
                this.props.setCustomer(null);
                this.props.setBooking(null);
                this.setState({ loading: false });
                this.props.navigation.reset({ routes: [{ name: 'App'}] });
            } else {
                alert(resp.data.message);
                this.setState({ loading: false });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false });
        });
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000, backgroundColor: colors.WHITE }]}>
                <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
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
                    {/* <TouchableOpacity
                        style={[styles.menuBTN, { backgroundColor: colors.WHITE }]}
                        onPress={() => this.setState({ menu: true })}>
                        <Icon name='ellipsis-v' type='font-awesome' size={25} />
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }

    renderAlert() {
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
                    height: 300,
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingTop: 30
                }}>
                    <Icon name='checkcircleo' type='antdesign' color='#02B06F' size={50} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{'Successfully Finished'}</Text>
                        <Text style={{ color: '#555', marginBottom: 10, textAlign: 'center', fontSize: 18 }}>{'Current trip is successfully finished. Visit Again'}</Text>
                    </View>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.rideBtn1} onPress={() => {
                            this.setState({
                                status: false, ratings: true
                            })
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>OK THANKS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { user_info, customer_info, booking_info } = this.props;
        return (
            <View style={styles.mainViewStyle}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5', padding: 20 }}>
                        <View style={{
                            alignItems: 'center',
                            width: '100%', height: 80, backgroundColor: '#FFFFFF', borderRadius: 5, paddingTop: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 10
                        }} >
                            <Text style={{ color: '#AAA' }}>TOTAL FARE</Text>
                            <Text style={{ color: '#00963D', fontSize: 35, fontWeight: 'bold' }}>${this.state.amount}</Text>
                        </View>
                        {/* <Text style={{ marginTop: 10 }}>{booking_info.source_timestamp}</Text> */}
                        <View style={styles.itemPanel}>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View>
                                    <Icon name='circle' type='font-awesome' color='#02B06F' size={15} />
                                    <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 20, marginLeft: 5 }} />
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#888' }}>Pickup Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{booking_info.source_address.substr(1, 30)}</Text>
                                </View>
                            </View>
                            <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 20, marginLeft: 5 }} />
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Icon name='map-marker' type='font-awesome' color='#02B06F' size={20} />
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#888' }}>Destination Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{booking_info.dest_address.substr(1, 30)}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            width: '100%', height: 80, backgroundColor: '#FFFFFF', borderRadius: 5, paddingTop: 20, marginTop: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 10
                        }} >
                            <Text style={{ color: '#AAA' }}>Payment Type: <Text style={{ color: '#00963D' }}>Cash</Text></Text>
                            <Text style={{ marginTop: 5 }}>Pleasen collect money from rider</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            width: '100%', height: 160, backgroundColor: '#FFFFFF', borderRadius: 5, marginTop: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 10
                        }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 40, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={{ color: '#AAA' }}>Base Fare</Text>
                                <Text style={{ marginTop: 5, color: '#00963D' }}>${booking_info.fare_info.base_fare}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 40, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={{ color: '#AAA' }}>Distance(0.08km)</Text>
                                <Text style={{ marginTop: 5, color: '#00963D' }}>$5.00</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 40, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={{ color: '#AAA' }}>Time(5.38 Minute)</Text>
                                <Text style={{ marginTop: 5, color: '#00963D' }}>$00.00</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 40, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingLeft: 20, paddingRight: 20 }}>
                                <Text style={{ color: '#AAA' }}>InTransit Waiting Fee</Text>
                                <Text style={{ marginTop: 5, color: '#00963D' }}>$00.00</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.rideBtn} onPress={() => this.onPayment()}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>COLLECT PAYMENT</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                {this.state.status ? this.renderAlert() : null}
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
        // marginLeft: 20,
        marginTop: 5,
        marginBottom: 5,
        width: '50%',
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
    itemPanel: {
        justifyContent: 'space-between',
        width: '100%',
        height: 130,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginTop: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
});

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info,
        customer_info: state.account.customer_info,
        booking_info: state.booking.booking_info

    }
}
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
export default connect(mapStateToProps, mapDispatchToProps)(Finish)