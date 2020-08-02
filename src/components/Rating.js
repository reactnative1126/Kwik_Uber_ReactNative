import React, { Component } from "react";
import {
    View,
} from "react-native";
import { Icon } from 'react-native-elements'

export default class Rating extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { rating } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                {rating >= 1 ? <Icon name='star' type='font-awesome' color='#FFF949' size={20} /> : rating >= 0.5 ? <Icon name='star-half-o' type='font-awesome' color='#FFF949' size={20} /> : <Icon name='star-o' type='font-awesome' color='#D8D8D8' size={20} />}
                {rating >= 2 ? <Icon name='star' type='font-awesome' color='#FFF949' size={20} /> : rating >= 1.5 ? <Icon name='star-half-o' type='font-awesome' color='#FFF949' size={20} /> : <Icon name='star-o' type='font-awesome' color='#D8D8D8' size={20} />}
                {rating >= 3 ? <Icon name='star' type='font-awesome' color='#FFF949' size={20} /> : rating >= 2.5 ? <Icon name='star-half-o' type='font-awesome' color='#FFF949' size={20} /> : <Icon name='star-o' type='font-awesome' color='#D8D8D8' size={20} />}
                {rating >= 4 ? <Icon name='star' type='font-awesome' color='#FFF949' size={20} /> : rating >= 3.5 ? <Icon name='star-half-o' type='font-awesome' color='#FFF949' size={20} /> : <Icon name='star-o' type='font-awesome' color='#D8D8D8' size={20} />}
                {rating >= 5 ? <Icon name='star' type='font-awesome' color='#FFF949' size={20} /> : rating >= 4.5 ? <Icon name='star-half-o' type='font-awesome' color='#FFF949' size={20} /> : <Icon name='star-o' type='font-awesome' color='#D8D8D8' size={20} />}
            </View>
        );
    }
}