const express = require('express');

const router = express.Router();
router.get('/', (req, res) => {
  if (req.session.user_id) {
    if (req.session.roll_id == 1) {
      let select_category_sql = 'SELECT * FROM categorys';
      db.query(select_category_sql, (err, results) => {
        res.render('pages/admin/category.ejs', { results });
      });
    } else {
      res.render('pages/index.ejs');
    }
  } else {
    res.render('pages/index.ejs', { title: 'login' });
  }
});

router.get('/addcategory', (req, res) => {
  if (req.session.user_id) {
    // const sql = "SELECT * FROM categorys";
    // db.query(sql, (err, results) => {
    //     res.render('pages/admin/category.ejs', {results});
    // });
  } else {
    res.render('pages/index.ejs', { title: 'login' });
  }
});

router.post('/addcategory', (req, res) => {
  if (req.session.user_id) {
    // const sql = "SELECT * FROM categorys";
    // db.query(sql,(err, results) => {
    //     res.render('pages/admin/category.ejs', {results});
    // });
  } else {
    res.render('pages/index.ejs', { title: 'login' });
  }
});

router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const delete_category_sql = `DELETE FROM categorys WHERE id ='${id}'`;
  // console.log(delete_category_sql);
  db.query(delete_category_sql, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/categorys');
  });
});

module.exports = router;
