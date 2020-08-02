import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Modal
} from 'react-native';
import { colors } from '@constants/theme';

export default class Loading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { loading, title } = this.props;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
                            <Image
                                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                                source={require('@assets/images/loader.gif')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#000", fontSize: 16, }}>{title}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}