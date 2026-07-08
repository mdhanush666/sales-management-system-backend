const express = require('express');
const router = express.Router();

const { getCustomer, createCustomer, updateCustomer } = require("../../controller/common/customerController");

router.get("/getCustomer", getCustomer);
router.get("/getCustomer/:id", getCustomer);
router.post("/createCustomer", createCustomer);
router.put("/updateCustomer/:id", updateCustomer);

module.exports = router;