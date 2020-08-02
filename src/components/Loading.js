import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    Modal
} from 'react-native';
import { colors } from '@constants/theme';
import images from '@constants/images';

export default class Loading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { loading } = this.props;
        return (
            <Modal animationType="fade" transparent={true} visible={loading} >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 80, height: 80, backgroundColor: "#FFFFFF", borderRadius: 10}}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
                            <Image
                                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                                source={images.img_loading}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}