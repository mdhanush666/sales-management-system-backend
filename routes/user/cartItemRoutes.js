const express = require('express');
const router = express.Router();

const { getCartItem } = require('../../controller/user/cartItemController');

router.get("/getCartItem", getCartItem);
router.get("/getCartItem/:id", getCartItem);

module.exports = router;