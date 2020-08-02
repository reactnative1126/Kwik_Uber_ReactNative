const functions = require('firebase-functions');
exports.sendPushNotification = functions.https.onRequest(
  (request, response) => {
    var token = request.token;
    return token;
  },
);

// const admin = require('firebase-admin');
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://kwik-35758.firebaseio.com',
// });

// exports.sendPushNotification = functions.https.onRequest(
//   (request, response) => {
//     var token = request.token;
//     const payload = {
//       notification: {
//         title: 'request.title',
//         body: 'request.body',
//         sound: 'default',
//         badge: '1',
//       },
//       // data: request.data,
//     };
//     const options = {
//       priority: 'high',
//       timeToLive: 60 * 60 * 24,
//     };

//     return admin.messaging().sendToDevice({
//       registrationToken: token,
//       payload: payload,
//       options: options,
//     });
//   },
// );
