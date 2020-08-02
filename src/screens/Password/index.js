import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    LayoutAnimation,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input } from 'react-native-elements'

import { connect } from 'react-redux';

import { Header, Loading } from '@components';
import API from '@services/API';

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm: '',
            passwordValid: true,
            confirmValid: true,
            loading: false
        }
    }

    // password validation
    validatePassword() {
        const { password } = this.state
        const passwordValid = (password.length > 5)
        LayoutAnimation.easeInEaseOut()
        this.setState({ passwordValid })
        passwordValid || this.passwordInput.shake()
        return passwordValid
    }

    // confirm validation
    validateConfirm() {
        const { password, confirm } = this.state
        const confirmValid = (password == confirm)
        LayoutAnimation.easeInEaseOut()
        this.setState({ confirmValid })
        confirmValid || this.confirmInput.shake()
        return confirmValid
    }

    //register button press for validation
    async onPassword() {
        LayoutAnimation.easeInEaseOut();
        const passwordValid = this.validatePassword();
        const confirmValid = this.validateConfirm();

        if (passwordValid && confirmValid) {
            this.setState({ loading: true });
            await API.post('/change_password', {
                user_id: this.props.userinfo.user_id,
                api_token: this.props.userinfo.api_token,
                new_password: this.state.password
            }).then((resp) => {
                if (resp.data.success == 1) {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                } else {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                }
            })
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
                                onSubmitEditing={() => { this.validatePassword(); this.confirmInput.focus() }}
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
                                errorMessage={this.state.confirmValid ? null : "Please enter confirm password correctly"}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                                inputStyle={styles.inputTextStyle}
                            />
                        </View>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', padding: 20 }}>
                        <TouchableOpacity style={styles.rideBtn}
                            onPress={() => { this.onPassword() }} >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                        </TouchableOpacity>
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
        logged: state.account.logged,
        userinfo: state.account.userinfo
    }
}
export default connect(mapStateToProps, undefined)(Password)
