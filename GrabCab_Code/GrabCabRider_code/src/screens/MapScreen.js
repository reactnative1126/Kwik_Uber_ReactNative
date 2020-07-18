import React from 'react';
import { 
    StyleSheet,
    View,
    Image,
    Dimensions, 
    Text,
    Platform,
    Alert,
    Modal,
    ScrollView,
    AsyncStorage,
  } from 'react-native';
import {TouchableOpacity,BaseButton,TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MapComponent} from '../components';
import { Icon, Button,Avatar, Header } from 'react-native-elements';
import { colors } from '../common/theme';

import * as Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
var { height, width } = Dimensions.get('window');
import  {GeoFire} from 'geofire';
import * as firebase from 'firebase'
import { AnimatedRegion } from 'react-native-maps';
import { google_map_key } from '../common/key';
import  languageJSON  from '../common/language';
import Geocoder from 'react-native-geocoding';

export default class MapScreen extends React.Component {

   bonusAmmount = 0;
//   allCabs = '';
  constructor(props){
    super(props);
    Geocoder.init(google_map_key);
    this.state = {
        loadingModal:false,
        giftModal:false,
        location: null,
        errorMessage: null,
        region: {
            latitude: 9.061460,
            longitude: 7.500640,
            latitudeDelta: 0.9922,
            longitudeDelta: 0.9421,
        },
        whereText: languageJSON.map_screen_where_input_text,
        dropText: languageJSON.map_screen_drop_input_text,
        backgroundColor: colors.WHITE,
        carType:"",
        coordinate: new AnimatedRegion({
            latitude: 9.061460,
            longitude:7.500640,
        }),
        allRiders:[],
        passData :{
            droplatitude: 0,
            droplongitude: 0,
            droptext: "",
            whereText: "",
            wherelatitude: 0,
            wherelongitude: 0,
            carType:'',
        },
        allCars: [],
        nearby:[],
        mainCarTypes:[],
        checkCallLocation:'',
        freeCars:[],
        settings:{
            symbol:'',
            code:'',
            cash:false,
            wallet:false,
            braintree:false,
            stripe:false
        },
        selected:'drop',
        mapChanging:false
    }
   
  }

 allCarsData(){
    const cars=firebase.database().ref('rates/car_type');
    cars.once('value',allCars=>{
        if(allCars.val()){
          let cars = allCars.val()
          let arr = [];
          for(key in cars){
            cars[key].minTime = ''
            cars[key].available = true;
            cars[key].active = false;
            arr.push(cars[key]);
          }
          this.setState({mainCarTypes:arr});
        }
       
    })
 }


  async componentWillMount() {  
    if (Platform.OS === 'android' && !Constants.default.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
          if(this.state.passData.wherelatitude == 0){
            this._getLocationAsync();
          }        
      }

    let searchObj = await this.props.navigation.getParam('searchObj') ? this.props.navigation.getParam('searchObj') : null;

      if(searchObj) {   
          
          if(searchObj.searchFrom == 'where') {
            
            if(searchObj.searchDetails){
                this.setState({
                    region: {
                      latitude: searchObj.searchDetails.geometry.location.lat,
                      longitude: searchObj.searchDetails.geometry.location.lng,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    },
                    whereText: searchObj.whereText,
                    dropText: searchObj.dropText,
                    carType:this.state.passData.carType,
                    loadingModal:true,
                    passData : this.props.navigation.getParam('old'),
                    checkCallLocation:'navigation',
                    selected:'pickup'
                },()=>{
                    this.getDrivers();
                })
                }
          }else {
            if(searchObj.searchDetails){
                this.setState({
                    region: {
                      latitude: searchObj.searchDetails.geometry.location.lat,
                      longitude: searchObj.searchDetails.geometry.location.lng,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    },
                    whereText: searchObj.whereText,
                    dropText: searchObj.dropText,
                    passData : this.props.navigation.getParam('old'),
                    carType:this.state.passData.carType,
                    loadingModal:true,
                    checkCallLocation:'navigation',
                    selected:'drop'
                  },()=>{
                    this.getDrivers();
                })
                }
          }
         
      }
        this.allCarsData();
        this.onPressModal();

        
  }

