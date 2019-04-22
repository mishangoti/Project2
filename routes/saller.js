const express = require('express');
const router = express.Router();
const server = require('http').createServer();

const io = require('socket.io')(server);


router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            res.render('pages/saller/saller.ejs');
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.get('/products', (req, res, next) => {

});

router.get('/products/status', (req, res, next) => {
    const id = req.params.id;
    // console.log
    // const check_status_sql = "SELECT status FROM users WHERE id = '"+id+"'";
    // db.query(check_status_sql, (err, check_status_sql_results) => {
    //     if(check_status_sql_results[0].status == 0){
    //         const sql = "UPDATE `users` SET status = 1 WHERE id = '"+id+"'";
    //         db.query(sql, (err, result) => {
    //         if (err) {
    //             return res.status(500).send(err);
    //         }
    //         res.redirect('/customers');
    //         });
    //     }else{
    //         const sql = "UPDATE `users` SET status = 0 WHERE id = '"+id+"'";
    //         db.query(sql, (err, result) => {
    //         if (err) {
    //             return res.status(500).send(err);
    //         }
    //         res.redirect('/customers');
    //         });
    //     }
    // });

});

router.get('/orders', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 2) {
            res.render('pages/saller/orders.ejs');
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/live_chat', (req, res, next) => {
    // const message = req.body.message;
    // res.send(message);

    io.on('connection', socket => {
        socket.emit('request', message); // emit an event to the socket
        io.emit('broadcast', message); // emit an event to all connected sockets
        socket.on('reply', (msg) => { 
            // res.send(msg);
            // console.log('you are connected');
        }); // listen to the event
        console.log('you are online');
    });
    console.log(socket.emit('request', message));
});

module.exports = router;
