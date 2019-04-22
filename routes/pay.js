const express = require('express');
const router = express.Router();
const views = require('../config/viewcounter');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXVu1E0U2hdQTgInRM6ZT6ox4mnKGts0zw0yxwx09OjIoFue29npp0H7ckDsD5W4lscM941yHYE-4PCz',
    'client_secret': 'EB00Da74zKwA-vv5FJ3_Z35pG0KCCtFZUptyLGO-QI5Nk2xpXl9xcqqTM4v8Ar1rpBVo0d_5yb2uzGN9'
});


router.post('/pay', (req, res, next) => {

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
    const user_id = req.session.user_id;
    const address_id = undefined;
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

            const address_order = `SELECT id FROM address WHERE user_id = '${user_id}'`;
            db.query(address_order, (err, result) => {
                result.forEach(element => {
                    address_id = element.id;
                    // console.log(element.id);
                    // console.log(address_id);
                });

                const get_cart = `SELECT * FROM cart WHERE user_id = '${user_id}' AND cart_status = '0'`;
                db.query(get_cart, (err, get_cart_result) => {
                    get_cart_result.forEach(element => {
                        // console.log(element.id);
                        const cart_id = element.id;
                        console.log(cart_id);
                        // insert new order in to order
                        const sql = `INSERT INTO orders (user_id, address_id, cart_id, payment_id, payment_status) VALUES ('${user_id}', '${address_id}','${cart_id}', '2', '1')`;
                        console.log(sql);
                        db.query(sql, (err, results) => {
                            console.log('order done');
                        });

                        // set cart_status to 1
                        const update_status_cart = `UPDATE cart SET cart_status= '1' WHERE user_id = '${user_id}'`;
                        db.query(update_status_cart, (err, update_cart_sql_result) => {
                            res.redirect('/track');
                        });
                    });
                });
            });
        }
    });
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;
