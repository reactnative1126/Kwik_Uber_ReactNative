import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import {cloud_function_server_url} from '../../common/serverUrl'

export default class BraintreeView extends Component {

    CHECKOUT_URL = cloud_function_server_url;

    state={
        token:null,
        payData:null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.setState({payData:this.props.payData});
        this.getToken();
    }

    getToken = async () => {
        fetch(this.CHECKOUT_URL + 'get_braintree_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({token:responseJson.token});
        })
        .catch((error) => {
            console.error(error);
        });
    }

    onMessage= (event) => {
        if(event.nativeEvent.data == "Error"){
            this.webView.postMessage("payment_failed");
        }else{
            let nonce = event.nativeEvent.data;
            fetch(this.CHECKOUT_URL + 'process_braintree_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount:this.state.payData.amount,
                    nonce:nonce
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.success){
                        this.webView.postMessage("payment_success");
                        this.props.onSuccess();
                    }
                    else{
                        this.webView.postMessage("payment_failed");
                        this.props.onCancel();
                    }
                })
                .catch((error) => {
                    this.webView.postMessage("payment_failed");
                    this.props.onCancel();
                    console.error(error);
                });
        } 
    };

    render() {
        if(this.state.token){
            var checkout_url = this.CHECKOUT_URL + 'create_braintree_link?token=' + this.state.token + '&order_id=' + this.state.payData.order_id + '&amount=' + this.state.payData.amount+ '&currency=' + this.state.payData.currency;
            return (
                <WebView
                    cacheEnabled={false}
                    ref={webView => (this.webView = webView)}
                    source={{uri: checkout_url}}  
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    onMessage={this.onMessage}
                />
            );
        }
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )

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