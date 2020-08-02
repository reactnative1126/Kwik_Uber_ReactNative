import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';

import images from '@constants/images';
import colors from '@constants/colors';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { navigation, title, isStatus, type } = this.props;
        return (
            <View style={[styles.container, { height: isStatus === "menu" ? 80 : 70 }]}>
                {
                    isStatus === "back" ?
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                            <TouchableOpacity
                                style={{ width: 20, height: 20 }}
                                onPress={() => navigation.goBack()}>
                                <Image
                                    style={{ width: 20, height: 20, tintColor: 'rgba(255, 255, 255, 1)' }}
                                    source={images.icon_back} />
                            </TouchableOpacity>
                        </View> :
                        isStatus === "menu" ?
                            <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                                <TouchableOpacity
                                    style={[styles.menuBTN, { marginLeft: 20 }]}
                                    onPress={() => navigation.toggleDrawer()}>
                                    <Image
                                        style={{ width: 40, height: 40 }}
                                        source={images.icon_menu} />
                                </TouchableOpacity>
                            </View> :
                            isStatus === "back-circle" ?
                                <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 2 }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: '#FFF949',
                                            borderRadius: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOpacity: 0.8,
                                            shadowOffset: { height: 1, width: 1 },
                                            shadowRadius: 2,
                                            elevation: 5,
                                        }}
                                        onPress={() => navigation.goBack()}>
                                        <Image
                                            style={{ width: 15, height: 15, tintColor: 'rgba(0, 0, 0, 1)' }}
                                            source={images.icon_back} />
                                    </TouchableOpacity>
                                </View> : null
                }
                <View style={{
                    flex: isStatus === "menu" ? 7 : isStatus === "login" ? 6 : title === 'kwik' || type === 'driver' ? 7 : 9,
                    justifyContent: 'flex-end', alignItems: title === 'My Profile' || title == "Booking" || title === 'Contact Us' || title === 'Update Password' || title === 'Rating' || type === 'driver' ? 'flex-start' : 'center', marginBottom: 2
                }}>
                    {
                        isStatus === "menu" || title === "kwik" ? <Image style={{ width: 80, height: 30 }} source={images.icon_title} /> :
                            title === 'My Profile' || title === 'Booking' || title === 'Contact Us' || title === 'Update Password' || title === 'Rating' || type === 'driver' ? <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: title == 'Rating' ? '#FFF' : '#000' }}>{title}</Text> :
                                null
                    }
                </View>
                {
                    isStatus === "login" ?
                        <View style={{ flex: 4, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Forgot')}>
                                <Text style={{ color: colors.WHITE_COLOR }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View> :
                        isStatus === "menu" ?
                            <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 2 }}>
                                <TouchableOpacity
                                    style={[styles.menuBTN, { backgroundColor: '#FFF' }]}
                                    onPress={() => navigation.toggleDrawer()}>
                                    <Image
                                        style={{ width: 40, height: 40 }}
                                        source={images.icon_bell} />
                                </TouchableOpacity>
                            </View> :
                            title === "kwik" ?
                                <View style={{ flex: 1.5 }} /> :
                                type === 'driver' ?
                                    <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.goBack()}>
                                            <Icon name='ellipsis-v' type='font-awesome' size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // backgroundColor: '#FFF',
        zIndex: 1000
    },
    title: {
        textAlign: 'center',
        opacity: 1.0,
        fontSize: 23,
        fontWeight: '100',
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

    }
});
