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

export default class ConfirmScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
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
                            <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 1, width: '100%' }} />
                            <View style={{ width: '90%', height: 70, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.srcCircle} />
                                    <Text style={{ marginLeft: 5 }}>5789 Birch Street Ave</Text>
                                </View>
                                <View style={{ width: 1, height: 15, marginLeft: 15, borderLeftWidth: 1, borderLeftColor: '#999' }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.desCircle} />
                                    <Text style={{ marginLeft: 5 }}>1234 Loring Street</Text>
                                </View>
                            </View>
                            <View style={styles.driverItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={styles.driverImage} source={images.driver} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Jane PohIson</Text>
                                        <Text style={{ fontSize: 13, color: '#555' }}>Audi A6 Sedan</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, paddingLeft: 10, paddingRight: 10, borderRadius: 50, borderWidth: 1, borderColor: '#E3E3E3', backgroundColor: '#FFF' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#079D54', marginRight: 5 }}>4.9</Text>
                                    <Icon name='star' type='font-awesome' color='#079D54' size={15} />
                                </View>
                            </View>
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
                                <View style={styles.step1Spec}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                        <Image style={{ width: 30, height: 30 }} source={images.icon_edit} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 13, color: '#555' }}>Boquet of Flowers</Text>
                                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Special Request</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 5 }}>+$70</Text>
                                    </View>
                                </View>
                                <View style={styles.step1Spec2}>
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
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#9B9B9B' }}>TOTAL</Text>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#00963D' }}>+$152.38</Text>
                                </View>
                                <TouchableOpacity style={[styles.rideBtn, { width: '48%' }]} onPress={() => this.props.navigation.navigate('detail')}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CONFRIM</Text>
                                </TouchableOpacity>
                            </View>
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
