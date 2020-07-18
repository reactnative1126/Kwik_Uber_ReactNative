import React from 'react';
import { 
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import { colors } from '../common/theme';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import  languageJSON  from '../common/language';
var { width, height } = Dimensions.get('window');
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        firstName: '',
        lastName:'',
        profile_image: null,
        loader:false,
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

  componentDidMount(){
    this._retrieveSettings();
  }

  _retrieveSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('settings');
      if (value !== null) {
        this.setState({settings:JSON.parse(value)});
      }
    } catch (error) {
        console.log("Asyncstorage issue 10");
    }
};


  async componentWillMount() {
    var curuser = firebase.auth().currentUser;
    console.log(curuser.providerData)
    this.setState({currentUser:curuser},()=>{
        const userData=firebase.database().ref('users/'+this.state.currentUser.uid);
        userData.on('value',userData=>{
            if(userData.val()){
                var str = userData.val().location.add
                var tempAdd = str.split(",")[3]+ ','+str.split(",")[4];
                this.setState({tempAddress:tempAdd});
                this.setState(userData.val(),(res)=>{
                });         
            }
        })
    })
   
  }
 
  showActionSheet = () => {
    this.ActionSheet.show()
  }

  uploadImage(){
    return (
        <View>      
          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={languageJSON.photo_upload_action_sheet_title}
            options={[languageJSON.camera, languageJSON.galery, languageJSON.cancel]}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => { 
                if(index == 0){
                 this._pickImage(ImagePicker.launchCameraAsync);
                }else if(index == 1){
                    this._pickImage(ImagePicker.launchImageLibraryAsync);
                }else{
                    //console.log('actionsheet close')
                }
             }}
          />
        </View>
      )
    }
  
    
    
    _pickImage = async (res) => {
      var pickFrom = res;
    const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
    if(status == 'granted'){ 
        this.setState({loader:true})
        let result = await pickFrom({
            allowsEditing: true,
            aspect: [3, 3],
            base64:true
          });
            if (!result.cancelled) {
                let data = 'data:image/jpeg;base64,'+result.base64
                this.uploadmultimedia(result.uri)
              this.setState({ profile_image: 'data:image/jpeg;base64,'+result.base64 },()=>{  
                  this.setState({loader:false})
              });
            }
            else {
                this.setState({loader:false})
            }
    }
  };
  

