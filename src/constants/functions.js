export const navOptionHandler = () => ({
    headerShown: false,
    animationEnabled: false,
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
    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'accept-encoding': 'gzip, deflate',
            'host': 'exp.host'
        },
        body: JSON.stringify({
            "to": token,
            "title": title,
            "body": body,
            "data": data,
            "priority": "high",
            "sound": "default",
            "channelId": "messages"
        }),
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => { console.log(error) });
}



