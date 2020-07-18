import React, { Component } from "react";
import {
    StyleSheet,
    View,
    AsyncStorage
} from "react-native";
import Toast, { DURATION } from 'react-native-easy-toast';

import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { signOut } from '@modules/account/actions';
import { Loading } from '@components';
import { verifyEmail, verifyLength } from '@constants/functions';
import { theme, colors } from '@constants/theme';
import images from '@constants/images';
import configs from '@constants/configs';
import language from '@constants/language';
import API from '@services/API';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({ loading: true });
        API.post('/user_logout', {
            user_id: this.props.user_info.user_id,
            api_token: this.props.user_info.api_token
        }).then((resp) => {
            if (resp.data.success == 1) {
                AsyncStorage.removeItem('logged');
                AsyncStorage.removeItem('user_info');
                this.props.signOut(false);     
                this.setState({ loading: false });   
                this.props.navigation.reset({ routes: [{ name: 'Auth' }] });
            } else {
                this.setState({ loading: false });
                this.refs.toast.show(resp.data.message, DURATION.LENGTH_LONG);
            }
        }).catch((error) => {
            this.setState({ loading: false });
            this.refs.toast.show(error.message, DURATION.LENGTH_LONG);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Loading loading={this.state.loading} />
                <Toast ref="toast" position='top' positionValue={50} fadeInDuration={750} fadeOutDuration={1000} opacity={0.8} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = state => {
    return {
        user_info: state.account.user_info,
        device_token: state.account.device_token
    }
}
const mapDispatchToProps = dispatch => {
    return {
        signOut: (data) => {
            dispatch(signOut(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout)
