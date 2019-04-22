const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const order = "SELECT o.id, o.user_id, o.address_id, o.cart_id, o.status, o.dispatch_status, o.payment_id, o.payment_status, a.contact_name, a.contact_number, a.address, a.state, a.zip_code, c.product_id, c.quantity, p.name, p.price, u.email FROM orders AS o LEFT JOIN address AS a ON o.address_id = a.id LEFT JOIN cart AS c ON o.cart_id = c.id LEFT JOIN products AS p ON c.product_id = p.id LEFT JOIN users AS u ON o.user_id = u.id";
            db.query(order, (err, results) => {
                console.log(results);
                res.render('pages/admin/order.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

// router.post('/', (req, res, next)=>{
//     if(req.session.user_id){

//     } else {
//         res.render('pages/index.ejs', { title: 'login' });        
//     }
// });
router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    const sql = `DELETE FROM users WHERE id = '${id}'`;
    // const sql = `DELETE FROM users WHERE id='${id}'`;

    // console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            //   return res.status(500).send(err);

            res.redirect('/customers');
            return;
        }
        res.redirect('/customers');
    });
});
module.exports = router;

