import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';

import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            rating: 0,
            review_text: ''
        }
    }

    async onSubmit() {
        const { user_info, driver_info, booking_info } = this.props;
        this.setState({ loading: true });
        await API.post('/review', {
            booking_id: booking_info.booking_id,
            ratings: this.state.rating ? this.state.rating : 0,
            review_text: this.state.comment ? this.state.comment : '',
            api_token: user_info.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                this.setState({ loading: false });
                this.props.navigation.reset({ routes: [{ name: 'App' }] });
            } else {
                alert(resp.data.message);
                this.setState({ loading: false });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false });
        });
    }

    renderHeader() {
        return (
            <View style={[styles.header, { zIndex: 1000 }]}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                    <TouchableOpacity
                        style={{ width: 20, height: 20 }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={{ width: 20, height: 20, tintColor: 'rgba(255, 255, 255, 1)' }}
                            source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 8, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Rating</Text>
                </View>
                <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 2 }}>
                    {/* <TouchableOpacity
                        style={[styles.menuBTN, { backgroundColor: colors.WHITE }]}
                        onPress={() => this.setState({ menu: true })}>
                        <Icon name='ellipsis-v' type='font-awesome' size={25} />
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }

    render() {
        const { rating, user_info, driver_info, booking_info } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <ImageBackground
                    source={require("@assets/images/background.png")}
                    resizeMode="stretch"
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderHeader()}
                        <KeyboardAwareScrollView>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20 }}>
                                <View style={{
                                    width: '100%', marginTop: 20, backgroundColor: '#FFF', borderRadius: 10,
                                    shadowColor: '#00F561',
                                    shadowOpacity: 0.8,
                                    shadowOffset: { height: 1, width: 1 },
                                    shadowRadius: 2,
                                    elevation: 10,
                                }}>
                                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                                        <Image
                                            source={driver_info.profile_pic == null ? images.img_driver : { uri: configs.baseURL + '/uploads/' + driver_info.profile_pic }}
                                            style={{ width: 80, height: 80, borderRadius: 40 }}
                                        />
                                        <View style={styles.rating}>
                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{driver_info.ratings ? driver_info.ratings : 0}</Text>
                                        </View>
                                        <Text style={{ marginTop: -20, fontSize: 20, fontWeight: 'bold' }}>{driver_info.driver_name}</Text>
                                        <Text style={{ fontSize: 17, color: '#888' }}>XYZ-182</Text>
                                        <Text style={{ marginTop: 10, fontSize: 25, color: '#00963D', fontWeight: 'bold' }}>How was your trip?</Text>
                                        <Text style={{ marginTop: 10, fontSize: 15, color: '#888', textAlign: 'center' }}>Your feedback will help improve driving experience</Text>

                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            {rating >= 1 ?
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: rating == 1 ? 0 : 1 })}>
                                                    <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: rating == 1 ? 0 : 1 })}>
                                                    <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                                </TouchableOpacity>
                                            }
                                            {rating >= 2 ?
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 2 })}>
                                                    <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 2 })}>
                                                    <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                                </TouchableOpacity>
                                            }
                                            {rating >= 3 ?
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 3 })}>
                                                    <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 3 })}>
                                                    <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                                </TouchableOpacity>
                                            }
                                            {rating >= 4 ?
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 4 })}>
                                                    <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 4 })}>
                                                    <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                                </TouchableOpacity>
                                            }
                                            {rating >= 5 ?
                                                <TouchableOpacity onPress={() => this.setState({ rating: 5 })}>
                                                    <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                                </TouchableOpacity> :
                                                <TouchableOpacity onPress={() => this.setState({ rating: 5 })}>
                                                    <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10 }}>
                                        <View style={{ width: '100%', height: 100, borderWidth: 1, borderColor: '#888', backgroundColor: '#EFEFF2', borderRadius: 5, padding: 10 }} >
                                            <TextInput
                                                multiline
                                                numberOfLines={5}
                                                editable={true}
                                                maxLength={1200}
                                                placeholder={"Additional Comments..."}
                                                placeholderTextColor={'rgba(200, 200, 200, 0.8)'}
                                                secureTextEntry={true}
                                                blurOnSubmit={false}
                                                value={this.state.comment}
                                                onChangeText={(text) => { this.setState({ comment: text }) }}
                                                textAlignVertical={'top'}
                                            // inputContainerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                            // inputStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                            // containerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10, marginBottom: 20 }}>
                                        <TouchableOpacity style={styles.rideBtn} onPress={() => this.onSubmit()}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
                <Loading loading={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        driver_info: state.account.driver_info,
        booking_info: state.booking.booking_info
    }
}
export default connect(mapStateToProps, undefined)(Rating)