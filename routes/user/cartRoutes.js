const express = require('express');
const router = express.Router();

const { createCart, getCart, updateCart } = require('../../controller/user/cartController');

router.post("/createCart", createCart);
router.get("/getCart", getCart);
router.get("/getCart/:id", getCart);
router.put("/updateCart/:id", updateCart);


module.exports = router;