const express = require('express');
const router = express.Router();

const { createOrder, getOrder, updateOrder } = require('../../controller/user/orderController');

router.post("/createOrder", createOrder);
router.get("/getOrder", getOrder);
router.get("/getOrder/:id", getOrder);
router.put("/updateOrder/:id", updateOrder);


module.exports = router;