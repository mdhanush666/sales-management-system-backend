const express = require('express');
const router = express.Router();

const { getDistrict } = require("../../controller/common/districtController");

router.get("/getDistrict", getDistrict);

module.exports = router;