const functions = require('firebase-functions');

const stripe = require('stripe')(
  'sk_test_51H4SlIKXmerujVEWDKLZ6b2uoM',
);

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    stripe.charges
      .create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: request.body.token,
      })
      // eslint-disable-next-line promise/always-return
      .then((charge) => {
        response.send(charge);
      })
      .catch((error) => {
        console.log(error);
      });
  },
);
