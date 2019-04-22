const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.vender('pages/dashboard.ejs');
  res.send('home');
});

module.exports = router;
