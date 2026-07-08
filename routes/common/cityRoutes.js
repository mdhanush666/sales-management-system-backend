const express = require('express');
const router = express.Router();

const { getCity, addCity, updateCity } = require("../../controller/common/cityController");

router.get("/getCity", getCity);
router.get("/getCity/:id", getCity);
router.post("/addCity", addCity);
router.put("/updateCity/:id", updateCity);

module.exports = router;