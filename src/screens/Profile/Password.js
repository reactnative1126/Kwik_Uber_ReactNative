import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    LayoutAnimation,
    TouchableOpacity,
    View,
    Text,
    Image,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
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
                user_id: this.props.user_info.user_id,
                api_token: this.props.user_info.api_token,
                new_password: this.state.password
            }).then((resp) => {
                if (resp.data.success == 1) {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                } else {
                    alert(resp.data.message);
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
        }
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
                        onPress={() => this.props.navigation.pop()}>
                        <Image
                            style={{ width: 15, height: 15, tintColor: 'rgba(0, 0, 0, 1)' }}
                            source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 9, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>Update Password</Text>
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
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 20,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            paddingLeft: 10, paddingRight: 10
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
                            shadowColor: '#000',
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
                        <TouchableOpacity style={styles.rideBtn} onPress={() => { this.onPassword() }} >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <Loading loading={this.state.loading} />
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
    inputTextStyle: {
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 15,
    },
    inputContainerStyle: {
        marginTop: 20,
        borderBottomWidth: 0,
        borderBottomColor: '#000'
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
        user_info: state.account.user_info
    }
}
export default connect(mapStateToProps, undefined)(Password)