async uploadmultimedia(url){
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
       };
       xhr.onerror = function() {
         reject(new TypeError(languageJSON.network_request_failed)); // error occurred, rejecting
       };
       xhr.responseType = 'blob'; // use BlobModule's UriHandler
       xhr.open('GET', url, true); // fetch the blob from uri in async mode
       xhr.send(null); // no initial data
     });

    var imageRef = firebase.storage().ref().child(`users/${this.state.currentUser.uid}`);
    return imageRef.put(blob).then(() => {
        blob.close()
        return imageRef.getDownloadURL()
      }).then((url) => {
        var d = new Date();
        firebase.database().ref(`/users/`+this.state.currentUser.uid + '/').update({
            profile_image:url
        })
      })
}

 editProfile=() => {
    this.props.navigation.push('editUser');
 }



 loader(){
        return (
            <View style={[styles.loadingcontainer, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
 }
  //sign out and clear all async storage
    async signOut() {
        firebase.auth().signOut();
    }
  
    //Delete current user
    async deleteAccount(){        
        Alert.alert(
            languageJSON.delete_account_modal_title,
            languageJSON.delete_account_modal_subtitle,
            [
              {
                text: languageJSON.cancel,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: languageJSON.yes, onPress: () =>
                {
                    var ref = firebase.database().ref('users/'+this.state.currentUser.uid +'/')
                    ref.remove().then(()=>{
                        firebase.auth().signOut();
                        firebase.auth().currentUser.delete()
                    });
                }
            },
            ],
            {cancelable: false},
          );   
    }

    goWallet(){
        this.props.navigation.navigate('wallet');
    }

    render() {
        let { image } = this.state;

        return (        
        <View style={styles.mainView}>
            <Header 
                backgroundColor={colors.GREY.default}
                leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.profile_page_title}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{marginLeft:10, marginRight: 10}}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
               {
                   this.uploadImage()
               }
                {this.state.settings.wallet?
                <View style={styles.scrollViewStyle} >
                    <Text style={styles.profStyle}> {languageJSON.my_wallet_title} ( {this.state.settings.symbol} {this.state.walletBalance?parseFloat(this.state.walletBalance).toFixed(2):0.00})</Text>
                    <Icon
                    name='keyboard-arrow-right'
                    type='MaterialIcons'
                    color='#000'
                    size={40}
                    iconStyle={{ lineHeight: 48 }}
                    onPress={() => this.goWallet()}
                  /> 
                </View>
                :null}
                <View style={styles.scrollViewStyle2} >
                    <Text style={styles.profStyle}>{languageJSON.profile_page_subtitle}</Text>
                    <Icon
                        name='page-edit'
                        type='foundation'
                        color={colors.GREY.btnPrimary}
                        containerStyle={{ right: 20 }}
                        onPress={this.editProfile}
                    />
                </View>

                <View style={styles.viewStyle}>
                    <View style={styles.imageParentView}>
                        <View style={styles.imageViewStyle} >
                        {
                             this.state.loader == true?this.loader():<TouchableOpacity onPress={this.showActionSheet}>
                             <Image source={this.state.profile_image?{uri:this.state.profile_image}:require('../../assets/images/profilePic.png')} style={{borderRadius: 130/2, width: 130, height: 130}} />
                             </TouchableOpacity>
                        }
                        </View>
                    </View>
                    <Text style={styles.textPropStyle} >{this.state.firstName.toUpperCase()+" "+ this.state.lastName.toUpperCase()}</Text>
                </View>

                <View style={styles.newViewStyle}>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='envelope-letter'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                                size={30}
                            />
                            <Text style={styles.emailStyle}>{languageJSON.email_placeholder}</Text>
                        </View>
                        <View style={styles.flexView1}>
                            <Text style={styles.emailAdressStyle}>{this.state.email}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='globe'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                            />
                            <Text style={styles.text1}>{languageJSON.location_lebel}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.text2}>{this.state.tempAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='phone-call'
                                type='feather'
                                color={colors.GREY.btnPrimary}
                            />
                            <Text style={styles.text1}>{languageJSON.mobile_no_placeholder}</Text>
                        </View>
                        <View style={styles.flexView2}>
                            <Text style={styles.text2}>{this.state.mobile}</Text>
                        </View>
                    </View>
                    {this.state.refferalId?
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='award'
                                type='feather'
                                color={colors.GREY.btnPrimary}
                            />
                            <Text style={styles.emailStyle}>{languageJSON.referral_id_placeholder}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.text2}>{this.state.refferalId}</Text>
                        </View>
                    </View>
                    :null}
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='globe'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                            />
                            <Text style={styles.emailStyle}>{languageJSON.language_lebel}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.text2}>{languageJSON.preffer_language}</Text>
                        </View>
                    </View>
                    
                </View>
                
                <View style={styles.flexView3}>

                    <TouchableOpacity style={styles.textIconStyle2} onPress={()=>{this.deleteAccount()}}>
                        <Text style={styles.emailStyle}>{languageJSON.delete_account_lebel}</Text>
                        <Icon
                            name='ios-arrow-forward'
                            type='ionicon'
                            color={colors.GREY.iconPrimary}
                            size={35}
                            containerStyle={{ right: 20 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{this.signOut()}} style={styles.textIconStyle2}>
                        <Text style={styles.emailStyle}>{languageJSON.logout}</Text>
                        <Icon
                            name='ios-arrow-forward'
                            type='ionicon'
                            color={colors.GREY.iconPrimary}
                            size={35}
                            containerStyle={{ right: 20 }}
                        />
                    </TouchableOpacity> 
                </View>

            </ScrollView>
           
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
        fontSize: 20
    },
    logo:{
      flex:1,
      position:'absolute',
      top:110,
      width:'100%',
      justifyContent:"flex-end",
      alignItems:'center'      
    },
    footer:{
      flex:1,
      position:'absolute',
      bottom:0,
      height:150,
      width:'100%',
      flexDirection:'row',
      justifyContent: 'space-around',
      alignItems:'center'
    },
    scrollStyle:{
         flex: 1,
         height: height, 
         backgroundColor:colors.WHITE
        },
    scrollViewStyle:{
        width: width, 
        height: 50, 
        marginTop: 15, 
        backgroundColor: colors.GREY.primary, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    scrollViewStyle2:{
        width: width, 
        height: 50, 
        marginTop: 10, 
        marginBottom:10,
        backgroundColor: colors.GREY.primary, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    profStyle:{
        fontSize: 18, 
        left: 20, 
        fontWeight:'bold',
        color:colors.GREY.btnPrimary, 
        fontFamily:'Roboto-Bold'
    },
    bonusAmount:{
      right:20,
      fontSize:16,
      fontWeight:'bold'
    },
    viewStyle:{ 
        justifyContent:'center',
        alignItems:'center', 
        marginTop: 13 
    },
    imageParentView:{ 
        borderRadius: 150/2, 
        width: 150, 
        height: 150, 
        backgroundColor: colors.GREY.secondary, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    imageViewStyle:{ 
        borderRadius: 140/2, 
        width: 140, 
        height: 140,
        backgroundColor: colors.WHITE, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textPropStyle:{
        fontSize: 21, 
        fontWeight:'bold',
        color: colors.GREY.iconSecondary, 
        fontFamily:'Roboto-Bold', 
        top: 8,
        textTransform:'uppercase'
    },
    newViewStyle:{
        flex: 1, 
        height: 300, 
        marginTop: 40
    },
    myViewStyle:{
        flex: 1,
        left: 20, 
        marginRight: 40, 
        borderBottomColor: colors.GREY.btnSecondary, 
        borderBottomWidth: 1
    },
    iconViewStyle:{
        flex: 2, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    emailStyle:{
        fontSize: 17, 
        left: 10, 
        color: colors.GREY.btnPrimary, 
        fontFamily:'Roboto-Bold'
    },
    emailAdressStyle:{
        fontSize: 15, 
        color: colors.GREY.secondary, 
        fontFamily:'Roboto-Regular'
    },
    mainIconView:{
        flex: 1, 
        left: 20, 
        marginRight: 40, 
        borderBottomColor: colors.GREY.iconSecondary,
         borderBottomWidth: 1
        },
    text1:{
         fontSize: 17, 
         left: 10, 
         color:colors.GREY.btnPrimary, 
         fontFamily:'Roboto-Bold'
        },
    text2:{
        fontSize: 15, 
        left: 10, 
        color:colors.GREY.secondary, 
        fontFamily:'Roboto-Regular'
    },
    textIconStyle:{
        width: width, 
        height: 50, 
        backgroundColor: colors.GREY.primary, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    textIconStyle2:{
        width: width, 
        height: 50, 
        marginTop:10,
        backgroundColor: colors.GREY.primary, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
        //marginTop: StatusBar.currentHeight 
    },
    flexView1:{
        flex:1
    },
    flexView2:{
        flex:1
    },
    flexView3:{
        marginTop: 54
    },
    loadingcontainer: {
        flex: 1,
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      }
});