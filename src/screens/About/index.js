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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements'

import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 1
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
                <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 80, height: 30 }} source={images.icon_title} />
                </View>
                <View style={{ flex: 1 }} />
            </View>
        );
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
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            padding: 20
                        }}>
                            <Image style={{ width: 100, height: 100 }} source={images.icon_app} />
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
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='star-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '80%', fontWeight: 'bold' }}>Rate on the Play Store</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='paper-plane-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '80%', fontWeight: 'bold' }}>Invite your friend to join</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            marginTop: 10,
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.8,
                            shadowOffset: { height: 1, width: 1 },
                            shadowRadius: 2,
                            elevation: 5,
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='bug' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '80%', fontWeight: 'bold' }}>Report a bug</Text>
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
                <StatusBar hidden={false} translucent backgroundColor="transparent" />
                <SafeAreaView hidden={false} style={{ flex: 1 }}>
                    {this.renderHeader()}
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
