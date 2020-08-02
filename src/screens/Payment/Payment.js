import React, { Component } from "react";

import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    TouchableHighlight,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input } from 'react-native-elements';
// import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
// Stripe.setOptionsAsync({
//     publishableKey: 'pk_test_51Gv5A8JVSIGR903OLj2yjWsYIJTRjejBxDJ0FO1WBikepcXvFJfRh6APMxqn1Q7ITyQRnuNBOksPP9kflsgxnp0F00ueAK7P4f'
// });

import { connect } from 'react-redux';

import { Header, Loading, PayStripe, PayBraintree } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            payData: null,
            stripe: false,
            braintree: false,
            token: null,
        }
    }


    componentDidMount() {
        let payData = this.props.navigation.getParam('payData');
        if (payData) {
            this.setState({ payData: payData }, () => {
                console.log(this.state);
            });
        }
    }

    onPressStripe = async () => {
        try {
            this.setState({ loading: true, token: null });
            const params = {
                // mandatory
                number: '4242424242424242',
                expMonth: 11,
                expYear: 24,
                cvc: '223',
                // optional
                // name: 'Test User',
                // currency: 'usd',
                // addressLine1: '123 Test Street',
                // addressLine2: 'Apt. 5',
                // addressCity: 'Test City',
                // addressState: 'Test State',
                // addressCountry: 'Test Country',
                // addressZip: '55555',
            };
            // const token = await Stripe.createTokenWithCardAsync(params);
            // alert(token.tokenId)

            this.setState({ loading: false, token });
        } catch (error) {
            this.setState({ loading: false });
        }


    };

    onPressBraintree = () => {
        this.setState({ braintree: true });
    };

    onSuccessHandler = () => {
        // if (this.state.userdata.paymentType) {

        //     console.log('users/' + this.state.userdata.driver + '/my_bookings/' + this.state.userdata.bookingKey + '/')
        //     firebase.database().ref('users/' + this.state.userdata.driver + '/my_bookings/' + this.state.userdata.bookingKey + '/').update({
        //       payment_status: "PAID",
        //       payment_mode: this.state.userdata.paymentMode,
        //       customer_paid: this.state.userdata.customer_paid,
        //       discount_amount: this.state.userdata.discount_amount,
        //       usedWalletMoney: this.state.userdata.usedWalletAmmount,
        //       cardPaymentAmount: this.state.userdata.cardPaymentAmount,
        //       getway:this.state.stripe?'Stripe':'Braintree'
        //     }).then(() => {
        //       firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/my-booking/' + this.state.userdata.bookingKey + '/').update({
        //         payment_status: "PAID",
        //         payment_mode: this.state.userdata.paymentMode,
        //         customer_paid: this.state.userdata.customer_paid,
        //         discount_amount: this.state.userdata.discount_amount,
        //         usedWalletMoney: this.state.userdata.usedWalletAmmount,
        //         cardPaymentAmount: this.state.userdata.cardPaymentAmount,
        //         getway:this.state.stripe?'Stripe':'Braintree'
        //       }).then(() => {
        //         firebase.database().ref('bookings/' + this.state.userdata.bookingKey + '/').update({
        //           payment_status: "PAID",
        //           payment_mode: this.state.userdata.paymentMode,
        //           customer_paid: this.state.userdata.customer_paid,
        //           discount_amount: this.state.userdata.discount_amount,
        //           usedWalletMoney: this.state.userdata.usedWalletAmmount,
        //           cardPaymentAmount: this.state.userdata.cardPaymentAmount,
        //           getway:this.state.stripe?'Stripe':'Braintree'
        //         }).then(() => {

        //           if (this.state.userdata.usedWalletAmmount) {
        //             if (this.state.userdata.usedWalletAmmount > 0) {
        //               let tDate = new Date();
        //               firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletHistory').push({
        //                 type: 'Debit',
        //                 amount: this.state.userdata.usedWalletAmmount,
        //                 date: tDate.toString(),
        //                 txRef: this.state.userdata.bookingKey,
        //               }).then(() => {
        //                 firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/').update({
        //                   walletBalance: this.state.userdata.currentwlbal - this.state.userdata.usedWalletAmmount
        //                 })
        //               })
        //             }
        //           }
        //         })
        //         setTimeout(() => {
        //           this.props.navigation.navigate('ratingPage', { data: this.state.userdata });
        //         }, 3000)

        //       })

        //     })

        //   } else {
        //     let tDate = new Date();
        //     let Walletballance = this.state.userdata.walletBalance + parseInt(this.state.payData.amount)
        //     firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletBalance').set(Walletballance).then(() => {
        //       firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletHistory').push({
        //         type: 'Credit',
        //         amount: parseInt(this.state.payData.amount),
        //         date: tDate.toString(),
        //         txRef: this.state.payData.order_id,
        //         getway:this.state.stripe?'Stripe':'Braintree'
        //       })

        //       setTimeout(() => {
        //       this.props.navigation.navigate('wallet')
        //       },3000)
        //     });
        //   }
    };

    // onCanceledHandler = () => {
    //     if (this.state.userdata.paymentType) {
    //         setTimeout(() => {
    //             this.props.navigation.navigate('CardDetails')
    //         }, 5000)
    //     } else {
    //         setTimeout(() => {
    //             this.props.navigation.navigate('wallet')
    //         }, 5000)
    //     }
    // };
    // goBack() {
    //     this.props.navigation.goBack();
    // }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="Payment Methods" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={{ width: '100%', alignItems: 'center', height: 20 }} />
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>

                        {this.state.stripe ? <PayStripe payData={this.state.payData} onSuccess={this.onSuccessHandler} onCancel={this.onCanceledHandler} /> : null}
                        {this.state.braintree ? <PayBraintree payData={this.state.payData} onSuccess={this.onSuccessHandler} onCancel={this.onCanceledHandler} /> : null}
                        {this.state.stripe || this.state.braintree ? null :
                            <View>
                                <View style={[styles.box, { marginTop: 12 }]}>
                                    <TouchableHighlight onPress={this.onPressStripe} underlayColor='#99d9f4'>
                                        <Image
                                            style={styles.thumb}
                                            source={require('@assets/images/stripe-logo.png')}
                                        />
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.box}>
                                    <TouchableHighlight onPress={() => this.setState({ stripe: true })} underlayColor='#99d9f4'>
                                        <Image
                                            style={styles.thumb}
                                            source={require('@assets/images/braintree-logo.png')}
                                        />
                                    </TouchableHighlight>
                                </View>
                            </View>
                        }
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
    thumb: {
        height: 35,
        resizeMode: 'contain'
    }
});

const mapStateToProps = state => {
    return {
        logged: state.account.logged,
        userinfo: state.account.userinfo
    }
}
export default connect(mapStateToProps, undefined)(Payment)
