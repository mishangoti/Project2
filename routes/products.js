const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const sql = `SELECT products.id, products.name, products.description, products.stock, products.price, products.status, categorys.name AS category_name FROM products LEFT JOIN categorys ON products.category_id = categorys.id`;
            db.query(sql, (err, results) => {
                res.render('pages/admin/product.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
    // req.send('retailer');
});

// router.get('/edit/:id', (req, res, next)=> {
//     if(req.session.user_id){
//         const id = req.params.id;
//         const sql = "SELECT * FROM products WHERE id = '"+id+"'";
//         // console.log(sql);
//         db.query(sql, (err, results)=>{
//             console.log(results);
//             res.render('pages/admin/editproduct.ejs', {results});
//         });
//       }else{
//         res.render('pages/index.ejs', { title: 'login' });
//     }
//     // req.send('retailer');
// });

router.get('/delete/:id', (req, res, next) => {

    const id = req.params.id;
    const sql = `DELETE FROM products WHERE id = '${id}'`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/products');
    });

    // req.send('retailer');
});

module.exports = router;
