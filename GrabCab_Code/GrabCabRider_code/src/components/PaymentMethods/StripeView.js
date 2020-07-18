import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import {cloud_function_server_url} from '../../common/serverUrl'

export default class StripeView extends Component {

  CHECKOUT_URL = cloud_function_server_url;

  state = { sessionID: null,error: null};

  constructor(props){
    super(props);
  }

  async componentDidMount(){
    let { payData } = this.props;
    this.getSessionID(payData);
  }

  getSessionID = async (payData) => {

    let info = {session_data:{
      customer_email:payData.email,
      success_url:this.CHECKOUT_URL + 'success_stripe?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: this.CHECKOUT_URL + 'cancel_stripe',
      payment_method_types: ['card'],
      line_items: [
        {
          name: payData.name,
          description: payData.description,
          amount: payData.amount*100,
          currency: payData.currency,
          quantity: payData.quantity
        },
      ],
      metadata: {
        "order_id": payData.order_id,
      }
    }};

    fetch(this.CHECKOUT_URL + 'create_stripe_session', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.error){
        this.setState({error:responseJson.error.raw.message});
      }else{
        this.setState({sessionID:responseJson.id});
      }
    })
    .catch((error) => {
      console.error(error);
    });   
  }

  onLoadStart = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    let matchUrl = nativeEvent.url.split('?')[0];
    if (matchUrl === this.CHECKOUT_URL + 'success_stripe') {
      this.props.onSuccess();
    }
    if (matchUrl === this.CHECKOUT_URL + 'cancel_stripe') {
      this.props.onCancel();
    }
  };

  render() {
    var checkout_url = this.CHECKOUT_URL + 'create_stripe_link?session_id=' + this.state.sessionID;
    console.log(checkout_url);
    if(this.state.error){
      return(
        <View style={[styles.container, styles.horizontal]}>
          <Text>{this.state.error}</Text>
        </View>       
      )
    }
    if (!this.state.sessionID) {
      return  (    
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <WebView
        cacheEnabled={false}
        originWhitelist={['*']}
        source={{uri: checkout_url}} 
        onLoadStart={this.onLoadStart}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});