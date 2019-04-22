const express = require('express');
// image uploading
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/slider/')
    },
    filename: (req, file, cb) => {
        const ext = (file.mimetype).split('/')[1]
        cb(null, file.fieldname + '_' + Date.now() + '.' + ext)
    }
});

const upload = multer({ storage: storage });
// const upload = multer({ dest: 'public/slider/' });

const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const sql = "SELECT * FROM slider";
            db.query(sql, (err, results) => {
                res.render('pages/slider/manageslider.ejs', { results });
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
});

router.post('/', upload.single('image'), (req, res, next) => {

    // res.send('yes');
    console.log(req.file);

    if (req.session.user_id) {
        if (req.session.roll_id == 1) {
            const str = req.file.mimetype;
            const filename = req.file.filename;
            const one = str.split("/");
            const path = "slider/" + filename;
            const sql = `INSERT INTO slider (image) VALUES ('${path}')`;
            console.log(sql);
            db.query(sql, (err, results) => {
                if (err) throw err;
                // res.redirect('/manageslider');
            });
        } else {
            res.render('pages/index.ejs');
        }
    } else {
        res.render('pages/index.ejs', { title: 'login' });
    }
})

router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    const sql = `DELETE FROM slider WHERE id = ${id}'`;
    // console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/manageslider');
    });
});
module.exports = router;
