const functions = require('firebase-functions');
// const stripe = require('stripe')('sk_test_51Gv5A8JVSIGR903OfwZzndCNNLaE4rC1EmiDTgR5gISkqaFxA4OZZ0PISZYvO3DAmU6nb1sayDfEBFPJxOZkq33x00PAc70aSd');

// exports.paymentWithStripe = functions.https.onRequest((request, response) => {
//    stripe.charges.create({
//       amount: request.body.amount,
//       currency: request.body.currency,
//       source: request.body.token
//     }).then((charge) => {
//       response.send(charge);
//     })
//     .catch(error =>{
//         console.log(error);
//     });
// });

const admin = require('firebase-admin');
admin.initializeApp({
  // credential: admin.credential.cert({ }),
  databaseURL: "https://kwik-35758.firebaseio.com"
});
exports.sendPushNotification = functions.https.onRequest((request, response) => {
    const payload = {
        token: request.token,
        notification: {
          title: request.title,
          body: request.body,
          sound: 'default',
          badge: '1',
        },
        data: request.data
      };
  
    return admin
      .messaging()
      .sendToDevice(payload.token, payload)
      .then(function(response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function(error) {
        console.log("Notification sent failed:", error);
      }); 
});