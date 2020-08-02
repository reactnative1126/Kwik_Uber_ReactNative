import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native';

import { connect } from 'react-redux';
import { colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

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
                <View style={{ flex: 9, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#000' }}>My Profile</Text>
                </View>
            </View>
        );
    }

    render() {
        const { user_info } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} translucent backgroundColor="transparent" />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <View style={{ paddingBottom: 20, width: '100%', alignItems: 'center' }}>
                        <Image
                            source={user_info.profile_pic == null ? images.img_avatar : { uri: configs.baseURL + '/uploads/' + user_info.profile_pic }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                        <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>{user_info.user_name}</Text>
                        <Text style={{ fontSize: 17, color: '#888' }}>{user_info.email}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 20, width: '100%', alignItems: 'center', backgroundColor: '#D8D8D8' }}>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='user-o' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '40%' }}>Full Name</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>{user_info.user_name}</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='envelope-o' type='font-awesome' color='#888' size={18} />
                            <Text style={{ width: '40%' }}>Email Address</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>{user_info.email}</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D8D8D8',
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <Icon name='mobile' type='font-awesome' color='#888' size={25} />
                            <Text style={{ width: '40%' }}>Mobile Number</Text>
                            <Text style={{ width: '40%', color: '#888', textAlign: 'right' }}>{user_info.mobno}</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderwidth: 1,
                            paddingLeft: 20, paddingRight: 20
                        }} onPress={() => this.props.navigation.push('Password')}>
                            <Icon name='lock' type='font-awesome' color='#888' size={20} />
                            <Text style={{ width: '85%', marginLeft: -5 }}>Update Password</Text>
                            <Icon name='caret-right' type='font-awesome' color='#019E4C' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', height: 50,
                            backgroundColor: '#FFF',
                            borderwidth: 1,
                            marginTop: 20,
                            paddingLeft: 20, paddingRight: 20
                        }}>
                            <View style={{ flexDirection: 'row', marginLeft: -5 }}>
                                <Icon name='bell-o' type='font-awesome' color='#888' size={20} />
                                <Text style={{ marginLeft: 5 }}>Notification</Text>
                            </View>
                            <ToggleSwitch
                                isOn={this.state.notification}
                                onColor={'#01A457'}
                                offColor={'#F1362F'}
                                size="small"
                                onToggle={isOn => this.setState({ notification: isOn })}
                            />
                        </TouchableOpacity>
                    </View>
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
        // shadowColor: '#00F561',
        // shadowOpacity: 0.8,
        // shadowOffset: { height: 1, width: 1 },
        // shadowRadius: 2,
        // elevation: 10,
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
        // borderColor: '#D8D8D8',
        borderBottomWidth: 2,
        borderBottomColor: '#03B273'
    },
    itemPanel: {
        justifyContent: 'space-between',
        width: '100%',
        height: 180,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginTop: 10,
        padding: 30,
        shadowColor: '#00F561',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
    rating: {
        top: -30,
        left: 25,
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: '#00963D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00F561',
        shadowOpacity: 0.8,
        shadowOffset: { height: 1, width: 1 },
        shadowRadius: 2,
        elevation: 10,
    },
});

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info
    }
}
export default connect(mapStateToProps, undefined)(Profile)