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
import { Icon } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Accepts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000 }]}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                    <TouchableOpacity
                        style={[styles.menuBTN, { marginLeft: 20 }]}
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={images.icon_menu} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                </View>
                <View style={{ flex: 8 }} />
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {/* <TouchableOpacity
                        style={[styles.menuBTN, { marginLeft: 20 }]}
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={images.icon_menu} />
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }

    render() {
        const { user_info, driver_info } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <ScrollView>
                        <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={user_info.profile_pic ? { uri: configs.baseURL + '/uploads/' + user_info.profile_pic } : images.img_avatar} />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{user_info.user_name}</Text>
                            <Text style={{ fontSize: 14, marginTop: 5, color: '#555' }}>{user_info.email}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Image style={styles.driverImage} source={driver_info.driver_image == null ? images.img_driver : { uri: configs.baseURL + '/uploads/' + driver_info.driver_image }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{driver_info.driver_name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>{driver_info.driver_review == null ? 0 : driver_info.driver_review}</Text>
                                        <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 1, width: '100%' }} />
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#00963D', textAlign: 'center', marginTop: 30 }}>Your Booking has been Confirmed!</Text>
                            <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginTop: 20 }}>We will send you notifications when your trip is coming close.</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 }}>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%', backgroundColor: '#D8D8D8' }]} onPress={() => this.props.navigation.reset({ routes: [{ name: 'App' }] })}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%' }]} onPress={() => this.props.navigation.navigate('Message')}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CONTACT</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', { driver_id: data.driver_data.driver_meta.id })}>
                                <Text style={{ fontSize: 14, color: '#00963D', textAlign: 'center', marginTop: 30 }}>VIEW DETAILS</Text>
                            </TouchableOpacity> */}
                        </View>
                    </ScrollView>
                </SafeAreaView>
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
        // padding: 10,
        width: '100%',
        height: 350,
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

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info,
        driver_info: state.account.driver_info
    }
}
export default connect(mapStateToProps, undefined)(Accepts)