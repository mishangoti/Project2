const express = require('express');
const router = express.Router();
const dateTime = require('node-datetime');


router.get('/', (req, res, next) => {
    // res.send('asedasd');
    const user_id = req.session.user_id;
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const get_my_orders_sql = `SELECT c.user_id as buyer_id, a.contact_name as address_name, a.contact_number as address_number, a.address as address_address, a.state as address_state, a.zip_code as address_zipcode, p.id as product_id, p.name as product_name, p.description as product_desctiption, c.quantity as product_quantity, p.price as product_price, p.status as product_status, o.id as order_id, o.order_slot_num as order_slot, pt.name as order_payment_method, o.payment_status as order_payment_status, o.pre_process_status as order_pre_process_status, o.dispatch_status as order_dispatch_status, o.dispatch_time as order_dispatch_time, o.order_status as order_order_status, o.status as order_status FROM orders_ as o LEFT JOIN order_slot_ as os ON o.order_slot_num = os.order_slot LEFT JOIN cart as c ON os.cart_id = c.id LEFT JOIN products as p ON c.product_id = p.id LEFT JOIN address as a ON c.user_id = a.user_id LEFT JOIN payment_type as pt ON o.payment_id = pt.id WHERE p.user_id = '${user_id}' AND o.status = '0'`;
            // console.log(get_my_orders_sql);
            db.query(get_my_orders_sql, (err, results) => {
                // console.log(results);
                res.render('pages/saller/myorders.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/update_preprocess_status', (req, res, next) => {
    // console.log('thashia');
    const status = req.body.status;
    const order_slot_num = req.body.order_slot_num;

    const sql = `UPDATE orders_ SET pre_process_status = '1' WHERE order_slot_num = '${order_slot_num}'`;
    // console.log(sql);
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(true);
    });
});

router.post('/update_dispatch_status', (req, res, next) => {
    const order_slot_num = req.body.order_slot_num;
    // const time = now();
    const dt = dateTime.create();
    const time = dt.format('Y-m-d H:M:S');
    const sql = `UPDATE orders_ SET dispatch_status = '1', dispatch_time = '${time}' WHERE order_slot_num = '${order_slot_num}'`;
    // console.log(sql);

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(true);
    });
});

router.post('/update_order_status', (req, res, next) => {
    const order_slot_num = req.body.order_slot_num;
    const sql = `UPDATE orders_ SET order_status = '2' WHERE order_slot_num = '${order_slot_num}'`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let updat_status = `UPADATE orders_ SET status = '1' WHERE order_slot_num = '${order_slot_num}'`;
            db.query(updat_status, (err, result) => {
                if (err) {
                    throw err;0
                } else {
                    res.send(true);
                }
            });
        };
    });
});
module.exports = router;
