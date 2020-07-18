import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';

export default class RideList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

    _retrieveSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('settings');
          if (value !== null) {
            this.setState({settings:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue 2");
        }
      };

    componentDidMount(){
        this._retrieveSettings();
    }
    

    onPressButton(item, index) {
        const { onPressButton } = this.props;
        onPressButton(item, index)
    }

    //flatlist return function
    newData = ({ item, index }) => {
        const { onPressButton } = this.props;
        return (
            <TouchableOpacity style={styles.iconClickStyle} onPress={() => this.onPressButton(item, index)}>
                <View style={styles.iconViewStyle}>
                    <Icon
                        name='car-sports'
                        type='material-community'
                        color={colors.DARK}
                        size={35}
                    />
                </View>
                <View style={styles.flexViewStyle}>
                    <View style={styles.textView1}>

                        <Text style={[styles.textStyle, styles.dateStyle]}>{item.bookingDate ? item.bookingDate : ''}</Text>
                        <Text style={[styles.textStyle, styles.carNoStyle]}>{item.carType ? item.carType : null} - {item.vehicle_number ? item.vehicle_number : languageJSON.no_car_assign_text}</Text>
                        <View style={[styles.picupStyle, styles.position]}>

                            <View style={styles.greenDot} />
                            <Text style={[styles.picPlaceStyle, styles.placeStyle]}>{item.pickup ? item.pickup.add : languageJSON.not_found_text}</Text>
                        </View>
                        <View style={[styles.dropStyle, styles.textViewStyle]}>
                            <View style={[styles.redDot, styles.textPosition]} />
                            <Text style={[styles.dropPlaceStyle, styles.placeStyle]}>{item.drop ? item.drop.add : languageJSON.not_found_text}</Text>
                        </View>

                    </View>
                    <View style={styles.textView2}>
                        <Text style={[styles.fareStyle, styles.dateStyle]}>{item.status == 'NEW' ? item.status : null}</Text>
                        <Text style={[styles.fareStyle, styles.dateStyle]}>{item.status == 'END' && item.payment_status == 'PAID' ? item.customer_paid ? this.state.settings.symbol + parseFloat(item.customer_paid).toFixed(2) : this.state.settings.symbol + parseFloat(item.estimate).toFixed(2) : null}</Text>
                        {
                            item.status == 'CANCELLED' ?
                                <Image
                                    style={styles.cancelImageStyle}
                                    source={require('../../assets/images/cancel.png')}
                                />
                                :
                                null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { data } = this.props

        return (
            <View style={styles.textView3}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    renderItem={this.newData}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 18,
    },
    fareStyle: {
        fontSize: 18,
    },
    carNoStyle: {
        marginLeft: 45,
        fontSize: 13,
        marginTop: 10
    },
    picupStyle: {
        flexDirection: 'row',
    },
    picPlaceStyle: {
        color: colors.GREY.secondary
    },
    dropStyle: {
        flexDirection: 'row',
    },
    drpIconStyle: {
        color: colors.RED,
        fontSize: 20
    },
    dropPlaceStyle: {
        color: colors.GREY.secondary
    },
    greenDot: {
        alignSelf: 'center',
        borderRadius: 10,
        width: 10,
        height: 10,
        backgroundColor: colors.GREEN.default
    },
    redDot: {
        borderRadius: 10,
        width: 10,
        height: 10,
        backgroundColor: colors.RED

    },
    logoStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconClickStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    flexViewStyle: {
        flex: 7,
        flexDirection: 'row',
        borderBottomColor: colors.GREY.secondary,
        borderBottomWidth: 1,
        marginTop: 10,
        marginLeft: 5
    },
    dateStyle: {
        fontFamily: 'Roboto-Bold',
        color: colors.GREY.default
    },
    carNoStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        marginTop: 8,
        color: colors.GREY.default
    },
    placeStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        alignSelf: 'center'
    },
    textViewStyle: {
        marginTop: 10,
        marginBottom: 10
    },
    cancelImageStyle: {
        width: 50,
        height: 50,
        marginRight: 20,
        marginTop: 18,
        alignSelf:'flex-end'
        
    },
    iconViewStyle: {
        flex: 1, marginTop: 10
    },
    textView1: {
        flex: 5
    },
    textView2: {
        flex: 2
    },
    textView3: {
        flex: 1
    },
    position: {
        marginTop: 20
    },
    textPosition: {
        alignSelf: 'center'
    }
});