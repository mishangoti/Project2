const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            const user_id = req.session.user_id;
            const payment_status_sql = `SELECT * FROM orders_ WHERE user_id = '${user_id}' AND status = 0`;
            // const payment_status_sql = "SELECT o.id as o_id, o.order_slot_num, o.user_id as o_user_id, o.payable_amount, o.total_item_count, o.payment_status, o.pre_process_status, o.dispatch_status, o.dispatch_time, o.order_status, c.id as c_id, c.product_id as c_product_id, c.quantity, p.name as p_name, p.description as p_description, p.price, p.image FROM orders_ as o LEFT JOIN order_slot_ as os ON o.order_slot_num = os.order_slot LEFT JOIN cart as c ON os.cart_id = c.id LEFT JOIN products as p ON p.id = c.product_id WHERE o.user_id = '"+user_id+"' AND o.order_status = '1'";
            // console.log(payment_status_sql);
            // const data1 = undefined;
            db.query(payment_status_sql, (err, payment_status_result) => {
                console.log(payment_status_result);
                res.render('pages/customers/track.ejs', { payment_status_result });
            });
            // console.log(data1);
        } else {
            res.render('pages/index.ejs', { title: 'login' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});
router.post('/showproduct', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id <= 3) {
            const order_slot_num = req.body.order_slot_num_show;
            // console.log(order_slot_num);
            const show_pro_sql = `SELECT o.id as o_id, o.order_slot_num, o.user_id as o_user_id, o.payable_amount, o.total_item_count, o.payment_status, o.pre_process_status, o.dispatch_status, o.dispatch_time, o.order_status, c.id as c_id, c.product_id as c_product_id, c.quantity, p.name as p_name, p.description as p_description, p.price, p.image FROM orders_ as o LEFT JOIN order_slot_ as os ON o.order_slot_num = os.order_slot LEFT JOIN cart as c ON os.cart_id = c.id LEFT JOIN products as p ON p.id = c.product_id WHERE o.order_slot_num = '${order_slot_num}'`;
            db.query(show_pro_sql, (err, result) => {
                res.send(result);
            });
        } else {
            res.render('pages/index.ejs', { title: 'login' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/history', () => {
    // if (req.session.user_id) {
    //     if (req.session.roll_id <= 3) {
            
    //     }else{
            // res.render('pages/index.ejs', { title: 'login' });
    //     }
    // }else{
    //          res.render('pages/index.ejs', { title: 'login' });
    // }
});

module.exports = router;
