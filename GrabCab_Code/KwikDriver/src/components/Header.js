import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import images from '@constants/images';
import colors from '@constants/colors';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { navigation, title, isStatus } = this.props;
        return (
            <View style={styles.container}>
            {
                isStatus === "back" ?
                    <View style={{ flex: 3, justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 2 }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}>
                            <Image
                                style={{ marginLeft: 20, width: 20, height: 20, tintColor: 'rgba(255, 255, 255, 1)' }}
                                source={images.icon_back} />
                        </TouchableOpacity>
                    </View>
                    : <View style={{ flex: 1 }} />
            }
                <View style={{ flex: 3 }}>
                    {/* <Text style={styles.title}>{title}</Text> */}
                </View>
                {
                    isStatus === "forgot" ?
                        <View style={{ flex: 3, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Forgot')}>
                                <Text style={{ color: colors.WHITE_COLOR }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        : <View style={{ flex: 1 }} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 50,
        // borderBottomWidth: 2,
        // borderBottomColor: 'rgba(255, 255, 255, 0.5)',
        // borderRadius: 3
    },
    title: {
        marginTop: 25,
        textAlign: 'center',
        opacity: 1.0,
        fontSize: 23,
        fontWeight: '100',
    },
    back_button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        width: 30,
        height: 30,
        borderRadius: 15,
        shadowColor: colors.BLACK_COLOR,
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 1,
        elevation: 1,
    }
});
