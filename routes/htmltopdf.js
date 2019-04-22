var express = require('express');
var router = express.Router();
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('public/htmltopdf/businesscard.html', 'utf8');
var options = { format: 'Letter', directory: "public/htmltopdf/", };



router.get('/', (req, res, next) => {

    // if(req.session.user_id){
    console.log('still it is out');
    pdf.create(html, options).toFile('./businesscard.pdf', (err, res) => {
        if (err) return console.log(err);
        res.send('pdf generated');
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    // res.render('pages/admin/htmltopdf.ejs');
    //   }else{
    //     res.render('pages/index.ejs', { title: 'login' });
    // }
});


module.exports = router;
