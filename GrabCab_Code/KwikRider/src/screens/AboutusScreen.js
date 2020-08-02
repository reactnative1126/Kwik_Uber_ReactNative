import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { Icon } from 'react-native-elements'

import { Header } from '@components';

export default class AboutusScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.navigation.getParam('tab'),
        }
    }
    renderAboutUs() {
        return (
            <View style={{ backgroundColor: '#D5D5D5', flex: 1 }}>
                <ScrollView>
                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, alignItems: 'center', marginBottom: 50 }}>
                        <View style={{
                            justifyContent: 'center', alignItems: 'center',
                            marginTop: 20,
                            width: '100%', height: 300,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 20
                        }}>
                            <Image style={{ width: 100, height: 100 }} source={require('@assets/images/appIcon.png')} />
                            <Text style={{ fontSize: 10 }}>TAXI SERVICE APP</Text>
                            <Text style={{ marginTop: 10, fontSize: 14, fontWeight: 'bold' }}>Version 2.0</Text>
                            <Text style={{ marginTop: 10, fontSize: 15, color: '#888', textAlign: 'center' }}>Ut enim  ad minima veniam, quis nostrud exercitation ullam laborios nisi ut aliquid ex ea commodi consequat.</Text>
                        </View>
                        <TouchableOpacity style={{
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
                            padding: 20
                        }} onPress={() => this.props.navigation.navigate('Rating')}>
                            <Icon name='star-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{width: '80%', fontWeight: 'bold'}}>Rate on the Play Store</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 20
                        }}>
                            <Icon name='paper-plane-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{width: '80%', fontWeight: 'bold'}}>Invite your friend to join</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#00F561',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 20
                        }}>
                            <Icon name='bug' type='font-awesome' color='#888' size={20} />
                            <Text style={{width: '80%', fontWeight: 'bold'}}>Report a bug</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
    renderPolicy() {
        return (
            <View style={{ backgroundColor: '#D5D5D5', flex: 1 }}>
                <ScrollView>
                    <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ marginTop: 20, fontSize: 17, fontWeight: 'bold' }}>1.Lorem ipsum dolor sit amet, consectetur adipiscing</Text>
                        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 17 }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cosequat.</Text>
                        <Text style={{ marginTop: 20, fontSize: 17, fontWeight: 'bold' }}>2.Sed ut perspiciatis unde omnis?</Text>
                        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 17 }}>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis prasentium voluptatum deleniti atque corrupti quos dolores</Text>
                        <Text style={{ marginTop: 20, fontSize: 17, fontWeight: 'bold' }}>3. Exceptiro somt pccaecato cipodotate mpm prpodemt simt?</Text>
                        <Text style={{ marginTop: 20, fontSize: 17 }}>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis prasentium voluptatum deleniti atque corrupti quos dolores</Text>

                    </View>
                </ScrollView>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Header title="kwik" isStatus="back-circle" navigation={this.props.navigation} />
                    <View style={styles.topTab}>
                        <TouchableOpacity style={this.state.tab == 1 ? styles.selTab : styles.tab} onPress={() => this.setState({ tab: 1 })}>
                            <Text style={this.state.tab == 1 ? { color: '#03B273' } : { color: '#000' }}>About Us</Text>
                        </TouchableOpacity>
                        <View style={{ width: 1, height: 40, borderColor: '#D8D8D8', borderLeftWidth: 1 }} />
                        <TouchableOpacity style={this.state.tab == 2 ? styles.selTab : styles.tab} onPress={() => this.setState({ tab: 2 })}>
                            <Text style={this.state.tab == 2 ? { color: '#03B273' } : { color: '#000' }}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.tab == 1 ? this.renderAboutUs() : this.renderPolicy()
                    }
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topTab: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 60,
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#D8D8D8',
    },
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 60
    },
    selTab: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 60,
        borderBottomWidth: 2,
        borderBottomColor: '#03B273'
    },
});
