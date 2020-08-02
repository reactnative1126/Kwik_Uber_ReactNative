import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    TextInput,
    FlatList,
    ScrollView,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input } from 'react-native-elements';

import { connect } from 'react-redux';

import { Header, Loading } from '@components';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Money extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            amount: '5',
            qickMoney: [{ amount: '5', selected: false }, { amount: '10', selected: false }, { amount: '20', selected: false }, { amount: '50', selected: false }, { amount: '100', selected: false }],
        }
    }

    selectMoney(index) {
        let quickM = this.state.qickMoney;
        for (let i = 0; i < quickM.length; i++) {
            quickM[i].selected = false;
            if (i == index) {
                quickM[i].selected = true;
            }
        }
        this.setState({
            amount: quickM[index].amount,
            qickMoney: quickM
        })
    }

    payNow() {
        if(this.state.amount == null || this.state.amount == ''){
            alert('Please enter amount')
        } else {
            var d = new Date();
            var time = d.getTime();
            let payData = {
                email: this.props.userinfo.email,
                amount: this.state.amount,
                order_id: time.toString(),
                name: language.add_money,
                description: language.wallet_balance,
                currency: 'USD',
                quantity: 1,
            }
            if (payData) {
                this.props.navigation.navigate("Payment", {
                    payData: payData
                });
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="Add Money" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={{ width: '100%', alignItems: 'center', height: 20 }} />
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                        <Text style={styles.walletbalText}>{language.Balance} - <Text style={styles.balance}>{'$' + parseFloat(this.props.userinfo.wallet_balance).toFixed(2)}</Text></Text>
                        <TextInput
                            style={styles.inputTextStyle}
                            placeholder={language.addMoneyTextInputPlaceholder + " ($)"}
                            keyboardType={'number-pad'}
                            onChangeText={(text) => this.setState({ amount: text })}
                            value={this.state.amount}
                        />
                        <View style={styles.quickMoneyContainer}>
                            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.qickMoney}
                                    renderItem={({item, index}) => (
                                        <TouchableOpacity style={[styles.boxView, { backgroundColor: item.selected ? '#00963D' : '#EEEEEE' }]}
                                            onPress={() => { this.selectMoney(index); }}>
                                            <Text style={styles.quckMoneyText, { color: item.selected ? '#fff' : '#000' }} >
                                                {'$'}{item.amount}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    horizontal={true}
                                />
                            </ScrollView>
                        </View>
                        <TouchableOpacity
                            style={styles.rideBtn}
                            onPress={() => {
                                this.payNow();
                            }}>
                            <Text style={styles.buttonTitle}>{language.add_money_tile}</Text>
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
    bodyContainer: {
        flex: 1,
        flexDirection: 'column',
        // marginTop: 10,
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
});

const mapStateToProps = state => {
    return {
        logged: state.account.logged,
        userinfo: state.account.userinfo
    }
}
export default connect(mapStateToProps, undefined)(Money)

// if (formData.valid == true && formData.status.number == "valid" && formData.status.expiry == "valid" && formData.status.cvc == "valid") {
//     Alert.alert(
//         'Charge money from your card...',
//         'Would you charge money from your card to this wallet?',
//         [
//             {
//                 text: 'CANCEL',
//                 onPress: () => {
//                     return
//                 },
//                 style: 'cancel'
//             },
//             {
//                 text: 'CHARGE',
//                 onPress: async () => {
//                     this.setState({ loading: true, token: null });
//                     var number = formData.values.number;
//                     var expMonth = parseInt(formData.values.expiry.split('/')[0]);
//                     var expYear = parseInt(formData.values.expiry.split('/')[1]);
//                     var cvc = formData.values.cvc;
//                     const tokenObject = await stripe.createTokenWithCard({
//                         number, expYear, expMonth, cvc
//                     });
//                     this.setState({ token: tokenObject.tokenId });
//                     var totalPrice = 100 * 0.05;
//                     axios({
//                         method: 'POST',
//                         url: 'http://localhost:5000/kwik-35758/us-central1/paymentWithStripe',
//                         data: {
//                             amount: Math.round(totalPrice),
//                             currency: 'usd',
//                             token: this.state.token
//                         },
//                     }).then(response => {
//                         alert("OKOKOKOKOKOKO")
//                     });

//                 }
//             }
//         ]
        //     const params = {
        //         number: formData.values.number,
        //         expMonth: parseInt(formData.values.expiry.split('/')[0]),
        //         expYear: parseInt(formData.values.expiry.split('/')[1]),
        //         cvc: formData.values.cvc
        //     };
        //     const token = await stripe.createTokenWithCard(params);
        //     axios({
        //         method: 'POST',
        //         url: 'http://localhost:5000/kwik-35758/us-central1/paymentWithStripe',
        //         data: {
        //             amount: Moth.round(100),
        //     currency: 'usd',
        //     token: token.tokenId
        // }
        //         }).then(response => {
        //     alert(response)
        //     this.setState({ loading: false });
        // }).catch(error => {
        //     alert(error)
        //     this.setState({ loading: false });
        // })
//     )
// }
// };
// handleFieldParamsChange = (valid, params) => {
//     this.setState({
//         valid,
//         params,
//     });
// }

// checkOut = async () => {
//     this.setState({ loading: true, token: null });
//     var number = this.state.params.number;
//     var expMonth = this.state.params.expMonth;
//     var expYear = this.state.params.expYear;
//     var cvc = this.state.params.cvc;
//     const tokenObject = await stripe.createTokenWithCard({
//         number, expYear, expMonth, cvc
//     });
//     this.setState({ token: tokenObject.tokenId });
//     var totalPrice = 100;
//     axios({
//         method: 'POST',
//         url: 'http://localhost:5000/kwik-35758/us-central1/paymentWithStripe',
//         data: {
//             amount: Math.round(totalPrice),
//             currency: 'usd',
//             token: this.state.token,
//         },
//     }).then(response => {
//         alert("OK11111--------");
//     });
// };