import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';

class FCM {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    checkPermission = (onRegister) => {
        firebase.messaging().hasPermission()
            .then(enable => {
                if (enable) {
                    this.getToken(onRegister);
                } else {
                    this.requestPermission(onRegister);
                }
            }).catch(error => {
                console.log("Permission rejected ", error);
            })
    }

    getToken = (onRegister) => {
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken);
                } else {
                    console.log("User does not have a device token");
                }
            }).catch(error => {
                console.log("getToken rejected");
            })
    }

    requestPermission = (onRegister) => {
        firebase.messaging().requestPermission()
            .then(() => {
                this.getToken(onRegister);
            }).catch(error => {
                console.log("Request Permission rejected ", error);
            })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        this.notificationListener = firebase.notifications()
            .onNotification((notification) => {
                onNotification(notification);
            })

        this.notificationOpenedListener = firebase.notifications()
            .onNotificationOpened((notification) => {
                onOpenNotification(notification);
            })

        firebase.notifications().getInitialNotification()
            .then(notification => {
                if (notification) {
                    const notification = notificationOpen.notification
                    onOpenNotification(notification);
                }
            })

        this.messageListener = firebase.messaging().onMessage((message) => {
            onNotification(message);
        })

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log("New token refresh: ", fcmToken);
            onRegister(fcmToken);
        })
    }
    unRegister = () => {
        this.notificationListener();
        this.notificationOpenedListener();
        this.messageListener();
        this.onTokenRefreshListener();
    }

    buildChannel = (obj) => {
        return new firebase.notifications.Android.Channel(
            obj.channelID, obj.channelName,
            firebase.notifications.Android.Importance.High
        ).setDescription(obj.channelDes)
    }

    buildNotification = (obj) => {
        firebase.notifications().android.createChannel(obj.channel)

        return new firebase.notifications.Notification()
            .setSound(obj.sound)
            .setNotificationId(obj.dataId)
            .setTitle(obj.title)
            .setBody(obj.content)
            .setData(obj.data)

            .android.setChannelId(obj.channel.channelID)
            .android.setLargeIcon(obj.largeIcon)
            .android.setSmallIcon(obj.smallIcon)
            .android.setColor(obj.colorBgIcon)
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setVibrate(obj.vibrate)
    }

    scheduleNotification = (notification, days, minutes) => {
        const data = new Date()
        if (days) {
            date.setDate(date.getDate() + days)
        }
        if (minutes) {
            date.setMinutes(date.getMinutes() + minutes)
        }
        firebase.notifications()
            .scheduleNotification(notification, { fireDate: date.getTime() })
    }

    displayNotification = (notification) => {
        firebase.notifications().displayNotification(notification)
            .catch(error => console.log("Display Notification error: ", error))
    }

    removeDeliveredNotification = (notification) => {
        firebase.notifications()
            .removeDeliveredNotification(notification.notificationId)
    }
}

export const fcm = new FCM()