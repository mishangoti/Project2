const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/product_images/')
    },
    filename: (req, file, cb) => {
        const ext = (file.mimetype).split('/')[1]
        cb(null, file.fieldname + '_' + Date.now() + '.' + ext)
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res, next) => {
    const user_id = req.session.user_id;
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const get_my_product_sql = `SELECT pro.id as pro_id, pro.user_id, pro.name as pro_name, pro.description, pro.category_id, pro.price, pro.status as pro_status, pro.stock, pro.image, cat.name as cat_name, cat.status as cat_status FROM products as pro LEFT JOIN categorys as cat ON pro.category_id = cat.id LEFT JOIN users as u ON pro.user_id = u.id WHERE pro.user_id = '${user_id}'`;
            // console.log(get_my_product_sql);

            db.query(get_my_product_sql, (err, results) => {
                // console.log(results);
                res.render('pages/saller/myproducts.ejs', { results });
            });

        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/addproduct', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const category_sql = `SELECT * FROM categorys`;
            db.query(category_sql, (err, results) => {
                res.render('pages/saller/addproduct.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/addproduct', upload.single('pro_image'), (req, res, next) => {
    // res.send('yes');
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const user_id = req.session.user_id;
            const pro_name = req.body.pro_name;
            const pro_description = req.body.pro_description;
            const cat_id = req.body.cat_id;
            const pro_stock = req.body.pro_stock;
            const pro_price = req.body.pro_price;
            const pro_tags = req.body.hidden_pro_tags;

            const filename = req.file.filename;
            const path = "product_images/" + filename;

            console.log(user_id);
            console.log(pro_name);
            console.log(pro_description);
            console.log(cat_id);
            console.log(pro_stock);
            console.log(pro_price);
            console.log(pro_tags);
            console.log(path);
            
            const pro_error = [];
            if (!pro_name || !pro_description || !cat_id || !pro_stock || !pro_price || !pro_tags) {
                pro_error.push({
                    msg: 'Please fill all field'
                });
                const category_sql = `SELECT * FROM categorys`;
                db.query(category_sql, (err, results) => {
                    res.render('pages/saller/addproduct.ejs', { results, pro_error });
                });
            }

            const add_product_sql = `INSERT INTO products (user_id, name, description, category_id, stock, price, image) VALUES ('${user_id}','${pro_name}','${pro_description}','${cat_id}','${pro_stock}','${pro_price}','${path}')`;

            db.query(add_product_sql, (err, results) => {
                if (err) throw err;
                const last_id_sql = `SELECT MAX(ID) AS LastID FROM products`;
                db.query(last_id_sql, (err, last_id_sql_result) => {
                    pro_letest_id = last_id_sql_result[0].LastID;
                    console.log(last_id_sql_result);
                    console.log(pro_tags);
                    pro_tags.split(/\s*,\s*/).forEach((myString) => {
                        // console.log(myString);
                        add_tags_sql = `INSERT INTO product_tags (product_id, tag_name, status) VALUES ('${last_id_sql_result[0].LastID}','${myString}','1')`;
                        console.log(add_tags_sql);
                        db.query(add_tags_sql, () => { });
                    });

                    res.redirect('/myproducts');
                });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }


});

router.post('/addtags', (req, res, next) => {
    const pro_id_for_tag = req.body.pro_id_for_tag;
    const pro_tags = req.body.hidden_pro_tags;

    console.log(pro_tags);
    console.log(pro_id_for_tag);

    if (typeof pro_tags[0] == 'undefined') {
        console.log('no data');

    } else {
        // console.log('yes data');
        pro_tags.split(/\s*,\s*/).forEach((myString) => {
            // console.log(myString);
            update_tags_sql = `INSERT INTO product_tags (product_id, tag_name, status) VALUES ('${pro_id_for_tag}','${myString}','1')`;
            // console.log(update_tags_sql);
            db.query(update_tags_sql, (err, result) => {

            });
            res.redirect('/myproducts/edit/' + pro_id_for_tag + '');
        });
    }
});



router.post('/editproduct', upload.single('pro_image'), (req, res, next) => {

    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const pro_id = req.body.pro_id;
            const pro_name = req.body.pro_name;
            const pro_description = req.body.pro_description;
            const cat_id = req.body.cat_id;
            const pro_stock = req.body.pro_stock;
            const pro_price = req.body.pro_price;
            const old_image = req.body.old_image;
            // console.log(old_image);
            // console.log(req.file);

            if (typeof req.file == 'undefined') {
                const update_product_sql = `UPDATE products SET name= '${pro_name}',description = '${pro_description}',category_id = '${cat_id}',stock = '${pro_stock}' ,price = '${pro_price}',image = '${old_image}' WHERE id = '${pro_id}'`;
                db.query(update_product_sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/myproducts');
                    }
                });
            } else {
                console.log(req.file);
                const filename = req.file.filename;
                console.log(filename);
                const path = "product_images/" + filename;
                const update_product_sql = `UPDATE products SET name = '${pro_name}',description = '${pro_description}',category_id = '${cat_id}',stock = '${pro_stock}',price = '${pro_price}', image = '${path}' WHERE id = '${pro_id}'`;
                db.query(update_product_sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/myproducts');
                    }
                });
            }
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/addcategory', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            res.render('pages/saller/addcategory.ejs');
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/addcategory', (req, res, next) => {
    const cat_name = req.body.cat_name;
    const cat_description = req.body.cat_description;
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const add_cat_sql = `INSERT INTO categorys (name, description) VALUES ('${cat_name}','${cat_description}')`;
            db.query(add_cat_sql, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/myproducts/add');
                }
            });
            //res.render('pages/saller/addcategory.ejs');
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});


router.get('/edit/:id', (req, res, next) => {
    const pro_id = req.params.id;
    console.log(pro_id);
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            const category_sql = `SELECT p.id as pro_id, p.name as pro_name, p.description, p.category_id, p.stock, p.price, p.image, c.id as cat_id, c.name as cat_name FROM products as p LEFT JOIN categorys as c ON p.category_id = c.id WHERE p.id = '${pro_id}'`;
            // console.log(category_sql);
            db.query(category_sql, (err, results) => {
                const category_sql = `SELECT * FROM categorys`;
                db.query(category_sql, (err, cat_results) => {
                    const pro_tags_sql = `SELECT * FROM product_tags WHERE product_id = '${pro_id}'`;
                    db.query(pro_tags_sql, (err, pro_tags_sql_result) => {
                        // console.log(pro_tags_sql_result);
                        res.render('pages/saller/editproduct.ejs', { results, cat_results, pro_id, pro_tags_sql_result });
                    });
                });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/status/:id', (req, res, next) => {
    const id = req.params.id;
    // console.log(id);
    const check_status_sql = `SELECT status FROM products WHERE id = '${id}'`;
    db.query(check_status_sql, (err, check_status_sql_results) => {
        if (check_status_sql_results[0].status == 0) {
            const sql = `UPDATE products SET status = 1 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/myproducts');
            });
        } else {
            const sql = `UPDATE products SET status = 0 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/myproducts');
            });
        }
    });
});


router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    const sql = `DELETE FROM products WHERE id = '${id}'`;
    // console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/myproducts');
    });
});

router.post('/delete_tag', (req, res, next) => {
    const tag_id = req.body.tag_id;
    // console.log(tag_id);
    const delete_tag_sql = `DELETE FROM product_tags WHERE id = '${tag_id}'`;
    db.query(delete_tag_sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(true);
        }
    });
});

module.exports = router;
