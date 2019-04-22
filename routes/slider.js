const express = require('express');
const router = express.Router();



router.get('/', function(req, res, next) { 
    if(req.session.user_id){
        if(req.session.roll_id == 1){
            const sql = `SELECT * FROM slider`;
            db.query(sql, function(err, results){
                res.render('pages/slider/slider.ejs', {results});
            });
        }else{
            res.render('pages/index.ejs');
        }
      }else{
        res.render('pages/index.ejs', { title: 'login' });
    }
});
  

module.exports = router;
