import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import { 
    StyleSheet,
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
    Image
  } from 'react-native';
  var {width} = Dimensions.get('window');
  import * as firebase from 'firebase';
  import  languageJSON  from '../common/language';

export default class AboutPage extends React.Component {
    constructor(props){
        super(props);
        this.state={}
        const about=firebase.database().ref('About_Us/');
        about.on('value',aboutData=>{
            if(aboutData.val()){
                let data = aboutData.val()
                this.setState(data);
            }
        })
    }
    render() {  
        return (
        
            <View style={styles.mainView}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.about_us}</Text>}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
                <View>
                <ScrollView styles={{marginTop:10}}>
                    <Text style={styles.aboutTitleStyle}>{this.state.heading?this.state.heading:null}</Text>
                    <View style={styles.aboutcontentmainStyle}>
                    <Image
                      style={{width: '100%', height: 150}}
                      source={require('../../assets/images/about_us.png')}
                    />
                    
                    <Text style={styles.aboutcontentStyle}>
                       
                       {this.state.contents?this.state.contents:null}
                    </Text>
                    <Text style={styles.aboutTitleStyle}>{languageJSON.contact_details}</Text>
                    <View style={styles.contact}>
                        <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>  
                            <Text style={styles.contacttype1}>{languageJSON.email}</Text>
                            <Text style={styles.contacttype1}> {this.state.email?this.state.email:null}</Text>
                        </View>      
                        <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                            <Text style={styles.contacttype2}>{languageJSON.phone}</Text>
                            <Text style={styles.contacttype1}> {this.state.phone?this.state.phone:null}</Text>
                        </View>
                    </View>               
                 </View>
                </ScrollView>
               </View>
           </View>
           
        );
      }
    
}
const styles = StyleSheet.create({
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
        //marginTop: StatusBar.currentHeight,
    } ,
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    aboutTitleStyle:{
        color: colors.BLACK,
        fontFamily:'Roboto-Bold',
        fontSize: 20,
        marginLeft:8,
        marginTop:8
    },
    aboutcontentmainStyle:{
        marginTop:12,
        marginBottom:60
    },
    aboutcontentStyle:{
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Regular',
        fontSize: 15,
        textAlign: "justify",
        alignSelf:'center',
        width:width-20,
        letterSpacing:1,
        marginTop:6,
    },
    contact:{
        marginTop:6,
        marginLeft:8,
        //flexDirection:'row',
        width:"100%",
        marginBottom:30
    },
    contacttype1:{
        textAlign:'left',
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Bold',
        fontSize: 15,
    },
    contacttype2:{
        textAlign:'left',
        marginTop:4,
        color: colors.GREY.secondary,
        fontFamily:'Roboto-Bold',
        fontSize: 15,
    }
})