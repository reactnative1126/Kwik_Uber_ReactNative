import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements'

import { Header } from '@components';

export default class Profile extends Component {
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
                    <Header title="My Profile" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={{ padding: 20, width: '100%', alignItems: 'center' }}>
                        <Image
                            source={require('@assets/images/profilePic.png')}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                        <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>Vanessa Donovan</Text>
                        <Text style={{ fontSize: 17, color: '#888' }}>+00 984 979 137</Text>
                    </View>
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            padding: 20
                        }}>
                            <Icon name='user-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '40%' }}>Full Name</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>Vanessa Donovan</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            padding: 20
                        }}>
                            <Icon name='envelope-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '40%' }}>Email Address</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>vanessadon...</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            padding: 20
                        }}>
                            <Icon name='mobile' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '40%' }}>Mobile Number</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>+00 984 979 137</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderwidth: 1,
                            padding: 20
                        }} onPress={() => this.props.navigation.navigate('Password')}>
                            <Icon name='lock' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '85%' }}>Update Password</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderwidth: 1,
                            marginTop: 20,
                            padding: 20
                        }}>
                            <Icon name='bell-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '40%' }}>Notification</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>Vanessa Donovan</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
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
        // shadowColor: '#00F561',
        // shadowOpacity: 0.8,
        // shadowOffset: { height: 1, width: 1 },
        // shadowRadius: 2,
        // elevation: 10,
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
});
