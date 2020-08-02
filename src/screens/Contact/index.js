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

import { connect } from 'react-redux';

import { Header, Loading } from '@components';
import API from '@services/API';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: false
        }
    }

    async onMessage(){
        this.setState({ loading: true });
        await API.post('/message_us', {
            user_id: this.props.userinfo.user_id,
            fcm_id: this.props.userinfo.fcm_id,
            device_token: this.props.userinfo.device_token,
            message: this.state.message,
            api_token: this.props.userinfo.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                alert(resp.data.message);
                this.setState({ loading: false, message: '' });
            } else {
                alert(resp.data.message);
                this.setState({ loading: false });
            }
        })
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
                            <TouchableOpacity style={styles.rideBtn} onPress={() => this.onMessage()}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SEND MESSAGE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
                <Loading loading={this.state.loading} title={"Loading..."} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
});

const mapStateToProps = state => {
    return {
        logged: state.account.logged,
        userinfo: state.account.userinfo
    }
}
export default connect(mapStateToProps, undefined)(Contact)