import React from 'react';
import { StyleSheet,
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Platform,
    Image,
    Modal,
    Dimensions,
    AsyncStorage
} from 'react-native';
import {Divider,Button, Header} from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { colors } from '../common/theme';
var { width} = Dimensions.get('window');
import * as firebase from 'firebase';
import { RequestPushMsg } from '../common/RequestPushMsg';
import  languageJSON  from '../common/language';

export default class DriverTripComplete extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            starCount: 0,
            title: '', 
            alertModalVisible:false,
            settings:{
                code:'',
                symbol:'',
                cash:false,
                wallet:false,
                braintree:false,
                stripe:false
            }
        }
    }

    _retrieveSettings = async () => {
        try {
          const value = await AsyncStorage.getItem('settings');
          if (value !== null) {
            this.setState({settings:JSON.parse(value)});
          }
        } catch (error) {
            console.log("Asyncstorage issue 7");
        }
    };

    componentDidMount() {
        var pdata = this.props.navigation.getParam('data');
        if(pdata){

         address=[{
             key:'pickup',
             place:pdata.pickup.add,
             type:'pickup'
         },{
            key:'drop',
            place:pdata.drop.add,
            type:'drop'
         }]
         this.setState({
             getDetails:pdata,
             pickAndDrop:address
         },()=>{
             console.log(this.state.getDetails)
             console.log(this.state.pickAndDrop)
         })
        }
        this._retrieveSettings();
    }


    //rating
    onStarRatingPress(rating) {
        this.setState({
          starCount: rating
        })
    }
      
    skipRating(){
        firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/my-booking/'+this.state.getDetails.bookingKey +'/').update({
            skip:true,
            rating_queue:false
        }).then(()=>{
            this.props.navigation.navigate('Map');
        });
    }


    submitNow(){
        if(this.state.starCount>0){
            firebase.database().ref('users/'+this.state.getDetails.driver+'/ratings/details').push({
                user:firebase.auth().currentUser.uid,
                rate:this.state.starCount
            }).then((res)=>{
                let path = firebase.database().ref('users/'+this.state.getDetails.driver+'/ratings/');
                    path.once('value',snapVal=>{
                      if(snapVal.val()){
                          // rating calculation
                          let ratings = snapVal.val().details;
                          var total = 0;
                          var count = 0;
                          for(let key in ratings){
                              count = count+1;
                              total = total + ratings[key].rate;
                          }
                         let fRating = total/count;
                         if(fRating){
                             //avarage Rating submission
                             firebase.database().ref('users/'+this.state.getDetails.driver+'/ratings/').update({userrating:parseFloat(fRating).toFixed(1)}).then(()=>{
                                this.setState({alertModalVisible:true}); 
                                //Rating for perticular booking 
                                firebase.database().ref('users/'+this.state.getDetails.driver+'/my_bookings/'+this.state.getDetails.bookingKey +'/').update({
                                    rating:this.state.starCount,
                                }).then(()=>{
                                    firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/my-booking/'+this.state.getDetails.bookingKey +'/').update({
                                        skip:true,
                                        rating_queue:false
                                    })
                                    this.sendPushNotification(this.state.getDetails.driver,this.state.getDetails.bookingKey,'you got '+this.state.starCount+' start rating ')
                                });
                             })
                         }
                      }
                    }) 
            }) 
        }else{}
        
    }

    sendPushNotification(customerUID,bookingId,msg){
        const customerRoot=firebase.database().ref('users/'+customerUID);
        customerRoot.once('value',customerData=>{
            if(customerData.val()){
                let allData = customerData.val()
                RequestPushMsg(allData.pushToken?allData.pushToken:null,msg)
            }
        })
    }

    alertModal() {
        return(
          <Modal
              animationType="none"
              transparent={true}
              visible={this.state.alertModalVisible}
              onRequestClose={() => {
              this.setState({alertModalVisible:false})
          }}>
          <View style={styles.alertModalContainer}>
            <View style={styles.alertModalInnerContainer}>
  
              <View style={styles.alertContainer}>
              
                  <Text style={styles.rideCancelText}>{languageJSON.no_driver_found_alert_title}</Text>
  
                  <View style={styles.horizontalLLine}/>
                  
                  <View style={styles.msgContainer}>
                      <Text style={styles.cancelMsgText}>{languageJSON.thanks}</Text>
                  </View>
                  <View style={styles.okButtonContainer}>
                      <Button
                          title={languageJSON.no_driver_found_alert_OK_button}
                          titleStyle={styles.signInTextStyle}
                          onPress={()=>{this.setState({alertModalVisible: false,currentBookingId:null},()=>{this.props.navigation.navigate('Map')})}}
                          buttonStyle={styles.okButtonStyle}
                          containerStyle={styles.okButtonContainerStyle}
                      />
                  </View>
  
              </View>
              
            </View>
          </View>
  
        </Modal>
        )
    }

    render(){
        return(
            <View style={styles.mainViewStyle}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.receipt}</Text>}
                    rightComponent={<Text style={styles.headerskip} onPress={()=>{this.skipRating()}}>{languageJSON.skip}</Text>} 
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={styles.headerInnerStyle}
                />
                <View style={styles.dateViewStyle}>
                        <Text style={styles.dateViewTextStyle}>{this.state.getDetails?this.state.getDetails.tripdate.split(" ")[2] + " "+ this.state.getDetails.tripdate.split(" ")[1]+" "+ this.state.getDetails.tripdate.split(" ")[3]+ ","+" "+ this.state.getDetails.trip_start_time:null}</Text>
                </View>

                <View style={styles.rateViewStyle}>
        <Text style={styles.rateViewTextStyle}>{this.state.settings.symbol}{this.state.getDetails?this.state.getDetails.customer_paid>0?parseFloat(this.state.getDetails.customer_paid).toFixed(2):0:null}</Text>
                </View>

                <View style={styles.addressViewStyle}>
                    <FlatList
                        data={this.state.pickAndDrop}
                        renderItem={({item}) => 
                            <View style={styles.pickUpStyle}>
                            {item.type == "pickup" ? 
                                <View style={styles.greenDot}></View>
                                :<View style={styles.redDot}></View>
                            }
                                <Text style={styles.addressViewTextStyle}>{item.place}</Text>
                            </View>
                        }
                    />
                </View>

                <View style={styles.tripMainView}>
                    <View style={{ flex:3.2, justifyContent:'center', alignItems:"center"}}>  
                        <View style={styles.tripSummaryStyle}>
                            <Divider style={[styles.divider, styles.summaryStyle]} />
                            <Text style={styles.summaryText}>{languageJSON.rate_ride} </Text>
                            <Divider style={[styles.divider,styles.dividerStyle]} />
                        </View>
                        <View style={{flex:3, justifyContent:'center',alignItems:"center"}}>
                            {this.state.getDetails?
                            
                            this.state.getDetails.driver_image != ''?<Image source={{uri:this.state.getDetails.driver_image}} style={{height:78, width:78,borderRadius:78/2}} /> :
                          
                            <Image source={require('../../assets/images/profilePic.jpg')} style={{height:78, width:78,borderRadius:78/2}} />
                        
                        :null}
                            </View>
                        <View style={styles.tripSummaryStyle}>
                            <Text style={styles.Drivername}>{this.state.getDetails?this.state.getDetails.driver_name:null}</Text>
                           
                        </View>
                    </View>
                    <View style={styles.ratingViewStyle}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            starSize={40}
                            fullStar={'ios-star'}
                            halfStar={'ios-star-half'}
                            emptyStar={'ios-star-outline'}
                            iconSet={'Ionicons'}
                            fullStarColor={colors.YELLOW.primary}
                            emptyStarColor={colors.YELLOW.primary}
                            halfStarColor={colors.YELLOW.primary}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            buttonStyle={{padding:20}}
                            containerStyle={styles.contStyle}
                        />
                    </View>
                </View>

                <View style={styles.confBtnStyle}>
                    <Button 
                        title={languageJSON.submit_rating}
                        titleStyle={{fontFamily: 'Roboto-Bold',}}
                        onPress={() => this.submitNow()}
                        buttonStyle={styles.myButtonStyle}
                        disabled ={this.state.starCount>0 ? false:true}

                    />
                </View>
                {
                  this.alertModal()
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerInnerStyle: {
        marginLeft:10,
        marginRight: 10
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    headerskip:{
        color: colors.WHITE,
        fontFamily:'Roboto-Regular',
        fontSize: 16
    },
    dateViewStyle: {        
        justifyContent:"center", 
        flex:1,
        marginTop: 20
    },
    dateViewTextStyle: {
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.btnPrimary, 
        fontSize: 26,
        textAlign:"center"
    },
    rateViewStyle: {
        alignItems: 'center',
        flex:2
    },
    rateViewTextStyle: {
        fontSize: 60,
        color: colors.BLACK,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        textAlign:"center"
    },
    addressViewStyle: {
        flex:3,
        flexDirection: 'row',
        paddingTop: 22,
        paddingLeft: 10,
        paddingRight: 10
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 19,
        fontFamily: 'Roboto-Regular',
        marginLeft:15, 
        marginRight:15,
        marginTop: 15, 
        lineHeight: 24
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    divider:{
        backgroundColor: colors.GREY.secondary, 
        width:'20%',
        height: 1,
        top:'2.7%'
    },
    summaryText: {
        color: colors.GREY.btnPrimary,
        fontSize: 18,
        textAlign:"center",
        fontFamily: 'Roboto-Regular',
    },
    Drivername: {
        color: colors.GREY.btnPrimary,
        fontSize: 22,
        textAlign:"center",
        fontFamily: 'Roboto-Regular',
    },
    mainViewStyle:{
        flex: 1, 
        backgroundColor: colors.WHITE, 
        flexDirection: 'column', 
        //marginTop: StatusBar.currentHeight
    },
    pickUpStyle:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    tripMainView:{
        flex:6,
        flexDirection:"column", 
        justifyContent:"center",
    },
    ratingViewStyle:{
        flex:1.8,
        flexDirection:"row", 
        justifyContent:"center"
    },
    tripSummaryStyle:{
        flex:1, 
        flexDirection:"row", 
        justifyContent:'center',
    },
    confBtnStyle:{
        flex:2, 
        justifyContent:"flex-end",
        marginBottom:'5%', 
        alignItems: 'center'
    },
    myButtonStyle:{
        backgroundColor: colors.GREEN.default,
        width: 300,
        padding: 10,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 10
    },
    contStyle:{
        marginTop: 0, 
        paddingBottom: Platform.OS=='android'?5:0
    },summaryStyle:{
        justifyContent:"flex-end" 
    },
    dividerStyle:{
        justifyContent:"flex-start" 
    },
    //alert modal
    alertModalContainer: {flex:1, justifyContent:'center', backgroundColor: colors.GREY.background},
    alertModalInnerContainer: {height:200, width:(width*0.85), backgroundColor:colors.WHITE, alignItems:'center', alignSelf:'center', borderRadius:7},
    alertContainer: {flex:2, justifyContent:'space-between', width: (width-100) },
    rideCancelText: { flex:1,top:15, color:colors.BLACK, fontFamily: 'Roboto-Bold', fontSize:20, alignSelf: 'center'},
    horizontalLLine: {width:(width-110), height:0.5, backgroundColor:colors.BLACK, alignSelf: 'center',},
    msgContainer: {flex:2.5,alignItems:'center',justifyContent:'center'},
    cancelMsgText: { color:colors.BLACK, fontFamily: 'Roboto-Regular', fontSize:15, alignSelf: 'center', textAlign: 'center'},
    okButtonContainer:  {flex:1,width:(width*0.85),flexDirection:'row',backgroundColor:colors.GREY.iconSecondary, alignSelf:'center'},
    okButtonStyle: {flexDirection:'row',backgroundColor:colors.GREY.iconSecondary, alignItems: 'center', justifyContent:'center'},
    okButtonContainerStyle: {flex:1,width:(width*0.85),backgroundColor:colors.GREY.iconSecondary,},
});