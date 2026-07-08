const express = require("express");
const router = express.Router();

const { createLoginHistory, getLoginHistory } = require("../../controller/admin/loginHistoryController");

router.post("/createLoginHistory", createLoginHistory);
router.get("/getLoginHistory", getLoginHistory);

module.exports = router;