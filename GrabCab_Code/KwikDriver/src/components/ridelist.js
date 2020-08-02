import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';
export default class RideList extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            currency:{
                code:'',
                symbol:''
            }
        };
        this._retrieveCurrency();
    }

    _retrieveCurrency = async () => {
        try {
          const value = await AsyncStorage.getItem('currency');
          if (value !== null) {
            this.setState({currency:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue");
        }
    };

    //on press of each item function
    onPressButton(item, index) {
        const { onPressButton } = this.props;
        onPressButton(item, index)
    }


    //flatlist return function
    newData = ({ item, index }) => {
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

                        <Text style={[styles.textStyle, styles.dateStyle]}>{new Date(item.tripdate).toLocaleString()}</Text>
                        <View style={[styles.picupStyle, styles.position]}>
                            <View style={styles.greenDot} />
                            <Text style={[styles.picPlaceStyle, styles.placeStyle]}>{item.pickup.add ? item.pickup.add : ""}</Text>
                        </View>
                        <View style={[styles.dropStyle, styles.textViewStyle]}>
                            <View style={[styles.redDot, styles.textPosition]} />
                            <Text style={[styles.dropPlaceStyle, styles.placeStyle]}>{item.drop.add ? item.drop.add : ""}</Text>
                        </View>

                    </View>
                    <View style={styles.textView2}>
                        <Text style={[styles.fareStyle, styles.dateStyle]}>{item.status == 'END' && item.payment_status == 'PAID' ? item.trip_cost > 0 ? this.state.currency.symbol + parseFloat(item.trip_cost).toFixed(2) : this.state.currency.symbol + parseFloat(item.estimate).toFixed(2) : null}</Text>
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
        const { data } = this.props;
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

//style for this component
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
        fontSize: 12,
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
        marginTop: 10,
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