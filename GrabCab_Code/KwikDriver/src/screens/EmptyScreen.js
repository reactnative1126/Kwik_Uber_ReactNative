import React from 'react';
import { EmptyNotification } from '../components';
import  languageJSON  from '../common/language';
import { 
    StyleSheet,
    View,
    StatusBar,
    AsyncStorage
  } from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';

export default class EmptyNotificationPage extends React.Component {
    constructor(props){
        super(props);
    }

  _changePage = async () => {
    await AsyncStorage.clear();
  }
  render() {
    return (
        <View  style={styles.mainView}>
            <Header 
                backgroundColor={colors.GREY.default}
                leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.toggleDrawer();} }}
                centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.my_rides}</Text>}
                rightComponent={{icon:'ios-notifications', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{} }}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.inrContStyle}
            />
            <EmptyNotification></EmptyNotification>
        </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    mainView: {
        flex:1, 
        backgroundColor: colors.WHITE, 
        //marginTop: StatusBar.currentHeight
    },
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
    inrContStyle:{
        marginLeft:10, 
        marginRight: 10
    }
   
});
