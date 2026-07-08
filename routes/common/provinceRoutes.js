const express = require('express');
const router = express.Router();

const { getProvince } = require("../../controller/common/provinceController");

router.get("/getProvince", getProvince);

module.exports = router;