import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    View,
    Text,
    Image,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
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
                        onPress={() => this.props.navigation.goBack()}>
                        <Image
                            style={{ width: 15, height: 15, tintColor: 'rgba(0, 0, 0, 1)' }}
                            source={images.icon_back} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 9, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>Payment Methods</Text>
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
                        <View style={{ height: 150, marginBottom: 12, width: wp('90.0%') }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 8 }}>
                                <View style={{ height: 120, width: wp('40.0%'), backgroundColor: '#FFFFFF', borderRadius: 8, justifyContent: 'center', flexDirection: 'column' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>{language.wallet_balance}</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '500', color: '#1CA84F' }}>{'$' + parseFloat(this.props.user_info.wallet_balance).toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity style={{
                                    height: 120, width: wp('40.0%'), backgroundColor: '#1CA84F', borderRadius: 8, justifyContent: 'center', flexDirection: 'column',
                                    shadowColor: '#000',
                                    shadowOpacity: 0.8,
                                    shadowOffset: { height: 1, width: 1 },
                                    shadowRadius: 2,
                                    elevation: 5,
                                }}
                                    onPress={() => this.props.navigation.push('Stripe')}>
                                    <Icon
                                        name='add-circle'
                                        type='MaterialIcons'
                                        color='#fff'
                                        size={45}
                                        iconStyle={{ lineHeight: 48 }}
                                    />
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#fff' }}>{language.add_money}</Text>

                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ paddingHorizontal: 10, fontSize: 18, fontWeight: '500', marginTop: 8 }}>{language.transaction_history_title}</Text>
                            </View>
                        </View>
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
        user_info: state.account.user_info
    }
}
export default connect(mapStateToProps, undefined)(Payment)
