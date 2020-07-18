import React from 'react';
import { RideList } from '../components';
import { 
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableWithoutFeedback
  } from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import * as firebase from 'firebase';
import  languageJSON  from '../common/language';

export default class RideListPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allBookings: []
        }
    }

    componentDidMount() {
        let userUid = firebase.auth().currentUser.uid;
        let dbRef = firebase.database().ref('users/' + userUid + '/my_bookings');
        dbRef.on('value',(snap)=>{
            var allBookings = []
            let bookings = snap.val();
            for(let key in bookings) {
                bookings[key].bookingUid = key;
                allBookings.push(bookings[key]);
            }
            this.setState({
                allBookings: allBookings.reverse()
            })
        })
    }

    //go to ride details page
    goDetails(item, index){
        if(item && item.trip_cost >0){
            item.roundoffCost = Math.round(item.trip_cost).toFixed(2);
            item.roundoff = (Math.round(item.roundoffCost)-item.trip_cost).toFixed(2)
            this.props.navigation.push('RideDetails',{data:item});
        
        }else{
            item.roundoffCost = Math.round(item.estimate).toFixed(2);
            item.roundoff = (Math.round(item.roundoffCost)-item.estimate).toFixed(2)
            this.props.navigation.push('RideDetails',{data:item});
        }
        
    }


    render() {
        return (
            <View style={styles.mainView}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.my_booking}</Text>}
                    // rightComponent={{icon:'ios-notifications', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.navigate('Notifications');} }}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
                <RideList data={this.state.allBookings} onPressButton={(item, index) => {this.goDetails(item, index)}}></RideList>
            </View>
            );
        }
}

//Screen Styling
const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
    } 
});
