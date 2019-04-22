const express = require('express');
const router = express.Router();
var products = require('../../controllers/products');

router.get('/', (req, res) => {
    res.send('hi this is api');
});
router.get('/products', products.list);
router.get('/product/view/:id', products.single);
// router.get('/products/delete/id', products.delete);
// router.get('/products/edit/id', products.edit);


module.exports = router;
