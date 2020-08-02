import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Text,
    Image,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import { connect } from 'react-redux';
import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: false
        }
    }

    async onMessage() {
        this.setState({ loading: true });
        await API.post('/message_us', {
            user_id: this.props.user_info.user_id,
            fcm_id: this.props.user_info.fcm_id,
            device_token: this.props.user_info.device_token,
            message: this.state.message,
            api_token: this.props.user_info.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                this.setState({ loading: false, message: '' });
            } else {
                this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
                this.setState({ loading: false });
            }
        }).catch((error) => {
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
            this.setState({ loading: false });
        });
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
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>Contact Us</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <ScrollView style={{ flex: 1, backgroundColor: '#E5E5E5', padding: 20 }}>
                        <View style={{
                            width: '100%', height: 200, backgroundColor: '#FFFFFF', borderRadius: 5, padding: 10,
                            shadowColor: '#000',
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
                        </View>
                        <Text style={{ color: '#555', textAlign: 'right', marginTop: 20 }}>1200 Characters left</Text>
                        <TouchableOpacity style={styles.rideBtn} onPress={() => this.onMessage()}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SEND MESSAGE</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
                <Loading loading={this.state.loading} />
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={50}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
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
    rideBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
        user_info: state.account.user_info
    }
}
export default connect(mapStateToProps, undefined)(Contact)