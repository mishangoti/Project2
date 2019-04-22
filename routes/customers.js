const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const sql = "SELECT * FROM users WHERE roll_id = 3";
            db.query(sql, (err, results) => {
                res.render('pages/admin/customers.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

// router.post('/', (req, res, next) => {
//     if(req.session.user_id){

//     } else {
//         res.render('pages/index.ejs', { title: 'login' });        
//     }
// });

// this is for ajax call
// router.post('/userprofile',(req, res, next) => {
//     const id = req.body.id;
//     // res.send(true);
//     const check_roll_sql = `SELECT roll_id FROM users WHERE id = '${id}'`;
//     db.query(check_roll_sql, (err, check_roll_sql_results) => {
//         if(check_roll_sql_results[0].roll_id == 3){
//             const sql = "UPDATE `users` SET roll_id = 2 WHERE id = '"+id+"'";
//             db.query(sql, (err, result) => {
//                 if (err) {
//                     return res.status(500).send(err);
//                 }
//                 const select_sql = "SELECT * FROM users WHERE roll_id = 3";
//                 db.query(select_sql, (err, result) => {
//                     result.forEach(element => {
//                         const html = "<tr>";
//                         html += "<td>"+element.id+"</td>";
//                         html += "<td>"+element.name+"</td>";
//                         html += "<td>"+element.email+"</td>";
//                         html += "<td><button class='btn user_profile' onclick='return confirm('Are you sure you want to Make Him/Her Retailer?')'>";
//                         html += "<input type=''hidden class='user_id name='user_id' value='"+element.id+"'";
//                         html += "</button></td>";

//                         html += "</tr>";
//                         res.send(html);
//                     });        


//                 });
//             });
//         }else if(check_roll_sql_results[0].roll_id == 2){
//             const sql = "UPDATE `users` SET roll_id = 3 WHERE id = '"+id+"'";
//             db.query(sql, (err, result) => {
//             if (err) {
//                 return res.status(500).send(err);
//             }
//             res.send(true);
//             });
//         }
//     });
//     // return res.send(true);
// });

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
                res.redirect('/customers');
            });
        } else if (check_roll_sql_results[0].roll_id == 2) {
            const sql = `UPDATE users SET roll_id = 3 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/customers');
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
                res.redirect('/customers');
            });
        } else {
            const sql = `UPDATE users SET status = 0 WHERE id = '${id}'`;
            db.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/customers');
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
        res.redirect('/customers');
    });
});


module.exports = router;

