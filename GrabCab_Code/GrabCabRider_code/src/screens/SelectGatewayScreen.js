import React from 'react';
import { View, StyleSheet,TouchableHighlight, Image,TouchableWithoutFeedback, AsyncStorage, Text, } from 'react-native';
import { Header,} from 'react-native-elements';
import StripeView from '../components/PaymentMethods/StripeView';
import BraintreeView from '../components/PaymentMethods/BraintreeView';
import languageJSON from '../common/language';
import { colors } from '../common/theme';
import * as firebase from 'firebase';
export default class SelectGatewayPage extends React.Component {


    constructor(props){
      super(props);
      this.state = {
        payData:null,
        stripe:false,
        braintree:false,
        settings:{
          code:'',
          symbol:'',
          cash:false,
          wallet:false,
          braintree:false,
          stripe:false
        }
      };
    }


    componentDidMount(){
        let payData = this.props.navigation.getParam('payData');
        let uData = this.props.navigation.getParam('allData');
        let Settings = this.props.navigation.getParam('settings');
        if (payData && uData && Settings) {
          this.setState({ payData: payData, userdata: uData, settings:Settings }, () => {
            console.log(this.state);
          });
        }
    }

    onPressStripe = () => {
        this.setState({stripe:true});
    };

    onPressBraintree = () => {
        this.setState({braintree:true});
    };  

    onSuccessHandler = () => { 
      
        if (this.state.userdata.paymentType) {
            console.log(this.state.userdata)
            console.log('users/' + this.state.userdata.driver + '/my_bookings/' + this.state.userdata.bookingKey + '/')
            firebase.database().ref('users/' + this.state.userdata.driver + '/my_bookings/' + this.state.userdata.bookingKey + '/').update({
              payment_status: "PAID",
              payment_mode: this.state.userdata.paymentMode,
              customer_paid: this.state.userdata.customer_paid,
              discount_amount: this.state.userdata.discount_amount,
              usedWalletMoney: this.state.userdata.usedWalletAmmount,
              cardPaymentAmount: this.state.userdata.cardPaymentAmount,
              getway:this.state.stripe?'Stripe':'Braintree'
            }).then(() => {
              firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/my-booking/' + this.state.userdata.bookingKey + '/').update({
                payment_status: "PAID",
                payment_mode: this.state.userdata.paymentMode,
                customer_paid: this.state.userdata.customer_paid,
                discount_amount: this.state.userdata.discount_amount,
                usedWalletMoney: this.state.userdata.usedWalletAmmount,
                cardPaymentAmount: this.state.userdata.cardPaymentAmount,
                getway:this.state.stripe?'Stripe':'Braintree'
              }).then(() => {
                firebase.database().ref('bookings/' + this.state.userdata.bookingKey + '/').update({
                  payment_status: "PAID",
                  payment_mode: this.state.userdata.paymentMode,
                  customer_paid: this.state.userdata.customer_paid,
                  discount_amount: this.state.userdata.discount_amount,
                  usedWalletMoney: this.state.userdata.usedWalletAmmount,
                  cardPaymentAmount: this.state.userdata.cardPaymentAmount,
                  getway:this.state.stripe?'Stripe':'Braintree'
                }).then(() => {
                 
                  if (this.state.userdata.usedWalletAmmount) {
                    if (this.state.userdata.usedWalletAmmount > 0) {
                      let tDate = new Date();
                      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletHistory').push({
                        type: 'Debit',
                        amount: this.state.userdata.usedWalletAmmount,
                        date: tDate.toString(),
                        txRef: this.state.userdata.bookingKey,
                      }).then(() => {
                        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/').update({
                          walletBalance: this.state.userdata.currentwlbal - this.state.userdata.usedWalletAmmount
                        })
                      })
                    }
                  }
                })
                setTimeout(() => {
                  this.props.navigation.navigate('ratingPage', { data: this.state.userdata });
                }, 3000)
                
              })
      
            })
      
          } else {
            let tDate = new Date();
            let Walletballance = this.state.userdata.walletBalance + parseInt(this.state.payData.amount)
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletBalance').set(Walletballance).then(() => {
              firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/walletHistory').push({
                type: 'Credit',
                amount: parseInt(this.state.payData.amount),
                date: tDate.toString(),
                txRef: this.state.payData.order_id,
                getway:this.state.stripe?'Stripe':'Braintree'
              })
              
              setTimeout(() => {
              this.props.navigation.navigate('wallet')
              },3000)
            });
          }
    };

    onCanceledHandler = () => {
      if (this.state.userdata.paymentType) {
        setTimeout(()=>{
          this.props.navigation.navigate('CardDetails')
      },5000)
      }else{
        setTimeout(()=>{
          this.props.navigation.navigate('wallet')
      },5000)
      }  
    };
    goBack(){
      this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                  backgroundColor={colors.GREY.default}
                  leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.goBack() } }}
                  centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.payment}</Text>}
                  containerStyle={styles.headerStyle}
                  innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
                /> 
                 {this.state.stripe?<StripeView payData={this.state.payData} onSuccess={this.onSuccessHandler} onCancel={this.onCanceledHandler}/>:null}
                {this.state.braintree?<BraintreeView payData={this.state.payData} onSuccess={this.onSuccessHandler} onCancel={this.onCanceledHandler}/> :null}
                {this.state.stripe || this.state.braintree?null:
                  <View>
                      {this.state.settings.stripe?
                      <View style = {[styles.box,{marginTop:12}]}>
                          <TouchableHighlight onPress={this.onPressStripe} underlayColor='#99d9f4'>
                              <Image
                                  style={styles.thumb}
                                  source={require('../../assets/images/stripe-logo.png')}
                              />   
                          </TouchableHighlight>
                      </View>
                      :null}
                      {this.state.settings.braintree?
                      <View style = {styles.box}>
                          <TouchableHighlight onPress={this.onPressBraintree} underlayColor='#99d9f4'>
                              <Image
                                  style={styles.thumb}
                                  source={require('../../assets/images/braintree-logo.png')}
                              />   
                          </TouchableHighlight>
                      </View>  
                      :null}
                  </View>
                }           
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.WHITE,
      flex:1
    },
    headerStyle: {
      backgroundColor: colors.GREY.default,
      borderBottomWidth: 0
    },
    headerTitleStyle: {
      color: colors.WHITE,
      fontFamily: 'Roboto-Bold',
      fontSize: 20
    },
    box: {
        height:80,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ededed',
        borderRadius:8,
        marginBottom:4,
        marginHorizontal:20,
        marginTop:8
    },

    thumb:{
        height:35,
        resizeMode: 'contain'
       
    }
});