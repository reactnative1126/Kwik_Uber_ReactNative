import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header } from '@components';

export default class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { rating } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <ImageBackground
                    source={require("@assets/images/background.png")}
                    resizeMode="stretch"
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header title="Rating" isStatus="back" navigation={this.props.navigation} />
                        <KeyboardAwareScrollView>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20 }}>
                            <View style={{
                                width: '100%', marginTop: 20, backgroundColor: '#FFF', borderRadius: 10,
                                shadowColor: '#00F561',
                                shadowOpacity: 0.8,
                                shadowOffset: { height: 1, width: 1 },
                                shadowRadius: 2,
                                elevation: 10,
                            }}>
                                <View style={{ alignItems: 'center', marginTop: 30 }}>
                                    <Image
                                        source={require('@assets/images/profilePic.png')}
                                        style={{ width: 80, height: 80, borderRadius: 30 }}
                                    />
                                    <View style={styles.rating}>
                                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>4.9</Text>
                                    </View>
                                    <Text style={{ marginTop: -20, fontSize: 20, fontWeight: 'bold' }}>George Fdwards</Text>
                                    <Text style={{ fontSize: 17, color: '#888' }}>XYZ-182</Text>
                                    <Text style={{ marginTop: 10, fontSize: 25, color: '#00963D', fontWeight: 'bold' }}>How was your trip?</Text>
                                    <Text style={{ marginTop: 10, fontSize: 15, color: '#888', textAlign: 'center' }}>Your feedback will help improve driving experience</Text>

                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        {rating >= 1 ?
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: rating == 1 ? 0 : 1 })}>
                                                <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: rating == 1 ? 0 : 1 })}>
                                                <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                            </TouchableOpacity>
                                        }
                                        {rating >= 2 ?
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 2 })}>
                                                <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 2 })}>
                                                <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                            </TouchableOpacity>
                                        }
                                        {rating >= 3 ?
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 3 })}>
                                                <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 3 })}>
                                                <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                            </TouchableOpacity>
                                        }
                                        {rating >= 4 ?
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 4 })}>
                                                <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.setState({ rating: 4 })}>
                                                <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                            </TouchableOpacity>
                                        }
                                        {rating >= 5 ?
                                            <TouchableOpacity onPress={() => this.setState({ rating: 5 })}>
                                                <Icon name='star' type='font-awesome' color='#FFCC01' size={40} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity onPress={() => this.setState({ rating: 5 })}>
                                                <Icon name='star' type='font-awesome' color='#D8D8D8' size={40} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10 }}>
                                    <View style={{ width: '100%', height: 100, borderWidth: 1, borderColor: '#888', backgroundColor: '#EFEFF2', borderRadius: 5, padding: 10 }} >
                                        <TextInput
                                            multiline
                                            numberOfLines={5}
                                            editable={true}
                                            maxLength={1200}
                                            placeholder={"Additional Comments..."}
                                            placeholderTextColor={'rgba(200, 200, 200, 0.8)'}
                                            secureTextEntry={true}
                                            blurOnSubmit={false}
                                            value={this.state.comment}
                                            onChangeText={(text) => { this.setState({ comment: text }) }}
                                            textAlignVertical={'top'}
                                            // inputContainerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                            // inputStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                            // containerStyle={{width: '100%', height: 80, verticalAlign: 'top'}}
                                        />
                                    </View>
                                </View>
                                <View style={{ width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10, marginBottom: 20 }}>
                                    <TouchableOpacity style={styles.rideBtn}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    rideBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
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
