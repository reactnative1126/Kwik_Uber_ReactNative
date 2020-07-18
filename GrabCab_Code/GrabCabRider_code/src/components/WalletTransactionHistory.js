import React from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
const devWidth = Dimensions.get("window").width;
import * as firebase from 'firebase';
import  languageJSON  from '../common/language';

export default class WTransactionHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [] , 
            settings:{
              code:'',
              symbol:'',
              cash:false,
              wallet:false,
              braintree:false,
              stripe:false
            }
            }
          };
    

    _retrieveSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('settings');
          console.log(value);
          if (value !== null) {
            this.setState({settings:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue 31");
        }
    };

    componentDidMount(){
        var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const root=firebase.database().ref('users/'+firebase.auth().currentUser.uid + '/walletHistory');
        root.on('value',walletData=>{
            if(walletData.val()){
               let wdata = walletData.val()
               var wallHis = []
               for(key in wdata){
                   wdata[key].walletKey = key
                   let d = wdata[key].date
                   let tDate = new Date(d);
                   let mn = tDate.getMonth();
                  
                   wdata[key].date = mS[mn] +' '+ tDate.getDate()+', '+tDate.getFullYear()
                   wallHis.push(wdata[key])
               }
               if(wallHis){
                this.setState({data:wallHis.reverse()},(res)=>{
                    
                });  
               }
                       
            }
        })
        this._retrieveSettings();
    }

    onPressButton() {
        alert("hello");
    }

    newData = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.divCompView}>
                    <View style={styles.containsView}>
                        <View style={styles.statusStyle}>
                            {item.type == 'Debit' ?
                                <View style={styles.drimageHolder}>
                                    <Icon
                                        iconStyle={styles.debiticonPositionStyle}
                                        name='keyboard-backspace'
                                        type='MaterialIcons'
                                        size={25}
                                        color='#fff'
                                    />

                                </View> :
                                <View style={styles.crimageHolder}>
                                    <Icon
                                        iconStyle={styles.crediticonPositionStyle}
                                        name='keyboard-backspace'
                                        type='MaterialIcons'
                                        size={25}
                                        color='#fff'
                                    />
                                </View>
                            }
                            <View style={styles.statusView}>
                            {item.type?item.type == 'Credit'?<Text style={styles.historyamounttextStyle}>{item.type + 'ed '+ this.state.settings.symbol + parseFloat(item.amount).toFixed(2) + ' '+ languageJSON.successfully}</Text>:
                                <Text style={styles.historyamounttextStyle}>{item.type + 'ed '+ this.state.settings.symbol + parseFloat(item.amount).toFixed(2)+ ' '+ languageJSON.form_wallet}</Text>
                            :null}
                                   
                            <Text style={styles.textStyle}>{languageJSON.Transaction_Id} {item.txRef}</Text>
                            <Text style={styles.textStyle2}>{item.date}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.data}
                    renderItem={this.newData}
                />
            </View>
        );
    }
};
const styles = StyleSheet.create({
    myHeader: {
        marginTop: 0,
    },
    container: {
        flex: 1,
    },
    divCompView: {
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        flex: 1,
        borderRadius: 6,
    },
    drimageHolder: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B41B00',
        padding: 3
    },
    crimageHolder: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#018E16',
        padding: 3
    },
    containsView: {
        justifyContent: 'center',
    },

    statusStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems : 'center'
    },
    statusView: {
        marginLeft: 10

    },
    textStyle: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        fontWeight:'500',
        color:'#979696'
    },
    historyamounttextStyle: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        fontWeight:'500'
    },
    textStyle2:{
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color:'#979696'
    },
    textColor: {
        color: colors.GREY.iconPrimary,
        alignSelf: 'center',
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        paddingLeft: 5
    },
    textFormat: {
        flex: 1,
        width: devWidth - 100
    },
    cabLogoStyle: {
        width: 25,
        height: 28,
        flex: 1
    },
    clockIconStyle: {
        flexDirection: 'row',
        marginTop: 8
    },
    debiticonPositionStyle: {
        alignSelf: 'flex-start',
    },
    crediticonPositionStyle: {
        alignSelf: 'flex-start',
    }
});