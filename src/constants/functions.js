import axios from 'axios';
import configs from './configs';

export const navOptionHandler = () => ({
    headerShown: false,
    animationEnabled: false,
    gesturesEnabled: false
});

export const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
        return true;
    }
    return false;
}

export const verifyPhone = (value) => {
    var phoneRex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/im;
    if (phoneRex.test(value)) {
        return true;
    }
    return false;
}

export const verifyAlias = (value) => {
    var aliasRex = /^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/;
    if (aliasRex.test(value)) {
        return true;
    }
    return false;
}

export const verifyLength = (value, length) => {
    if (value.length >= length) {
        return true;
    }
    return false;
}


export function SendPushNotification(token, title, body, data) {
    axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAv85oABk:APA91bE79ukX5VyYu3d_tDIV_z2dcOZ5xBQ0niseDJYHp7rUeJ4YhkbV0bvyiUehyobBpzQOdUh1UEsvy2_p_Hm-fbtxMxubL9Hs9nlWW5DaVGzUDdz1rteTTh9NiGsm64n2z8FJG5TX'
        },
        data: { 
            to: token, 
            notification: {
                title: title, 
                body: body, 
                data: data 
            }
        },
    }).then((response) => {
        console.log(response);
    });
}


