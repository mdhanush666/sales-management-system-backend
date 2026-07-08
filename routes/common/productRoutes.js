const express = require('express');
const router = express.Router();

const { getProduct, createProduct, updateProduct } = require("../../controller/common/productController");

router.get("/getProduct", getProduct);
router.get("/getProduct/:id", getProduct);
router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);

module.exports = router;