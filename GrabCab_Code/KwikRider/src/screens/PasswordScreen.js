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
import { Icon, Input } from 'react-native-elements'

import { Header, Rating } from '@components';
import images from '@constants/images';

export default class PasswordScreen extends Component {
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
                    <Header title="Update Password" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={{ width: '100%', alignItems: 'center', height: 20 }} />
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 20,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 10
                        }}>
                            <Input
                                ref={input => (this.passwordInput = input)}
                                editable={true}
                                underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                placeholder={"New Password"}
                                placeholderTextColor={'rgba(200, 200, 200, 0.8)'}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                value={this.state.password}
                                onChangeText={(text) => { this.setState({ password: text }) }}
                                onSubmitEditing={() => { this.confirmInput.focus() }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                                inputStyle={styles.inputTextStyle}
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 20,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 10
                        }}>
                            <Input
                                ref={input => (this.confirmInput = input)}
                                editable={true}
                                underlineColorAndroid={'rgba(240, 240, 240, 0)'}
                                placeholder={"Repeat New Password"}
                                placeholderTextColor={'rgba(200, 200, 200, 0.8)'}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                value={this.state.confirm}
                                onChangeText={(text) => { this.setState({ confirm: text }) }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                                inputStyle={styles.inputTextStyle}
                            />
                        </View>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', padding: 20 }}>
                        <TouchableOpacity style={styles.rideBtn}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
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
    rideBtn: {
        position: 'absolute',
        bottom: 10,
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
    inputTextStyle: {
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 15,
        // height: 32,
        // marginTop: 10
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        borderBottomColor: '#FFF'
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
