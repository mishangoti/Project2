const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXVu1E0U2hdQTgInRM6ZT6ox4mnKGts0zw0yxwx09OjIoFue29npp0H7ckDsD5W4lscM941yHYE-4PCz',
    'client_secret': 'EB00Da74zKwA-vv5FJ3_Z35pG0KCCtFZUptyLGO-QI5Nk2xpXl9xcqqTM4v8Ar1rpBVo0d_5yb2uzGN9'
});

router.get('/', (req, res, next) => {
    req.send('process to pay');
});


router.post('/pay', (req, res, next) => {
    console.log('this is pay');
    const host = `${req.protocol}://${req.hostname}:${port}`;
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": host + "/store/success",
            "cancel_url": host + "/store/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]
    }

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            throw error;
        } else {
            for (const i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;
