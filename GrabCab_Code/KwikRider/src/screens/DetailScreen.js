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

import { Header } from '@components';
import images from '@constants/images';

export default class DetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingModal: false,
            userId: null,
            password: null,
            userIdMsg: null,
            passwordMsg: null,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="" isStatus="back-circle" navigation={this.props.navigation} />
                    <ScrollView>
                        <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={images.avatar} />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Cadillac One</Text>
                            <Text style={{ fontSize: 14, marginTop: 5, color: '#555' }}>First Class Limo Company</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Image style={styles.driverImage} source={images.driver} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Jane PohIson</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>4.9</Text>
                                        <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 1, width: '100%' }} />
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#00963D', textAlign: 'center', marginTop: 30 }}>Your Booking has been Confirmed!</Text>
                            <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginTop: 20 }}>We will send you notifications when your trip is coming close.</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 }}>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%', backgroundColor: '#D8D8D8' }]} onPress={() => this.props.navigation.navigate('Map')}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%' }]} onPress={() => this.props.navigation.navigate('Message')}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CONTACT</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity>
                            <Text style={{ fontSize: 14, color: '#00963D', textAlign: 'center', marginTop: 30 }}>VIEW DETAILS</Text>
                            </TouchableOpacity>

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