  _retrieveSettings = async () => {m 
        try {
        const value = await AsyncStorage.getItem('settings');
            if (value !== null) {
                this.setState({settings:JSON.parse(value)});
            }
        } catch (error) {
            console.log("Asyncstorage issue 9");
        }
    };


  componentDidMount(){
    this._retrieveSettings();
    setInterval(()=>{
        if(this.state.passData && this.state.passData.wherelatitude){
            this.setState({
                checkCallLocation:'interval'
            })
            this.getDrivers();
        }
    },30000)
  }

  loading(){
    return(
       <Modal
               animationType="fade"
               transparent={true}
               visible={this.state.loadingModal}
               onRequestClose={() => {
               this.setState({loadingModal:false})
           }}
           >
           <View style={{flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
               <View style={{width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70}}> 
               <View style={{ alignItems:'center',flexDirection:'row',flex:1,justifyContent:"center"}}>
                    <Image
                       style={{width:80,height:80,backgroundColor:colors.TRANSPARENT}}
                       source={require('../../assets/images/loader.gif')}
                       />
                  <View style={{flex:1}}>
                           <Text style={{color:"#000",fontSize:16,}}>{languageJSON.driver_finding_alert}</Text>
                   </View>
               </View>
               </View>
           </View>
           </Modal>
    )
   }


 _getLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({})
        if(location){
            var pos = {
                latitude:  location.coords.latitude,
                longitude: location.coords.longitude,
              };
              var curuser = firebase.auth().currentUser.uid;
            
             if(pos){
              let latlng = pos.latitude + ','+pos.longitude;
              return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&key=' + google_map_key)
              .then((response) => response.json())
              .then((responseJson) => {
              if(this.state.passData.wherelatitude == 0){
                this.setState({
                    whereText: responseJson.results[0].formatted_address,
                    region: {
                        latitude: pos.latitude,
                        longitude: pos.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    loadingModal:true,
                },()=>{
                    
                    
                    let obj = {}
                    obj = this.state.passData;
                    obj.wherelatitude = pos.latitude
                    obj.wherelongitude = pos.longitude
                    obj.whereText = responseJson.results[0].formatted_address;
                    this.setState({
                        passData:obj,
                        checkCallLocation:'navigation',
                        mapChanging:true
                    })
                    this.getDrivers();
                    firebase.database().ref('users/' + curuser+'/location').update({ 
                        add:responseJson.results[0].formatted_address,
                        lat:pos.latitude,
                        lng:pos.longitude
                    }) 
                });
                
                }else{
                    this.setState({loadingModal:true});
                    let obj = {}
                    obj = this.state.passData;
                    obj.wherelatitude = pos.latitude
                    obj.wherelongitude = pos.longitude
                    obj.whereText = responseJson.results[0].formatted_address;
                    this.setState({
                        passData:obj,
                        checkCallLocation:'navigation',
                        mapChanging:true
                    })
                    this.getDrivers();
                    firebase.database().ref('users/' + curuser+'/location').update({ 
                        add:responseJson.results[0].formatted_address,
                        lat:pos.latitude,
                        lng:pos.longitude
                    }) 
                }
    
              })
              .catch((error) =>{
                console.error(error);
              });
            }
          }
   }



  //Go to confirm booking page
  onPressBook() {
   if((this.state.passData.whereText == "" || this.state.passData.wherelatitude  == 0 || this.state.passData.wherelongitude == 0 )&& (this.state.passData.dropText  == "" || this.state.passData.droplatitude  == 0 || this.state.passData.droplongitude == 0)){
        alert(languageJSON.pickup_and_drop_location_blank_error)
    }else{
        if(this.state.passData.whereText == "" || this.state.passData.wherelatitude == 0 || this.state.passData.wherelongitude == 0){
        alert(languageJSON.pickup_location_blank_error)
        }else if(this.state.passData.dropText == "" || this.state.passData.droplatitude == 0 || this.state.passData.droplongitude == 0){
            alert(languageJSON.drop_location_blank_error)
        }else if(this.state.passData.carType == "" || this.state.passData.carType == undefined){
            alert(languageJSON.car_type_blank_error)
        }else{
            this.state.passData.latitudeDelta = "0.0922" ;
            this.state.passData.longitudeDelta= "0.0421";
             
            this.props.navigation.navigate('FareDetails',{data:this.state.passData,carType:this.state.passData.carType,carimage:this.state.passData.carImage});
        }
    }
   
  }
  
  
  selectCarType(value,key){
    
      let allCars = this.state.allCars;
      for(let i =0; i<allCars.length; i++){
         allCars[i].active = false;
          if(i == key){
            allCars[i].active = true;
          }
      }
      this.setState({
        allCars:allCars
     },()=>{
            this.state.passData.carType = value.name;
            this.state.passData.carImage = value.image;
        })
  }




  getDriverTime(startLoc,destLoc) {
    return new Promise(function(resolve, reject) {
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${startLoc}&destinations=${destLoc}&key=${ google_map_key }`)
            .then((response) => response.json())
            .then((res) => 
                resolve({
                    distance_in_meter:  res.rows[0].elements[0].distance.value,
                    time_in_secs:  res.rows[0].elements[0].duration.value,
                    timein_text:  res.rows[0].elements[0].duration.text
                })
            )
            .catch(error=>{
                reject(error);
            });
    });
  }
 
  async getDrivers(){

    const userData=firebase.database().ref('users/');

     userData.once('value',userData=>{
        if(userData.val()){
          let allUsers = userData.val();
           this.prepareDrivers(allUsers);     
        }
    })
  }

  async prepareDrivers(allUsers){
    let availableDrivers =[];
    let freeCars = []; //Only for Ukraine Project
    let arr = {};
    let riderLocation = [this.state.passData.wherelatitude,this.state.passData.wherelongitude];
    let startLoc = '"'+this.state.passData.wherelatitude+', '+this.state.passData.wherelongitude+'"';
    for(let key in allUsers){
        let driver = allUsers[key];
        if((driver.usertype) && (driver.usertype == 'driver') && (driver.approved == true) && (driver.queue == false) && (driver.driverActiveStatus == true)){
            
            if(driver.location) {
              let driverLocation = [driver.location.lat,driver.location.lng];
              let distance = GeoFire.distance(riderLocation, driverLocation); 
              freeCars.push(driver);
              if(distance < 10){  
                  let destLoc = '"'+ driver.location.lat+', '+ driver.location.lng+'"';
                  driver.arriveDistance = distance;
                  driver.arriveTime  = await this.getDriverTime(startLoc,destLoc);
                  let carType = driver.carType;
                  if(arr[carType] && arr[carType].drivers){
                      arr[carType].drivers.push(driver);  
                      if(arr[carType].minDistance > distance){
                        arr[carType].minDistance = distance;
                        arr[carType].minTime = driver.arriveTime.timein_text;
                      }         
                  }else{
                      arr[carType] = {};
                      arr[carType].drivers = [];
                      arr[carType].drivers.push(driver);
                      arr[carType].minDistance = distance;
                      arr[carType].minTime = driver.arriveTime.timein_text;
                  }
                  availableDrivers.push(driver);
                  
              }
            }
        }
    }

    const allCars = this.state.mainCarTypes.slice();

    for(let i=0;i<allCars.length;i++){
        if(arr[allCars[i].name]){
            allCars[i].nearbyData=arr[allCars[i].name].drivers;
            allCars[i].minTime = arr[allCars[i].name].minTime;
            allCars[i].available = true;
        }else{
            allCars[i].minTime = '';
            allCars[i].available = false;
        }
        allCars[i].active = false;

    }

    this.setState({
        allCars:allCars,
        loadingModal:false,
        nearby:availableDrivers,
        freeCars:freeCars
    });

    if(availableDrivers.length==0){
        
        this.showNoDriverAlert();
    }

  }



  showNoDriverAlert() {
      if(this.state.checkCallLocation == 'navigation' || this.state.checkCallLocation == 'moveMarker'){
        Alert.alert(
            languageJSON.no_driver_found_alert_title,
            languageJSON.no_driver_found_alert_messege,
            [
             {
               text: languageJSON.no_driver_found_alert_OK_button,
               onPress: () => this.setState({loadingModal:false}),
             },
             {text: languageJSON.no_driver_found_alert_TRY_AGAIN_button, onPress: () => {this._getLocationAsync()},  style: 'cancel',},
           ],
           {cancelable: true},
        )
      }
    
}

  onPressCancel(){
    this.setState({
        giftModal:false
    })
  }


  bonusModal(){
    return (
    <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.giftModal}
            onRequestClose={() => {
            this.setState({giftModal:false})
        }}
        >
        <View style={{flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
            <View style={{width: '80%', backgroundColor: "#fffcf3", borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1, maxHeight: 325}}> 
            <View style={{marginTop:0,alignItems:"center"}}>
            <Avatar
                rounded
                size={200}
                source={require('../../assets/images/gift.gif')}
                containerStyle={{width:200,height:200,marginTop:0,alignSelf:"center",position:"relative"}}
                />
           <Text style={{color:"#0cab03",fontSize:28,textAlign:"center",position:"absolute",marginTop:170}}>{languageJSON.congratulation}</Text>
            <View>
    <Text style={{color:"#000",fontSize:16,marginTop:12,textAlign:"center"}}>{languageJSON.refferal_bonus_messege_text} {this.state.settings.code}{this.bonusAmmount}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={languageJSON.no_driver_found_alert_OK_button}
                    loading={false}
                    titleStyle={styles.buttonTitleText}
                    onPress={()=>{this.onPressCancel()}}
                    buttonStyle={styles.cancelButtonStyle}
                    containerStyle={{marginTop:20}}
                />
            </View>
            </View>       
            </View>
        </View>
        </Modal>
    );
}

onPressModal(){
  
    var curuser = firebase.auth().currentUser.uid;
    const userRoot=firebase.database().ref('users/'+curuser);
    userRoot.once('value',userData=>{
        if(userData.val()){
            if(userData.val().refferalId == undefined){
                let name = userData.val().firstName?userData.val().firstName.toLowerCase():'';
                let uniqueNo = Math.floor(Math.random() * 9000) + 1000;
                let refId = name + uniqueNo;
                userRoot.update({
                    refferalId:refId,
                    walletBalance:0,
                }).then(()=>{
                    if(userData.val().signupViaReferral == true){                  
                                firebase.database().ref('referral/bonus').once('value',referal=>{
                                    if(referal.val()){
                                        this.bonusAmmount = referal.val().amount;        
                                        userRoot.update({
                                            walletBalance:this.bonusAmmount
                                        }).then(()=>{
                                            this.setState({
                                                giftModal:true
                                            })
                                        })
                                    }
                            }) 
                    }
                })    
            }
        }
    })
}



  tapAddress = (selection)=>{
    if(selection === this.state.selected){
        if(selection=='drop'){
            this.props.navigation.navigate('Search',{from:"drop",whereText:this.state.whereText,dropText:this.state.dropText,old:this.state.passData});
        }else{
            this.props.navigation.navigate('Search',{from:"where",whereText:this.state.whereText,dropText:this.state.dropText,old:this.state.passData});
        }
    }else{
        this.setState({selected:selection});
        if(selection=='pickup'){
            this.setState({
                region:{
                    latitude: this.state.passData.wherelatitude,
                    longitude: this.state.passData.wherelongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            })
        }else{
            this.setState({
                region:{
                    latitude: this.state.passData.droplatitude,
                    longitude: this.state.passData.droplongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            })
        }
    }
  };
  


  onRegionChangeComplete = (region) =>{
      if(this.state.mapChanging){
            Geocoder.from({
                latitude : region.latitude,
                longitude : region.longitude
            }).then(json => {
      
                var addressComponent = json.results[0].formatted_address;
                if(this.state.selected=='pickup'){
                    this.setState({
                        region: region,
                        whereText: addressComponent,
                        passData:  { 
                            droplatitude: this.state.passData.droplatitude,
                            droplongitude: this.state.passData.droplongitude,
                            droptext: this.state.passData.droptext,
                            whereText: addressComponent,
                            wherelatitude: region.latitude,
                            wherelongitude: region.longitude,
                            carType:this.state.passData.carType
                        },
                        carType:this.state.carType,
                        checkCallLocation:'moveMarker'
                    });
                }else{
                    this.setState({
                        region: region,
                        dropText: addressComponent,
                        passData:  { 
                            droplatitude: region.latitude,
                            droplongitude: region.longitude,
                            droptext: addressComponent,
                            whereText: this.state.passData.whereText,
                            wherelatitude: this.state.passData.wherelatitude,
                            wherelongitude: this.state.passData.wherelongitude,
                            carType:this.state.passData.carType
                        },
                        carType:this.state.carType,
                        checkCallLocation:'moveMarker'
                    });
                }
            })
            .catch(error => console.warn(error));
      }
      
  } 


  render() {
    return (
      <View style={styles.mainViewStyle}>
        <Header 
            backgroundColor={colors.GREY.default}
            leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
            centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.map_screen_title}</Text>}
            containerStyle={styles.headerStyle}
            innerContainerStyles={styles.inrContStyle}
        />

        <View style={styles.myViewStyle}>
            <View style={styles.coverViewStyle}>
                <View style={styles.viewStyle1}/>
                <View style={styles.viewStyle2}/>
                <View style={styles.viewStyle3}/>
            </View>
            <View style={styles.iconsViewStyle}>
                <TouchableOpacity onPress={()=>this.tapAddress('pickup')} style={styles.contentStyle}>
                    <View style={styles.textIconStyle}>
                        <Text numberOfLines={1} style={[styles.textStyle,this.state.selected=='pickup'?{fontSize:20}:{fontSize:14}]}>{this.state.whereText}</Text>
                        <Icon
                            name='gps-fixed'
                            color={colors.WHITE}
                            size={this.state.selected=='pickup'?24:14}
                            containerStyle={{flex:1}}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.tapAddress('drop')} style={styles.searchClickStyle}>
                    <View style={styles.textIconStyle}>
                        <Text numberOfLines={1} style={[styles.textStyle,this.state.selected=='drop'?{fontSize:20}:{fontSize:14}]}>{this.state.dropText}</Text>
                        <Icon
                            name='search'
                            type='feather'
                            color={colors.WHITE}
                            size={this.state.selected=='drop'?24:14}
                            containerStyle={{flex:1}}
                        />
                    </View>
                </TouchableOpacity>

            </View>
        </View> 
        <View style={styles.mapcontainer}>
            <MapComponent 
                markerRef={marker => { this.marker = marker; }} 
                mapStyle={styles.map} 
                mapRegion={this.state.region} 
                nearby = {this.state.freeCars} 
               // onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.onRegionChangeComplete}
                //onPanDrag={this.onPanDrag}
            />
            {this.state.selected=='pickup'?
            <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Image pointerEvents="none" style={{marginBottom:40,height:40,resizeMode: "contain"}} source={require('../../assets/images/green_pin.png')}/>
            </View>
            :
            <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Image pointerEvents="none" style={{marginBottom:40,height:40,resizeMode: "contain"}} source={require('../../assets/images/rsz_2red_pin.png')}/>
            </View>
            }
        </View>
        <View style={styles.compViewStyle}>
            <Text style={styles.pickCabStyle}>{languageJSON.cab_selection_title}</Text>
            <Text style={styles.sampleTextStyle}>{languageJSON.cab_selection_subtitle}</Text>
            <ScrollView horizontal={true} style={styles.adjustViewStyle} showsHorizontalScrollIndicator={false}>
                {this.state.allCars.map((prop, key) => {
                return (
                <TouchableOpacity key={key} style={styles.cabDivStyle} onPress={()=>{this.selectCarType(prop,key)}} disabled={prop.minTime == ''} >
                    <View style={[styles.imageStyle,{ 
                    backgroundColor: prop.active == true?colors.YELLOW.secondary:colors.WHITE}]
                    }>
                        <Image source={prop.image?{uri:prop.image}:require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
                    </View>
                    <View style={styles.textViewStyle}>
                         <Text style={styles.text1}>{prop.name.toUpperCase()}</Text> 
                        <Text style={styles.text2}>{prop.minTime != ''? prop.minTime : languageJSON.not_available}</Text>
                    </View>
                </TouchableOpacity>
            
                );
                })}
            </ScrollView>
            <View style={{flex:0.5}}>
                <BaseButton
                    title={languageJSON.book_now_button}
                    loading={false}
                    onPress={()=>{this.onPressBook()}}
                    style={{flex: 1, justifyContent:'center',alignItems:'center', backgroundColor: colors.GREY.btnPrimary,width: width, backgroundColor: colors.GREY.btnPrimary,elevation: 0}}
                >
                    <Text style={{color: colors.WHITE, fontFamily: 'Roboto-Bold', fontSize: 18}}>{languageJSON.book_now_button}</Text>
                </BaseButton>

            </View>
          
        </View>
    
        {

             this.bonusModal()
        }
        {
            this.loading()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 18
     },
    mapcontainer: {
        flex: 6,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    inrContStyle:{
        marginLeft:10, 
        marginRight: 10
    },
    mainViewStyle:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
    },
    myViewStyle:{ 
        flex: 1.5, 
        flexDirection: 'row',
        borderTopWidth:0, 
        alignItems: 'center', 
        backgroundColor: colors.GREY.default, 
        paddingEnd: 20 
    },
    coverViewStyle:{ 
        flex: 1.5, 
        alignItems:'center' 
    },
    viewStyle1:{
        height: 12, 
        width: 12, 
        borderRadius: 15/2, 
        backgroundColor: colors.YELLOW.light
    },
    viewStyle2:{
        height: height/25, 
        width: 1, 
        backgroundColor: colors.YELLOW.light
    },
    viewStyle3:{
        height: 14, 
        width: 14, 
        backgroundColor: colors.GREY.iconPrimary
    },
    iconsViewStyle:{
        flex: 9.5, 
        justifyContent: 'space-between'
    },
    contentStyle:{
         //flex: 1, 
         justifyContent: 'center', 
         borderBottomColor: colors.WHITE, 
         borderBottomWidth: 1
        },
    textIconStyle:{
        // flex: 1, 
         justifyContent: 'center', 
         alignItems:'center', 
         flexDirection: 'row'
        },
    textStyle:{
         flex:9, 
         fontFamily: 'Roboto-Regular', 
         fontSize: 14, 
         fontWeight: '400', 
         color: colors.WHITE,
         marginTop:10,
         marginBottom:10
        },
    searchClickStyle:{
         //flex: 1, 
         justifyContent: 'center'
        },
    compViewStyle:{
        flex: 3.5, 
        alignItems: 'center'
    },
    pickCabStyle:{ 
        flex: 0.3, 
        fontFamily: 'Roboto-Bold', 
        fontSize: 15, 
        fontWeight: '500', 
        color: colors.BLACK
    },
    sampleTextStyle:{ 
        flex: 0.2, 
        fontFamily: 'Roboto-Regular', 
        fontSize: 13, 
        fontWeight: '300', 
        color: colors.GREY.secondary
    },
    adjustViewStyle:{
        flex: 9, 
        flexDirection: 'row', 
        //justifyContent: 'space-around',
        marginTop:8
    },
    cabDivStyle : {
        flex: 1, 
        width : width/3,
        alignItems: 'center'
    },
    imageViewStyle:{
        flex: 2.7, 
        flexDirection: 'row', 
        justifyContent: 'space-around',
    },
    imageStyle:{
        height: height/14, 
        width: height/14, 
        borderRadius: height/14/2,
        borderWidth:3, 
        borderColor:colors.YELLOW.secondary, 
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    textViewStyle:{
        flex: 1, 
        alignItems: 'center',
        flexDirection:'column',
        justifyContent:'center',
    },
    text1:{ 
        
        fontFamily: 'Roboto-Bold', 
        fontSize: 14, 
        fontWeight: '900', 
        color: colors.BLACK
    },
    text2:{ 
        fontFamily: 'Roboto-Regular', 
        fontSize: 12, 
        fontWeight: '900', 
        color: colors.GREY.secondary
    },
    imagePosition:{
        height: height/14, 
        width: height/14, 
        borderRadius: height/14/2,
        borderWidth:3, 
        borderColor:colors.YELLOW.secondary, 
        //backgroundColor: colors.YELLOW.secondary, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    imageStyleView:{
        height: height/14, 
        width: height/14, 
        borderRadius: height/14/2, 
        borderWidth:3, 
        borderColor:colors.YELLOW.secondary, 
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    imageStyle1:{
        height: height/20.5,
        width: height/20.5
    },
    imageStyle2:{
        height: height/20.5,
        width: height/20.5
    },
    buttonContainer: {
        flex:1
    },

   buttonTitleText: {
        color:colors.GREY.default, 
        fontFamily: 'Roboto-Regular', 
        fontSize: 20, 
        alignSelf:'flex-end'
    },

cancelButtonStyle: { 
        backgroundColor: "#edede8", 
        elevation: 0,
        width:"60%",
        borderRadius:5,
        alignSelf:"center"
    }
    
});