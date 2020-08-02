import React from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet} from 'react-native';
import { colors } from '../common/theme';
import  languageJSON  from '../common/language';
export default class TaskListIgnorePopup extends React.Component{
    state = {
        modalVisible: false,
    };
    
    //modal visibility on and off
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    
    render() {
        return (
            <View style={styles.modalPage}>
                <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                    <View style={styles.modalMain}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeading}>
                                <Text style={styles.alertStyle}>{languageJSON.alert}</Text>
                            </View>
                            <View style={styles.modalBody}>
                                <Text style={styles.igonoreJobText}>{languageJSON.job_ignore}</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableHighlight
                                    style={[styles.btnStyle, styles.clickStyle]}
                                    onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                    }}>
                                    <Text style={styles.cancelStyle}>{languageJSON.cancel}</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={styles.btnStyle}
                                    onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)                            
                                    }}>
                                    <Text style={styles.okTextView}>{languageJSON.ok}</Text>
                                </TouchableHighlight>
                            </View>                  
                        </View>
                    </View>
                </Modal>
        
                <TouchableHighlight onPress={() => { this.setModalVisible(true); }}>
                    <Text>{languageJSON.show_modal}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

//Screen Styling
const styles = StyleSheet.create({
    modalPage: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalMain: {
        flex: 1,
        backgroundColor: colors.GREY.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '90%',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        flex: 1,
        maxHeight: 260
    },
    modalHeading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
         flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopColor: colors.GREY.iconPrimary,
        borderTopWidth: 1,
        width: '100%',
        flex: 1
    },
    btnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    alertStyle:{
        fontWeight: 'bold', 
        fontSize: 18,
        width:'100%',
        textAlign:'center'
    },
    cancelStyle:{
        color: colors.BLUE.default, 
        fontSize: 18, 
        fontWeight: 'bold'
    },
    igonoreJobText:{
        fontSize: 16
    },
    clickStyle:{ 
        borderRightColor: colors.GREY.iconPrimary, 
        borderRightWidth: 1
    },
    okTextView:{
        color: colors.BLUE.default, 
        fontSize: 18, 
        fontWeight: 'bold'
    }
})
