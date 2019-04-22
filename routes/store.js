const express = require('express');
const router = express.Router();
const views = require('../config/viewcounter');
// require('dotenv').config();
const config = require('../config');

// let order = require('../controllers/order');

const randomstring = require("randomstring");

const paypal = require('paypal-rest-sdk');

// console.log();

paypal.configure({
    'mode': config.paypal.payment_mode, //sandbox or live
    'client_id': config.paypal.paypal_client_id,
    'client_secret': config.paypal.paypal_client_secret
});

const nodemailer = require('nodemailer');
// let config = require('./mailer.conf');

console.log('Creating Transport');

// this is for mailtrap.io
// smtp transport configuration
const smtpTransport = nodemailer.createTransport({
    host: config.mail.mail_service,
    port: config.mail.mail_port,
    auth: {
        user: config.mail.mail_user,
        pass: config.mail.mail_pass
    }
});
// this is for gmail
// let smtpTransport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "mishan2512@gmail.com",
//         pass: "fysbzkhekuaxejre"
//     }
// });

router.get('/', (req, res, next) => {
    // view count
    views.viewcount();
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            // get cart poroduct of perticuler user
            let cart_product_sql = `select quantity from cart WHERE user_id = '${req.session.user_id}' AND cart_status = '0'`;
            console.log(cart_product_sql);
            let cart_count = 0;
            db.query(cart_product_sql, (err, results) => {
                results.forEach(element => {
                    cart_count = cart_count + element.quantity;
                });
            });

            let product_sql = `SELECT p.id as pro_id, p.name as pro_name, p.description as pro_description, p.price as pro_price, p.stock as pro_stock, p.image as pro_image, c.id as cat_id, c.name as cat_name, c.description as cat_description FROM products AS p LEFT JOIN categorys AS c ON c.id = p.category_id WHERE p.status = 1`;
            db.query(product_sql, (err, results) => {
                let category_sql = `SELECT * FROM categorys`;
                db.query(category_sql, (err, category) => {
                    console.log(category);
                    res.render('pages/customers/index.ejs', {
                        results,
                        cart_count,
                        category,
                        info_message: req.flash('info')
                    });

                });
            });
        } else {
            res.render('pages/index.ejs', { title: 'login' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            // get cart poroduct of perticuler user
            let cart_product_sql = `select quantity from cart WHERE user_id = '${req.session.user_id}'`;
            let cart_count = 0;
            db.query(cart_product_sql, (err, results) => {
                results.forEach(element => {
                    cart_count = cart_count + element.quantity;
                });
            });

            let keyword = req.body.searchbox;
            console.log(keyword);
            let product_sql = `SELECT DISTINCT pro.id as pro_id, pro.user_id, pro.name as pro_name, pro.description, pro.category_id, pro.price as pro_price, pro.status as pro_status, pro.stock as pro_stock, pro.image as pro_image, cat.name as cat_name, cat.status as cat_status FROM products as pro LEFT JOIN categorys as cat ON pro.category_id = cat.id LEFT JOIN users as u ON pro.user_id = u.id LEFT JOIN product_tags as pt ON pro.id = pt.product_id WHERE pro.name LIKE '%${keyword}%' OR pro.description LIKE '%${keyword}%' OR cat.name LIKE '%${keyword}%' OR cat.description LIKE '%${keyword}%' OR pt.tag_name LIKE '%${keyword}%'`;
            db.query(product_sql, (err, results) => {
                let category_sql = `SELECT * FROM categorys`;
                db.query(category_sql, (err, category) => {
                    console.log(category);
                    res.render('pages/customers/index.ejs', { results, cart_count, category });
                });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/cart', (req, res, next) => {
    // console.log(__dirname);
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            let user_id = req.session.user_id;
            let empty_cart_sql = `SELECT * FROM cart WHERE user_id = '${user_id}' AND cart_status = '0'`;
            console.log(empty_cart_sql);
            db.query(empty_cart_sql, (err, empty_cart_sql_result) => {
                if (typeof empty_cart_sql_result != 'undefined' && empty_cart_sql_result[0] != null) {
                    let cart_sql = `SELECT c.id, c.product_id, c.quantity, p.id, p.name, p.description, p.stock, p.price FROM cart AS c LEFT JOIN products AS p ON c.product_id = p.id WHERE c.user_id = '${user_id}' AND c.cart_status = '0'`;
                    db.query(cart_sql, (err, results) => {
                        let sql = `SELECT * FROM address WHERE user_id = '${user_id}'`;
                        db.query(sql, (err, address) => {
                            // console.log(results);
                            res.render('pages/customers/cart.ejs', { results, address, empty: false });
                        });
                    });
                } else {
                    res.render('pages/customers/cart.ejs', { empty: true });
                }
            });
        } else {
            res.render('pages/index.ejs', { title: 'login' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/checkout', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            res.render('pages/customers/checkout.ejs');
        } else {
            res.render('pages/index.ejs', { title: 'login' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/addtocart/:id', (req, res, next) => {
    let pro_id = req.params.id;
    let user_id = req.session.user_id;

    let check_availability_sql = `SELECT * FROM cart WHERE user_id = '${user_id}' AND product_id='${pro_id}' AND cart_status = '0'`;
    let old_quantity = null;
    // console.log(check_availability_sql);
    db.query(check_availability_sql, (err, results) => {
        // console.log(results);      
        if (typeof results[0] !== 'undefined' && results.length >= 0) {
            results.forEach(element => {
                old_quantity = element.quantity;
                // console.log(old_quantity);
            });
            old_quantity++;
            let update_sql = `UPDATE cart SET quantity= '${old_quantity}' WHERE user_id = '${user_id}' AND product_id='${pro_id}'`;
            db.query(update_sql, (err, results) => {
                req.flash('info', 'Product qunatity updated to cart!');
                res.redirect('/store');
            });
        } else {
            let insert_sql = `INSERT INTO cart(user_id, product_id) VALUES ('${user_id}','${pro_id}')`;
            db.query(insert_sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    req.flash('info', 'Product added to cart!');
                    res.redirect('/store');
                }
            });
        }
    });


    // console.log(sql);
    // db.query(sql, (err, result) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.redirect('/store');
    // });
});

router.post('/updatecart', (req, res, next) => {
    cart_id = req.body.cart_id;
    quantity = req.body.quantity;
    // console.log(cart_id);
    // console.log(quantity);
    let update_cart_sql = `UPDATE cart SET quantity='${quantity}' WHERE product_id = '${cart_id}'`;
    // console.log(update_cart_sql);
    db.query(update_cart_sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

    });
});

router.post('/pay', (req, res, next) => {
    let host = `${req.protocol}://${req.hostname}:${port}`;
    let user_id = req.session.user_id;

    // geting items which user is trying to buy
    let get_cart = `SELECT c.id as c_id, c.quantity as c_quantity, c.cart_status as c_cart_status, p.id as p_id, p.name as p_name, p.description as p_description, p.stock as p_stock, p.price as p_price, p.status as p_status FROM cart as c LEFT JOIN products as p ON c.product_id = p.id WHERE c.user_id = '${user_id}' AND c.cart_status = '0'`;
    console.log(get_cart);
    db.query(get_cart, (err, results) => {
        if (typeof results[0] !== 'undefined' && results.length >= 0) {
            // console.log(results);
            let pro_total = null;
            let sub_total = 0;
            results.forEach((element, index) => {
                pro_total = element.c_quantity * element.p_price;
                sub_total = sub_total + pro_total;
                // console.log(sub_total);
            });
            console.log(sub_total);
            if (sub_total <= 500) {
                sub_total = sub_total + 50;
            }
            // creating jsone data object
            let create_payment_json = {
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
                        // "items": [{
                        //     "name": "hat",
                        //     "description": "Brown hat.",
                        //     "quantity": "1",
                        //     "price": "10",
                        //     // "tax": "0.01",
                        //     "sku": "1",
                        //     "currency": "USD"
                        // }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": "" + sub_total + ""
                    },
                    "description": "Every products are avilable here"
                }]
            }
            // console.log(create_payment_json);

            // redirect to payment page from paypal and sending jsone data object with items amount
            paypal.payment.create(create_payment_json, (error, payment) => {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        } else {
            res.send('Cart is empty');
        }
    });
});

router.get('/success', (req, res) => {
    let user_id = req.session.user_id;
    let payerId = req.query.PayerID;
    let paymentId = req.query.paymentId;
    let address_id = undefined;
    let randome_order_slot = randomstring.generate(14);

    let get_cart = `SELECT c.id as c_id, c.quantity as c_quantity, c.cart_status as c_cart_status, p.id as p_id, p.name as p_name, p.description as p_description, p.stock as p_stock, p.price as p_price, p.status as p_status FROM cart as c LEFT JOIN products as p ON c.product_id = p.id WHERE c.user_id = '${user_id}' AND c.cart_status = '0'`;
    console.log(get_cart);
    db.query(get_cart, (err, results) => {
        console.log(results);
        let pro_total = null;
        let sub_total = 0;
        results.forEach((element, index) => {
            pro_total = element.c_quantity * element.p_price;
            sub_total = sub_total + pro_total;
            console.log(sub_total);
        });
        // console.log(sub_total);
        if (sub_total <= 500) {
            sub_total = sub_total + 50;
        }
        let execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "" + sub_total + ""
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                let get_cart = `SELECT * FROM cart WHERE user_id = '${user_id}' AND cart_status = '0'`;
                db.query(get_cart, (err, get_cart_result) => {
                    get_cart_result.forEach(element => {
                        // console.log(element.id);
                        const cart_id = element.id;
                        // console.log(cart_id);
                        // insert new order in to order
                        let sql = `INSERT INTO order_slot_ (order_slot, user_id, cart_id) VALUES ('${randome_order_slot}','${user_id}','${cart_id}')`;
                        // console.log(sql);
                        db.query(sql, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('order');

                            }
                        });
                        // set cart_status to 1
                        let update_status_cart = `UPDATE cart SET cart_status= '1' WHERE user_id = '${user_id}'`;
                        db.query(update_status_cart, (err, update_cart_sql_result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('cart is 1');
                            }
                        });


                        // diduct products
                        let select_order_slot_sql = `SELECT * FROM order_slot_ WHERE cart_id = ${cart_id}`;
                        db.query(select_order_slot_sql, (err, select_order_slot_result) => {
                            console.log(select_order_slot_result);
                            console.log(select_order_slot_result[0][0]);
                            console.log(select_order_slot_result[0][1]);
                            let update_order_sql = `UPDATE order_ SET status = 1 WHERE order_slot = ${select_order_slot_result.order_slot}`;
                            console.log(update_order_sql);
                        });
                        // add to oreder
                        // sql for get order_solt from order_slot_
                    });
                    let get_order_slot_sql = `SELECT DISTINCT order_slot, user_id FROM order_slot_ WHERE user_id = '${user_id}' AND order_slot_status = '0'`;
                    // console.log(get_order_slot_sql);
                    db.query(get_order_slot_sql, (err, get_order_slot_sql_results) => {
                        // console.log(get_order_slot_sql_results);
                        // add orders
                        get_order_slot_sql_results.forEach(element => {
                            let order_slot_num = element.order_slot;
                            let order_user_id = element.user_id;
                            // console.log(order_slot_num);
                            // console.log(order_user_id);

                            let get_payable_sql = `SELECT c.quantity, p.price FROM order_slot_ as os LEFT JOIN cart as c ON os.cart_id = c.id LEFT JOIN products as p ON c.product_id = p.id WHERE os.order_slot = '${order_slot_num}'`;
                            db.query(get_payable_sql, (err, get_payable_sql_result) => {
                                let total_quantity = 0;
                                let total_amount = 0;
                                get_payable_sql_result.forEach(item => {
                                    // console.log(item);

                                    let quantity = item.quantity;
                                    let price = item.price;
                                    // console.log(quantity);
                                    // console.log(price);
                                    total_quantity = total_quantity + quantity;
                                    pro_amount = quantity * price;
                                    total_amount = total_amount + pro_amount;
                                });

                                // console.log(total_amount);
                                let enter_order_sql = `INSERT INTO orders_ (order_slot_num, user_id, payable_amount, total_item_count, payment_id, payment_status) VALUES ('${order_slot_num}','${order_user_id}','${total_amount}','${total_quantity}','2','1')`;
                                // console.log(enter_order_sql);
                                db.query(enter_order_sql, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        let change_status_order_slot_sql = `UPDATE order_slot_ SET order_slot_status = '1' WHERE user_id = '${user_id}' AND order_slot_status = '0'`;
                                        db.query(change_status_order_slot_sql, (err, results) => {

                                        });
                                    }
                                });
                            });
                        });
                    });
                    // this is for mailtrap.io
                    //Message
                    let message = {
                        from: "me@localhost.com",
                        replyTo: "me@localhost.com",
                        to: "me@localhost",
                        subject: "hello this is test from mishan"
                    };
                    // this is for gmail
                    // let message = {
                    //     from: "mishan2512@gmail.com",
                    //     replyTo: "mishan2512@gmail.com",
                    //     to: "mishan2512@gmail.com",
                    //     subject: "hello this is test from mishan"
                    // };

                    console.log('Sending Mail');
                    // Send mail
                    smtpTransport.sendMail(message, (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message sent successfully!');
                            console.log('Server responded with "%s"', info.response);
                        }
                        console.log('Closing Transport');
                        smtpTransport.close();
                    });
                    res.redirect('/track');
                });
            }
        });
    });



});

router.get('/cancel', (req, res) => res.send('Cancelled'));

router.post('/address', (req, res, next) => {
    let contact_name = req.body.contact_name;
    let contact_number = req.body.contact_number;
    let address = req.body.address;
    let state = req.body.state;
    let zip_code = req.body.zip_code;
    let user_id = req.session.user_id;

    let sql = `INSERT INTO address (user_id, contact_name, contact_number, address, state, zip_code) VALUES ('${user_id}','${contact_name}','${contact_number}','${address}','${state}','${zip_code}')`;
    db.query(sql, (err, result) => {
        res.redirect('/store/cart');
    });

    console.log(sql);
    console.log(state);
    console.log(zip_code);
});


router.get('/address/delete/:id', (req, res, next) => {
    let id = req.params.id;
    let sql = `DELETE FROM address WHERE id = '${id}'`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/store/cart');
    });
});

router.get('/delete/:id', (req, res, next) => {
    let user_id = req.session.user_id;
    let pro_id = req.params.id;
    let sql = `DELETE FROM cart WHERE user_id = '${user_id}' AND product_id = '${pro_id}'`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/store/cart');
    });
});

module.exports = router;
