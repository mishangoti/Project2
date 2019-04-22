const express = require('express');
const router = express.Router();
// this module is for cron job
const CronJob = require('cron').CronJob;
const unirest = require("unirest");

const QRCode = require('qrcode')

/* GET users listing. */
router.get('/', (req, res, next) => {
    // check if user is login or note using session 
    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            res.render('pages/admin/dashboard.ejs');
        } else {
            res.render('pages/index.ejs', { message: 'You Are Not Admin' });
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});
router.get('/cron_job', (req, res, next) => {
    console.log('outside the cron job');

    new CronJob('* * * * * *', () => {
        console.log("staring cron");
    }, null, true, 'America/Los_Angeles');

});

router.get('/htmltopdf', (req, res, next) => {
    const fs = require('fs')
    const conversion = require("phantom-html-to-pdf")();

    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        conversion({
            html:
                `<center><h1>Hello World</h1></center>
            <table>
                <thead>
                    <th>roll_id</th>        
                    <th>name</th>        
                    <th>email</th>        
                    <th>status</th>         
                    <th>token</th>        
                </thead>
                <tbody>
                    <tr>
                        <td width="5%">1</td>
                        <td width="10%">mishan</td>
                        <td width="40%">mishan2512@gmail.com</td>
                        <td width="5%">1</td>
                        <td width="40%">asdmnuaewfahebfy</td>
                    </tr>
                </tbody>
            </table>`
        },
            (err, pdf) => {
                const time = Date.now();
                const output = fs.createWriteStream('public/pdf/' + time + '.pdf');
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                pdf.stream.pipe(output);
            }
        );
    });

    res.redirect('/dashboard');
});

router.get('/sms', (res, next) => {
    const req = unirest("GET", "https://www.fast2sms.com/dev/bulk");
    req.query({
        "authorization": "pvWPY4sc7mt8N2KjSzM1X3oiAaLqUBTylheJ5fgCrVkdQIwD0RCIv2tmeup8ayUdhfNo96rsOVL15HFc",
        "sender_id": "FSTSMS",
        "message": "This is a test message",
        "language": "english",
        "route": "p",
        "numbers": "7984444322",
    });

    req.headers({
        "cache-control": "no-cache"
    });

    req.end((res) => {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
    });
});
router.post('/sms', (req, res, next) => {
    // const unirest = require("unirest");
    // const req = unirest("POST", "https://www.fast2sms.com/dev/bulk");
    // req.headers({
    //     "authorization": "pvWPY4sc7mt8N2KjSzM1X3oiAaLqUBTylheJ5fgCrVkdQIwD0RCIv2tmeup8ayUdhfNo96rsOVL15HFc"
    // });
    // req.form({
    //     "sender_id": "FSTSMS",
    //     "message": "This is a test message from mishan",
    //     "language": "english",
    //     "route": "p",
    //     "numbers": "9510151715",
    // });

    // req.end((res) => {
    //     if (res.error) throw new Error(res.error);
    //     console.log(res.body);
    // });
});

router.get('/qrcode', (req, res, next) => {
    const segs = [
        { data: 'ABCDEFG', mode: 'alphanumeric' },
        { data: '0123456', mode: 'numeric' }
    ]
    QRCode.toDataURL(segs, { errorCorrectionLevel: 'H', version: 2 }, (err, url) => {
        // QRCode.pipe(url);

        console.log(url)
        const qr = url;
        res.render('pages/admin/qrcode.ejs', { qr });
    });
    // QRCode.toString('http://www.google.com', (err, string) => {
    //     if (err) throw err
    //     console.log(string)
    // })
    // QRCode.toCanvas('canvas', 'http://www.google.com', (err, string) => {
    //     console.log(string  );
    // })
});


module.exports = router;
