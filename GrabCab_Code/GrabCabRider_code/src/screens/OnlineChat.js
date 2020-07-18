import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback
} from "react-native";
import { colors } from "../common/theme";
import { Icon,Header} from "react-native-elements";
import * as firebase from 'firebase'
import  languageJSON  from '../common/language';
var {  height } = Dimensions.get('window');
import { RequestPushMsg } from '../common/RequestPushMsg';
export default class OnlineChat extends Component {
  getParamData;
  constructor(props) {
    super(props);
    this.state = {
        search: "",
        text: "",
        data:"" ,
        tempData: [],
        persons: [],
        messages: [],
        driverName:"",
        inputmessage:"",
        messegeData:[],
        user:"",
        flag:false,
        position: 'absolute', 
        paddingHeight:0,
        messageCntHeight:height-150,
        carbookedInfo:"",
        id:"",
        chat:false,
        allChat:[],
        messegesData:[]

    };
  }
 

   componentDidMount() {
    this.getParamData =  this.props.navigation.getParam('passData');
    let bookingData=firebase.database().ref('bookings/'+this.getParamData.bokkingId)
    bookingData.on('value',response => {
      if(response.val()){
        this.setState({carbookedInfo:response.val()})
      }
    })
    let msgData=firebase.database().ref(`chat/`+this.getParamData.bokkingId + '/message')
    msgData.on('value',msgData=>{
            let rootEntry=msgData.val();
            let allMesseges=[]
            for(let key in rootEntry){
                    let entryKey=rootEntry[key]
                    for(let msgKey in entryKey){
                            entryKey[msgKey].smsId=msgKey
                            allMesseges.push(entryKey[msgKey])
                    }
                    
            }
            this.setState({allChat:allMesseges})       
    })
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

      
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow= (e)=> {
    console.log(e.endCoordinates.height);
    if (this.state.position !== 'relative') {
      this.setState({
      position: 'relative',paddingHeight:e.endCoordinates.height
      },()=>{
        console.log(this.state.paddingHeight)
      })
      }
  }

  _keyboardDidHide =(e) =>{
    if (this.state.position !== 'absolute') {
      this.setState({
      position: 'absolute',paddingHeight:0
      },()=>{
      })
      }
  }


  sendMessege(inputmessage){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + ':' + dd + ':' + yyyy;
    
    let customer=this.state.carbookedInfo.customer;
    let driver=this.state.carbookedInfo.driver
    let totalId=this.state.carbookedInfo.customer + ',' + this.state.carbookedInfo.driver
    console.log(totalId);
    this.setState({id:totalId})

    if(inputmessage == '' || inputmessage == undefined || inputmessage == null){
      alert("Please write something...");
    }else{
    let chat=firebase.database().ref('chat')
    // if(chat){
    chat.once('value',chat=>{
      if(chat.val()){
        let allChat=chat.val();
        for(let key in allChat){
          if(this.getParamData.bokkingId == key){
            this.setState({chat:true})
          }
        }
        if(this.state.chat == true){
          firebase.database().ref('chat'+ '/' +this.getParamData.bokkingId + '/'+ 'message' + '/' + this.state.id).push({
            message:inputmessage,
            from:this.state.carbookedInfo.customer,
            type:"msg",
            msgDate:today,
            msgTime:time,
            source:"rider"
          })
        } 
        else{
          firebase.database().ref('chat'+ '/' +this.getParamData.bokkingId + '/').update({
              distance:this.state.carbookedInfo.distance,
              car:this.state.carbookedInfo.carType,
              bookingId:this.getParamData.bokkingId
            }).then(()=>{
            firebase.database().ref('chat'+ '/' +this.getParamData.bokkingId + '/'+ 'message' + '/' + this.state.id).push({
                message:inputmessage,
                from:this.state.carbookedInfo.customer,
                type:"msg",
                msgDate:today,
                msgTime:time,
                source:"rider"
              })
              this.sendPushNotification(this.state.carbookedInfo.customer,this.getParamData.bookingId,'Driver '+ this.state.carbookedInfo.driver_name+ ', sent a messege to you: \n'+inputmessage);
        })
        }
      }else{
        firebase.database().ref('chat'+ '/' +this.getParamData.bokkingId + '/').update({
        distance:this.state.carbookedInfo.distance,
        car:this.state.carbookedInfo.carType,
        bookingId:this.getParamData.bokkingId
        }).then(()=>{
          if(this.state.id){
            firebase.database().ref('chat'+ '/' +this.getParamData.bokkingId + '/'+ 'message' + '/' + this.state.id).push({
              message:inputmessage,
              from:this.state.carbookedInfo.customer,
              type:"msg",
              msgDate:today,
              msgTime:time,
              source:"rider"
              })
              this.sendPushNotification(this.state.carbookedInfo.driver,this.getParamData.bokkingId,'Rider '+ this.state.carbookedInfo.customer_name+ ', has sent a messege to you: \n'+inputmessage)
          }else{}

    })
      }
    })
    this.setState({inputmessage:""});
  }
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
renderItem({ item }) {
  return (
                    
    item.source == "rider"? 
    <View style={styles.drivermsgStyle}>
    <Text style={styles.msgTextStyle}>{item?item.message:languageJSON.chat_not_found}</Text>
    <Text style={styles.msgTimeStyle}>{item?item.msgTime:null}</Text>
    </View>
    :
    <View style={styles.riderMsgStyle}>
    <Text style={styles.riderMsgText}>{item?item.message:languageJSON.chat_not_found}</Text>
    <Text style={styles.riderMsgTime}>{item?item.msgTime:null}</Text> 
    </View>
                      
  );
}



render() {
  return (
    <View style={styles.container}>
        <Header 
            backgroundColor={colors.GREY.default}
            leftComponent={{icon:'angle-left', type:'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.goBack();} }}
            centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.chat_title}</Text>}
            containerStyle={styles.headerStyle}
            innerContainerStyles={styles.inrContStyle}
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle="light-content" 
            containerStyle={{
              justifyContent: 'space-around',
              height:80

            }}
        /> 
      <FlatList
        data={this.state.allChat.reverse()}
        renderItem={this.renderItem}
        inverted
      />
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.footer}>
          <TextInput
            value={this.state.inputmessage}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={languageJSON.chat_input_title}
            onChangeText={text => this.setState({ inputmessage: text })}
          />
         
          <TouchableOpacity onPress={() => this.sendMessege(this.state.inputmessage)}>
            <Text style={styles.send}>{languageJSON.send_button_text}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

}
//Screen Styling
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor:colors.GREY.btnSecondary,
//marginTop: StatusBar.currentHeight,
},
container1:{
height:height-150
},
container2:{
bottom:0,
left:0,
right:0,
borderTopWidth:StyleSheet.hairlineWidth
},
backIconStyle: {
alignSelf:'flex-start',
marginLeft:20
},
contentContainerStyle: {
flexGrow: 1
},
headerTitleStyle: { 
  color: colors.WHITE,
  fontSize: 18,
  textAlign:'center',
},
headerStyle: { 
  backgroundColor: colors.GREY.default, 
  borderBottomWidth: 0 
},

inrContStyle:{
  marginLeft:10, 
  marginRight: 10
},
row: {
  flexDirection: 'row',
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#eee'
},
avatar: {
  borderRadius: 20,
  width: 40,
  height: 40,
  marginRight: 10
},
rowText: {
  flex: 1
},
message: {
  fontSize: 18
},
sender: {
  fontWeight: 'bold',
  paddingRight: 10
},
footer: {
  flexDirection: 'row',
  backgroundColor: '#eee'
},
input: {
  paddingHorizontal: 20,
  fontSize: 18,
  flex: 1
},
send: {
  alignSelf: 'center',
  color: 'lightseagreen',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 20
} ,
drivermsgStyle:{
  backgroundColor:colors.GREY.default,
  marginBottom:5,
  marginTop:5,
  marginRight:10,
  marginLeft:30,
  borderRadius:20,
  elevation: 5,
  shadowOpacity: 0.75,
  shadowRadius: 5,
  shadowColor: colors.GREY.Deep_Nobel,
  shadowOffset: { height: 1, width: 0 },
},
msgTextStyle:{
  marginStart:15,
  marginEnd:15,
  marginTop:10,
  textAlign:"right",
  fontSize:18,
  color:"#fff"
},
msgTimeStyle:{
  marginStart:15,
  marginBottom:10,
  marginEnd:15,
  textAlign:"right",
  fontSize:12,
  color:"#fff"
},
riderMsgStyle:{
  backgroundColor:"#fff",
  marginBottom:5,
  marginTop:5,
  marginRight:30,
  marginLeft:10,
  borderRadius:20,
  shadowOpacity: 0.75,
  shadowRadius: 5,
  shadowColor: colors.GREY.Deep_Nobel,
  shadowOffset: { height: 1, width: 0 },
},
riderMsgText:{
  marginStart:15,
  textAlign:"left",
  fontSize:18,
  color:"#000",
  marginTop:10
},
riderMsgTime:{
  marginStart:15,
  textAlign:"left",
  fontSize:12,
  color:"#000",
  marginBottom:10
}
});
