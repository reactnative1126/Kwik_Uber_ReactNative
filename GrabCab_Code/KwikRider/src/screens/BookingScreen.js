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

import { Header, Rating } from '@components';

const items = [
    { index: 1, date: 'January 10 - 12:30 PM', pickup: 'Historical Library & Museum', destination: 'My Home' },
    { index: 2, date: 'February 15 - 4:50 PM', pickup: 'Royal Light Cinema', destination: 'Historical Library & Museum' },
    { index: 3, date: 'March 16 - 10:30 AM', pickup: 'My Home', destination: 'Historical Library & Museum' },
]
const histories = [
    { index: 1, date: 'May 11 - 12:30 PM', pickup: 'My Home', destination: 'Historical Library & Museum' },
    { index: 2, date: 'February 26 - 4:50 PM', pickup: 'Historical Library & Museum', destination: 'Royal Light Cinema' },
    { index: 3, date: 'March 30 - 10:30 AM', pickup: 'Royal Light Cinema', destination: 'My Home' },
]

export default class BookingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.navigation.getParam('tab'),
            date: 'May 11 - 12:30 PM',
            pickup: 'My Home',
            destination: 'Historical Library & Museum',
            isDetail: false
        }
    }
    renderUpcoming() {
        return (
            <View style={{ backgroundColor: '#D5D5D5', flex: 1 }}>
                <ScrollView>
                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                        {
                            items.map((item, key) => {
                                return (
                                    <View style={{ width: '100%', marginTop: 20, marginBottom: 10 }}>
                                        <Text>{item.date}</Text>
                                        <TouchableOpacity onPress={() => this.onDetail(item)}>
                                            <View style={styles.itemPanel}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <View>
                                                        <Icon name='circle' type='font-awesome' color='#02B06F' size={15} />
                                                        <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 20, marginLeft: 5 }} />
                                                    </View>
                                                    <View style={{ marginLeft: 20 }}>
                                                        <Text style={{ fontSize: 12, color: '#888' }}>Pickup Location</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{item.pickup}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 40, marginLeft: 5 }} />
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <Icon name='map-marker' type='font-awesome' color='#02B06F' size={20} />
                                                    <View style={{ marginLeft: 20 }}>
                                                        <Text style={{ fontSize: 12, color: '#888' }}>Destination Location</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{item.destination}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
    renderHistory() {
        return (
            <View style={{ backgroundColor: '#D5D5D5', flex: 1 }}>
                <ScrollView>
                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                        {
                            histories.map((item, key) => {
                                return (
                                    <View style={{ width: '100%', marginTop: 20, marginBottom: 10 }}>
                                        <Text>{item.date}</Text>
                                        <TouchableOpacity onPress={() => this.onDetail(item)}>
                                            <View style={styles.itemPanel}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <View>
                                                        <Icon name='circle' type='font-awesome' color='#02B06F' size={15} />
                                                        <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 20, marginLeft: 5 }} />
                                                    </View>
                                                    <View style={{ marginLeft: 20 }}>
                                                        <Text style={{ fontSize: 12, color: '#888' }}>Pickup Location</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{item.pickup}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 40, marginLeft: 5 }} />
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <Icon name='map-marker' type='font-awesome' color='#02B06F' size={20} />
                                                    <View style={{ marginLeft: 20 }}>
                                                        <Text style={{ fontSize: 12, color: '#888' }}>Destination Location</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{item.destination}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }

    onDetail(item) {
        this.setState({ isDetail: true })
    }

    renderDetail() {
        return (
            <View style={{ display: 'flex', position: 'absolute', justifyContent: 'center', alignItems: 'center', width: wp('100.0%'), height: hp('100.0%'), backgroundColor: '#000000BF', zIndex: 1000 }}>
                <View style={{ width: '80%', height: '80%', backgroundColor: '#FFF' }}>
                    <View style={{ width: '100%', height: 50, alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center' }} onPress={() => this.setState({ isDetail: false })}>
                            <Icon name='times' type='font-awesome' color='#999' size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/profilePic.png')}
                            style={{ width: 80, height: 80, borderRadius: 30 }}
                        />
                        <View style={styles.rating}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>4.9</Text>
                        </View>
                        <Text style={{ marginTop: -20, fontSize: 20, fontWeight: 'bold' }}>George Fdwards</Text>
                        <Text style={{ fontSize: 17, color: '#888' }}>XYZ-182</Text>
                        <View style={{ marginTop: 10 }}>
                            <Rating rating={3.5} />
                        </View>
                        <View style={{ width: '100%', padding: 30 }}>
                            <Text style={{ marginLeft: 30, marginBottom: 10 }}>{this.state.date}</Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View>
                                    <Icon name='circle' type='font-awesome' color='#02B06F' size={15} />
                                    <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 20, marginLeft: 5 }} />
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#888' }}>Pickup Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{this.state.pickup}</Text>
                                </View>
                            </View>
                            <View style={{ borderLeftWidth: 1, borderColor: '#AAA', height: 15, marginLeft: 5 }} />
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Icon name='map-marker' type='font-awesome' color='#02B06F' size={20} />
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#888' }}>Destination Location</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>{this.state.destination}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ width: 15, height: 30, backgroundColor: '#000000BF', borderTopRightRadius: 15, borderBottomRightRadius: 15 }} />
                            <View style={{ width: '80%', marginTop: 15 }}>
                                <View style={{ borderBottomWidth: 1, borderColor: '#D8D8D8' }} />
                            </View>
                            <View style={{ width: 15, height: 30, backgroundColor: '#000000BF', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }} />
                        </View>
                        <Text style={{ marginTop: 20, fontSize: 15, color: '#888' }}>Ride Cost</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>$48.98</Text>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="Booking" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={styles.topTab}>
                        <TouchableOpacity style={this.state.tab == 1 ? styles.selTab : styles.tab} onPress={() => this.setState({ tab: 1 })}>
                            <Text style={this.state.tab == 1 ? { color: '#03B273' } : { color: '#000' }}>Upcoming</Text>
                        </TouchableOpacity>
                        <View style={{ width: 1, height: 40, borderColor: '#D8D8D8', borderLeftWidth: 1 }} />
                        <TouchableOpacity style={this.state.tab == 2 ? styles.selTab : styles.tab} onPress={() => this.setState({ tab: 2 })}>
                            <Text style={this.state.tab == 2 ? { color: '#03B273' } : { color: '#000' }}>History</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.tab == 1 ? this.renderUpcoming() : this.renderHistory()
                    }
                </SafeAreaView>
                {
                    this.state.isDetail == true ?
                        this.renderDetail()
                        : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topTab: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 60,
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#D8D8D8',
    },
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 60
    },
    selTab: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 60,
        // borderColor: '#D8D8D8',
        borderBottomWidth: 2,
        borderBottomColor: '#03B273'
    },
    itemPanel: {
        justifyContent: 'space-between',
        width: '100%',
        height: 180,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginTop: 10,
        padding: 30,
        shadowColor: '#00F561',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    rating: {
        top: -30,
        left: 25,
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: '#00963D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00F561',
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
