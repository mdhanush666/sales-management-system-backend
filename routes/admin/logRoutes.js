const express = require("express");
const router = express.Router();

const { createLog, getLog } = require("../../controller/admin/logController");

router.post("/createLog", createLog);
router.get("/getLog", getLog);

module.exports = router;