const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {

    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const sql = `SELECT * FROM users WHERE roll_id = 2`;
            db.query(sql, function (err, results) {
                res.render('pages/admin/retailers.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/userprofile/:id', (req, res, next) => {
    const id = req.params.id;
    const check_roll_sql = `SELECT roll_id FROM users WHERE id = '${id}'`;
        db.query(check_roll_sql, (err, check_roll_sql_results) => {
        if (check_roll_sql_results[0].roll_id == 3) {
            const sql = `UPDATE users SET roll_id = 2 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/retailers');
            });
        } else if (check_roll_sql_results[0].roll_id == 2) {
            const sql = `UPDATE users SET roll_id = 3 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/retailers');
            });
        }
    });
});

router.get('/status/:id', (req, res, next) => {
    const id = req.params.id;
    const check_status_sql = `SELECT status FROM users WHERE id = '${id}'`;
    db.query(check_status_sql, (err, check_status_sql_results) => {
        if (check_status_sql_results[0].status == 0) {
            const sql = `UPDATE users SET status = 1 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/retailers');
            });
        } else {
            const sql = `UPDATE users SET status = 0 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/retailers');
            });
        }
    });
});

router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    const sql = `DELETE FROM users WHERE id = '${id}'`;
    // console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/retailers');
    });
});

module.exports = router;
