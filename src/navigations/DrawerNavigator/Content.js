import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Text,
    TouchableRipple,
    Switch,
    Drawer
} from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements'

import { useSelector } from 'react-redux';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

export function DrawerContent(props) {
    const user_info = useSelector(state => state.account.user_info);
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView>
                <TouchableOpacity style={styles.drawerContent} onPress={() => {
                    props.navigation.navigate('Profile');
                }}>
                    <View style={styles.userInfoSection}>
                        <Avatar.Image
                            source={user_info.profile_pic == null ? images.img_avatar : { uri: configs.baseURL + '/uploads/' + user_info.profile_pic }}
                            size={100}
                        />
                        <Title style={styles.title}>{user_info.user_name}</Title>
                        <Caption style={styles.caption}>{user_info.email}</Caption>
                    </View>
                </TouchableOpacity>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='ios-home' type='ionicon' color={color} size={size} />
                        )}
                        label="HOME"
                        onPress={() => {
                            props.navigation.reset({ routes: [{ name: 'App'}] });
                        }}
                    />
                </Drawer.Section>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='road-variant' type='material-community' color={color} size={size} />
                        )}
                        label="BOOK YOUR RIDE"
                        onPress={() => {
                            props.navigation.navigate('Booking', { tab: 1 });
                        }}
                    />
                </Drawer.Section>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='history' type='octicons' color={color} size={size} />
                        )}
                        label="RIDE HISTORY"
                        onPress={() => {
                            props.navigation.navigate('Booking', { tab: 2 });
                        }}
                    />
                </Drawer.Section>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='payment' type='material' color={color} size={size} />
                        )}
                        label="PAYMENT"
                        onPress={() => {
                            props.navigation.navigate('Payment');
                        }}
                    />
                </Drawer.Section>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='support' type='font-awesome' color={color} size={size} />
                        )}
                        label="SUPPORT AND FAQ"
                        onPress={() => {
                            props.navigation.navigate('Contact');
                        }}
                    />
                </Drawer.Section>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={(color, size) => (
                            <Icon name='help-circle' type='feather' color={color} size={size} />
                        )}
                        label="ABOUT US"
                        onPress={() => {
                            props.navigation.navigate('About');
                        }}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection} >
                <DrawerItem
                    icon={(color, size) => (
                        <Icon name='exit-to-app' type='material-community' color={color} size={size} />
                    )}
                    label="Sign Out"
                    onPress={() => {
                        props.navigation.navigate('Logout');
                    }}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        marginBottom: 20
    },
    userInfoSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14
    },
    bottomDrawerSection: {
        height: 50,
        borderTopColor: colors.GREY.primary,
        borderTopWidth: 1
    }
})