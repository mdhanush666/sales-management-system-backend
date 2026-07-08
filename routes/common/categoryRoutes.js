const express = require('express');
const router = express.Router();

const { getCategory, createCategory, updateCategory } = require("../../controller/common/categoryController");

router.get("/getCategory", getCategory);
router.get("/getCategory/:id", getCategory);
router.post("/createCategory", createCategory);
router.put("/updateCategory/:id", updateCategory);

module.exports = router;