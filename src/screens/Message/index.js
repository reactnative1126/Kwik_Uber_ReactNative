import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    View,
    Text,
    Image
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Rating } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messages: []
        }
    }

    async UNSAFE_componentWillMount() {
        await firebase.database().ref("messages").off();
    }

    componentDidMount() {
        this.getMessage(message =>
            this.setState(previous => ({
                messages: GiftedChat.append(previous.messages, message)
            }))
        );
    }

    getMessage = async callback => {
        const { user_info, driver_info } = this.props;
        await firebase.database().ref('messages').child(driver_info.driver_id).child(user_info.user_id).on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);
        return { _id, createdAt, text, user }
    }

    onSend = async messages => {
        const { user_info, driver_info } = this.props;
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id: user_info.user_id,
                    name: user_info.user_name,
                    avatar: user_info.profile_pic == null ? 'https://i.dlpng.com/static/png/6966798_preview.png' : configs.baseURL + '/uploads/' + user_info.profile_pic
                }
            };
            var database = firebase.database().ref('messages').child(driver_info.driver_id).child(user_info.user_id);
            database.push(message);
        })
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
                        onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={{ width: 15, height: 15, tintColor: 'rgba(0, 0, 0, 1)' }}
                            source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 9, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>{this.props.driver_info.driver_name}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { user_info } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <View style={{ width: '100%', alignItems: 'center', height: 20 }} />
                    <GiftedChat messages={this.state.messages} onSend={this.onSend}
                        user={{
                            _id: user_info.user_id,
                            name: user_info.user_name,
                            avatar: user_info.profile_pic == null ? 'https://i.dlpng.com/static/png/6966798_preview.png' : configs.baseURL + '/uploads/' + user_info.profile_pic,
                        }} />
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info,
        driver_info: state.account.driver_info
    }
}
export default connect(mapStateToProps, undefined)(Message)