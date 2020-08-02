import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Header } from '@components';

export default class index extends Component {
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
                    <Header title="Contact Us" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={{ width: '100%', alignItems: 'center', height: 20 }} />
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5', padding: 20 }}>
                        <View style={{
                            width: '100%', height: 200, backgroundColor: '#FFFFFF', borderRadius: 5, padding: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 10
                        }} >
                            <TextInput
                                multiline
                                numberOfLines={20}
                                editable={true}
                                maxLength={1200}
                                placeholder={"Write your message..."}
                                placeholderTextColor={'rgba(200, 200, 200, 0.8)'}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                value={this.state.message}
                                onChangeText={(text) => { this.setState({ message: text }) }}
                                textAlignVertical={'top'}
                            // inputContainerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                            // inputStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                            // containerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                            />
                            <Text style={{ color: '#555', textAlign: 'right', marginTop: 20 }}>1200 Characters left</Text>
                        </View>
                        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                            <TouchableOpacity style={styles.rideBtn}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SEND MESSAGE</Text>
                            </TouchableOpacity>
                        </View>
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
        marginLeft: 20,
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
});
