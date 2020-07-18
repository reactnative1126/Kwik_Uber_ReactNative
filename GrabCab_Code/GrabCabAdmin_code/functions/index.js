const functions = require('firebase-functions');

/************   STRIPE STARTS HERE  ***************/

const stripe = require('stripe')('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
const stripe_public_key = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

exports.create_stripe_session = functions.https.onRequest((request, response) => {
    stripe.checkout.sessions.create(
        request.body.session_data,
        (err, session) => {
            if (err) {
                response.send({ "error": err });
            } else if (session) {
                response.send(session);
            } else {
                response.send({ "error": "Some other problem" })
            }
        }
    );
});

exports.create_stripe_link = functions.https.onRequest((request, response) => {
    response.send(`
    <html>
        <head>
        <head> 
        <title>Stripe Checkout</title>
        </head>
        <body>
        <script src="https://js.stripe.com/v3"></script>
        <h1>Loading...</h1>
        <div id="error-message"></div>
        <script>
            (function () {
            var stripe = Stripe('${stripe_public_key}');
            window.onload = function () {
                stripe.redirectToCheckout({
                    sessionId: '${request.query.session_id}'
                })
                .then(function (result) {
                    if (result.error) {
                    var displayError = document.getElementById('error-message');
                    displayError.textContent = result.error.message;
                    }
                });
            };
            })();
        </script>
        </body>
    </html>
    `);
});

exports.success_stripe = functions.https.onRequest((request, response) => {
    stripe.checkout.sessions.retrieve(
        request.query.session_id,
        (err, session) => {
            if (err) {
                console.log(err);
                response.send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Cancelled</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/cancel-47588_960_720.png' alt='Icon'> <h3>Your Payment Failed</h3> <h4>Please try again.</h4></p></div> </div></body></html>");
            } else if (session) {
                response.status(200).send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Success</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/accept-47587_960_720.png' alt='Icon'> <h3>Your Payment was Successfull</h3> <h6>Order Ref No : " + session.metadata.order_id + "</h6> <h4>Thank you for your payment.</h4> </div> </div> </body></html>");
            } else {
                response.send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Cancelled</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/cancel-47588_960_720.png' alt='Icon'> <h3>Your Payment Failed</h3> <h4>Please try again.</h4></p></div> </div></body></html>");
            }
        }
    );
});

exports.cancel_stripe = functions.https.onRequest((request, response) => {
    response.send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Cancelled</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/cancel-47588_960_720.png' alt='Icon'> <h3>Your Payment Failed</h3> <h4>Please try again.</h4></p></div> </div></body></html>");
});

/******************* STRIPE ENDS HERE ***********************/

/******************* BRAINTREE STARTS HERE ******************/

const braintree = require("braintree");

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox, // either Sandbox or Production
    merchantId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // these come from the Lambda's environmental variables
    publicKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    privateKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

exports.get_braintree_token = functions.https.onRequest((request, response) => {
    gateway.clientToken.generate({
    }, (err, res) => {
        if (err) {
            console.log(err);
            response.send({ "error": err });
        } else if (res) {
            response.send({ token: res.clientToken });
        } else {
            response.send({ "error": "Some other error" });
        }
    });
});

exports.create_braintree_link = functions.https.onRequest((request, response) => {
    var full_url = request.protocol + "://" + request.get('host');
    var success_url = full_url + "/success_braintree?order_id=" + request.query.order_id + "&amount=" + request.query.amount;
    var cancel_url = full_url + "/cancel_braintree";
    response.send(`
    <html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://js.braintreegateway.com/web/dropin/1.22.0/js/dropin.min.js"></script>
        <title>Braintree Payment Checkout</title>
    </head>
    
    <body>
        <div id="dropin-container"></div>
        <div style="width:100%;height:60px;margin: 0 auto">
            <center>
                <button id="submit-button"
                    style="padding: 10px;padding-left: 100px;padding-right: 100px;font-size:16px;color: #fff;background-color:red;font-size:18px;background: #00c4ff;border-radius: 6px;box-shadow:none;border:0;">Pay</button>
            </center>
        </div>
        <script>
            var button = document.querySelector('#submit-button');
            var dropinInstance;
            braintree.dropin.create({
                authorization: '${request.query.token}',
                container: '#dropin-container',
                paypal: {
                    flow: 'checkout',
                    amount: '${request.query.amount}',
                    currency: '${request.query.currency}'
                }
            }, (createErr, instance) => {
                if (instance) {
                    dropinInstance = instance;
                    dropinInstance.on('paymentMethodRequestable', event => {
                        if (event.paymentMethodIsSelected) {
                            dropinInstance.requestPaymentMethod((err, payload) => {
                                if (!err) {
                                    console.log(payload.nonce);
                                    window.ReactNativeWebView.postMessage(payload.nonce);
                                    button.style.display="none";
                                }
                                if (err) {
                                    dropinInstance.clearSelectedPaymentMethod();
                                    window.ReactNativeWebView.postMessage("Error");
                                    button.style.display="block";
                                }
                            });
                        }
                    });

                    button.addEventListener('click', ()=>{
                        dropinInstance.requestPaymentMethod((err, payload) => {
                            if (!err) {
                                console.log(payload.nonce);
                                window.ReactNativeWebView.postMessage(payload.nonce);
                                button.style.display="none";
                            }
                            if (err) {
                                dropinInstance.clearSelectedPaymentMethod();
                                window.ReactNativeWebView.postMessage("Error");
                                button.style.display="block";
                            }
                        });
                    });
                }
                if (createErr) {
                    console.log(createErr);
                }
            });

    
            window.addEventListener("message", message => {
                if (message.data == "payment_success") {
                    window.open("${success_url}", "_self");
                }
                if (message.data == "payment_failed") {
                    window.open("${cancel_url}", "_self");
                }
            });
    
            document.addEventListener("message", message => {
                if (message.data == "payment_success") {
                    window.open("${success_url}", "_self");
                }
                if (message.data == "payment_failed") {
                    window.open("${cancel_url}", "_self");
                }
            });
    
        </script>
    </body>
    
    </html>
    `);
});

exports.process_braintree_payment = functions.https.onRequest((request, response) => { 
    gateway.transaction.sale(
        {
            amount: request.body.amount,
            paymentMethodNonce: request.body.nonce,
            options: {
                submitForSettlement: true
            }
        },
        (err, res) => {
            if (err) {
                console.log({ err });
                response.send({ error: err })
            } else {
                console.log(res);
                if (res.success === false) {
                    response.send({ success: false, msg: "Error validating payment server information" });
                } else {
                    response.send({ success: true });
                }
            }
        }
    );
});

exports.success_braintree = functions.https.onRequest((request, response) => {
    response.status(200).send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Success</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/accept-47587_960_720.png' alt='Icon'> <h3>Your Payment of <strong>" + request.query.amount +"</strong> was Successfull</h3> <h6>Order Ref No : " + request.query.order_id + "</h6> <h4>Thank you for your payment.</h4> </div> </div> </body></html>");
});

exports.cancel_braintree = functions.https.onRequest((request, response) => {
    response.send("<!DOCTYPE HTML><html><head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Payment Cancelled</title> <style> body { font-family: Verdana, Geneva, Tahoma, sans-serif; } .container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px 0; } .contentDiv { padding: 40px; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3); border-radius: 10px; width: 70%; margin: 0px auto; text-align: center; } .contentDiv img { width: 140px; display: block; margin: 0px auto; margin-bottom: 10px; } h3, h6, h4 { margin: 0px; } .contentDiv h3 { font-size: 22px; } .contentDiv h6 { font-size: 13px; margin: 5px 0; } .contentDiv h4 { font-size: 16px; } </style></head><body> <div class='container'> <div class='contentDiv'> <img src='https://cdn.pixabay.com/photo/2012/05/07/02/13/cancel-47588_960_720.png' alt='Icon'> <h3>Your Payment Failed</h3> <h4>Please try again.</h4></p></div> </div></body></html>");
});

/****************** BRAINTREE ENDS HERE ******************/