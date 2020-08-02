import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input } from 'react-native-elements';
import { CreditCardInput } from "react-native-credit-card-input";
import stripe, { PaymentCardTextField } from 'tipsi-stripe';
stripe.setOptions({
    publishableKey: 'pk_test_51Gv5A8JVSIGR903OAYbKIR9NYHKxE0riAnmiR5onEGejbzbRFj1i4j4ePe4VRdSXy2ZMpf5zFlQbpZkn7tr0MdEi00P7ImVO21'
});

import { connect } from 'react-redux';
import { Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
// import API from '@services/API';
import axios from "axios";

class Stripe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            amount: 5,
            valid: false,
            token: null,
            params: {
                number: '',
                expMonth: 0,
                expYear: 0,
                cvc: '',
            },
        }
    }

    onChange = (formData) => {
        if (formData.valid == true && formData.status.number == "valid" && formData.status.expiry == "valid" && formData.status.cvc == "valid") {
            const params = {
                number: formData.values.number,
                expMonth: parseInt(formData.values.expiry.split('/')[0]),
                expYear: parseInt(formData.values.expiry.split('/')[1]),
                cvc: formData.values.cvc
            };
            this.setState({ valid: true, params: params });
        } else {
            this.setState({ valid: false });
        }
    }

    checkOut = async () => {
        if (this.state.valid == true) {
            this.setState({ loading: true, token: null });
            var totalPrice = this.state.amount;
            const token = await stripe.createTokenWithCard(this.state.params);
            alert(token.tokenId);
            await axios({
                method: 'POST',
                url: 'http://localhost:5000/kwik-35758/us-central1/paymentWithStripe',
                data: {
                    amount: Math.round(totalPrice),
                    currency: 'usd',
                    token: token.tokenId,
                },
            }).then(response => {
                alert(JSON.stringify(response));
            });
        }
    };

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
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>Charge from Stripe</Text>
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
                    <ScrollView>
                        <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                            <CreditCardInput
                                // autoFocus
                                requiresCVC
                                labelStyle={styles.label}
                                inputStyle={styles.input}
                                validColor={"black"}
                                invalidColor={"red"}
                                placeholderColor={"darkgray"}
                                onChange={this.onChange} />
                        </View>
                        <TouchableOpacity style={styles.rideBtn} onPress={() => this.checkOut()}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>CHECK OUT</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
    bodyContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 12
    },
    walletbalText: {
        width: '100%',
        fontSize: 17
    },
    balance: {
        fontWeight: 'bold'
    },
    inputTextStyle: {
        marginTop: 10,
        width: '100%',
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize: 30
    },
    buttonWrapper2: {
        marginBottom: 10,
        marginTop: 18,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        borderRadius: 8,
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 18,
    },
    quickMoneyContainer: {
        marginTop: 18,
        flexDirection: 'row',
        paddingVertical: 4,
        paddingLeft: 4,
    },
    boxView: {
        height: 40,
        width: 55,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 5,
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
    label: {
        color: "black",
        fontSize: 12,
    },
    input: {
        fontSize: 16,
        color: "black",
    },
    field: {
        width: '98%',
        color: '#449aeb',
        borderColor: '#b3b3b3',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
});

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info
    }
}
export default connect(mapStateToProps, undefined)(Stripe)
